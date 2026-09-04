export function formatarNumero(valor: string | number, casas = 2): string {
  const numero = typeof valor === 'string' ? Number(valor) : valor;
  return numero.toLocaleString('pt-BR', {
    minimumFractionDigits: casas,
    maximumFractionDigits: casas,
  });
}

export function formatarHora(timestampIso: string): string {
  return new Date(timestampIso).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function formatarDataCurta(dataIso: string): string {
  // "data" de consumo_diario chega como DATE (sem hora) - usar UTC
  // para não deslocar o dia por causa do fuso do navegador.
  return new Date(dataIso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    timeZone: 'UTC',
  });
}
