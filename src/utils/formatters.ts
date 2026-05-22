// 🎯 CONVERTE TEXTOS INFORMATIVOS PARA TITLE CASE
export function aplicarTitleCase(str: string | null | undefined): string {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(" ")
    .filter((word) => word.trim() !== "")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// 🎯 MÁSCARA DINÂMICA PARA CPF E CNPJ
export function aplicarCpfCnpj(v: string): string {
  let valorLimpo = v.replace(/\D/g, "");
  
  if (valorLimpo.length <= 11) {
    // Regra do CPF
    valorLimpo = valorLimpo.substring(0, 11);
    valorLimpo = valorLimpo.replace(/(\d{3})(\d)/, "$1.$2");
    valorLimpo = valorLimpo.replace(/(\d{3})(\d)/, "$1.$2");
    valorLimpo = valorLimpo.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  } else {
    // Regra do CNPJ
    valorLimpo = valorLimpo.substring(0, 14);
    valorLimpo = valorLimpo.replace(/^(\d{2})(\d)/, "$1.$2");
    valorLimpo = valorLimpo.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
    valorLimpo = valorLimpo.replace(/\.(\d{3})(\d)/, ".$1/$2");
    valorLimpo = valorLimpo.replace(/(\d{4})(\d)/, "$1-$2");
  }
  return valorLimpo;
}

// 🎯 MÁSCARA DE MOEDA (R$ 0,00)
export function aplicarMascaraMoeda(v: string): string {
  const numStr = v.replace(/\D/g, "");
  if (!numStr) return "";
  
  const calculado = (Number(numStr) / 100).toFixed(2);
  let formatado = calculado.replace(".", ",");
  formatado = formatado.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  return "R$ " + formatado;
}