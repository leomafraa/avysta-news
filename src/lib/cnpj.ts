/** Remove caracteres não numéricos do CNPJ. */
export function normalizeCnpj(cnpj: string): string {
  return cnpj.replace(/\D/g, "");
}

/** Formata CNPJ como 00.000.000/0000-00 */
export function formatCnpj(cnpj: string): string {
  const d = normalizeCnpj(cnpj).padStart(14, "0").slice(-14);
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
}

/** Valida dígitos verificadores do CNPJ (Receita Federal). */
export function isValidCnpj(cnpj: string): boolean {
  const clean = normalizeCnpj(cnpj);
  if (clean.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(clean)) return false;

  const digits = clean.split("").map(Number);

  const calcDigit = (length: number, weights: number[]) => {
    let sum = 0;
    for (let i = 0; i < length; i++) sum += digits[i] * weights[i];
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const d1 = calcDigit(12, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  if (digits[12] !== d1) return false;

  const d2 = calcDigit(13, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  return digits[13] === d2;
}

/** Mensagem de erro para exibir no formulário/API, ou null se válido. */
export function getCnpjValidationError(cnpj: string): string | null {
  const clean = normalizeCnpj(cnpj);
  if (!clean) return "Informe o CNPJ.";
  if (clean.length !== 14) return "CNPJ deve ter 14 dígitos.";
  if (!isValidCnpj(clean)) return "CNPJ inválido. Verifique os números digitados.";
  return null;
}
