import { supabaseServer } from "@/lib/supabaseServer";

const BUCKET = process.env.SUPABASE_PROVIDER_LOGO_BUCKET || "provider-logos";
const MAX_BYTES = 2 * 1024 * 1024;

/** Falha ao salvar empresa (Storage ou banco): mensagem genérica; detalhes só no log do servidor. */
export const MSG_PROVIDER_SAVE_FAILED =
  "Não foi possível salvar a empresa. Tente novamente mais tarde.";

const MIME_TO_EXT = new Map<string, string>([
  ["image/png", "png"],
  ["image/jpeg", "jpg"],
  ["image/jpg", "jpg"],
  ["image/svg+xml", "svg"],
]);

function normalizeMime(mime: string): string {
  const base = mime.split(";")[0].trim().toLowerCase();
  if (base === "image/jpg") return "image/jpeg";
  return base;
}

export function parseProviderLogoDataUrl(
  dataUrl: string
): { buffer: Buffer; contentType: string; ext: string } | { error: string } {
  const trimmed = dataUrl.trim();
  if (!trimmed.startsWith("data:")) {
    return { error: "Formato de imagem inválido." };
  }
  const base64Idx = trimmed.indexOf(";base64,");
  if (base64Idx === -1) {
    return { error: "Use PNG, JPEG ou SVG em formato suportado pelo navegador." };
  }
  const header = trimmed.slice(5, base64Idx);
  const mimeRaw = header.split(";")[0].trim();
  const rawMime = normalizeMime(mimeRaw);
  const ext = MIME_TO_EXT.get(rawMime);
  if (!ext) {
    return { error: "Use PNG, JPEG ou SVG." };
  }
  const b64 = trimmed.slice(base64Idx + 8).replace(/\s/g, "");
  let buffer: Buffer;
  try {
    buffer = Buffer.from(b64, "base64");
  } catch {
    return { error: "Imagem inválida." };
  }
  if (buffer.length > MAX_BYTES) {
    return { error: "A imagem deve ter no máximo 2 MB." };
  }
  if (buffer.length === 0) {
    return { error: "Arquivo vazio." };
  }
  const contentType = rawMime === "image/jpg" ? "image/jpeg" : rawMime;
  return { buffer, contentType, ext };
}

export async function uploadProviderLogoFromDataUrl(
  providerId: string,
  dataUrl: string
): Promise<{ url: string } | { error: string }> {
  const parsed = parseProviderLogoDataUrl(dataUrl);
  if ("error" in parsed) {
    return parsed;
  }
  const { buffer, contentType, ext } = parsed;

  const path = `${providerId}/logo-${Date.now()}.${ext}`;
  const { error: upErr } = await supabaseServer.storage.from(BUCKET).upload(path, buffer, {
    contentType,
    upsert: true,
  });

  if (upErr) {
    console.error("[uploadProviderLogo]", {
      bucket: BUCKET,
      message: upErr.message,
      name: upErr.name,
    });
    return { error: MSG_PROVIDER_SAVE_FAILED };
  }

  const { data: pub } = supabaseServer.storage.from(BUCKET).getPublicUrl(path);
  return { url: pub.publicUrl };
}
