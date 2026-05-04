import { NextRequest, NextResponse } from "next/server";
import { isValidEmail } from "@/lib/auth";
import { getSiteUrl } from "@/lib/siteUrl";
import { getSupabaseAuthClient } from "@/lib/supabaseAnon";

type AuthErr = { message?: string; code?: string; status?: number };

function isEmailRateLimitError(err: AuthErr): boolean {
  const msg = err.message?.toLowerCase() ?? "";
  if (msg.includes("rate limit") || msg.includes("too many requests")) return true;
  if (err.code === "over_email_send_rate_limit") return true;
  if (err.status === 429) return true;
  return false;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: "Informe um e-mail válido." }, { status: 400 });
    }

    const supabase = getSupabaseAuthClient();
    const redirectTo = `${getSiteUrl()}/atualizar-senha`;

    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });

    if (error) {
      console.error("[API /auth/forgot-password]", error.message, (error as AuthErr).code);
      if (isEmailRateLimitError(error as AuthErr)) {
        return NextResponse.json(
          {
            error: "Não foi possível enviar o e-mail. Tente novamente mais tarde.",
          },
          { status: 429 }
        );
      }
    }

    // Same message whether or not the e-mail exists (avoid account enumeration)
    return NextResponse.json({
      message:
        "Se existir uma conta com este e-mail, você receberá um link para redefinir a senha em instantes.",
    });
  } catch (error) {
    console.error("[API /auth/forgot-password]", error);
    return NextResponse.json({
      message:
        "Se existir uma conta com este e-mail, você receberá um link para redefinir a senha em instantes.",
    });
  }
}
