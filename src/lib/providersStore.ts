import { promises as fs } from "fs";
import path from "path";
import type { Provider } from "@/types/providers";

const DATA_FILE = path.join(process.cwd(), "src/data/providers.json");

export async function readProviders(): Promise<Provider[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw) as Provider[];
  } catch {
    return [];
  }
}

export async function writeProviders(providers: Provider[]): Promise<void> {
  await fs.writeFile(DATA_FILE, JSON.stringify(providers, null, 2), "utf-8");
}

export async function addProvider(provider: Provider): Promise<void> {
  const providers = await readProviders();
  providers.push(provider);
  await writeProviders(providers);
}

export function generateId(): string {
  return `p${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}
