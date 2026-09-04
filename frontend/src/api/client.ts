import type { ConsumoDiario, Dispositivo, Leitura, Local, Sensor } from './types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

/**
 * Wrapper fino sobre fetch: monta a URL, faz o parse do JSON e
 * converte uma resposta de erro (formato "{ erro, detalhes? }" do
 * errorHandler do backend) numa mensagem legível, em vez de deixar o
 * componente lidar com Response diretamente.
 */
async function apiGet<T>(path: string, params: Record<string, string | number>): Promise<T> {
  const query = new URLSearchParams(
    Object.fromEntries(Object.entries(params).map(([chave, valor]) => [chave, String(valor)])),
  );
  const resposta = await fetch(`${API_URL}${path}?${query.toString()}`);

  if (!resposta.ok) {
    const corpo = await resposta.json().catch(() => null);
    const mensagem = corpo?.erro ?? `Erro ${resposta.status} ao consultar ${path}`;
    throw new Error(mensagem);
  }

  return resposta.json() as Promise<T>;
}

export function listarLocais(usuarioId: number): Promise<Local[]> {
  return apiGet<Local[]>('/locais', { usuario_id: usuarioId });
}

export function listarDispositivos(localId: number): Promise<Dispositivo[]> {
  return apiGet<Dispositivo[]>('/dispositivos', { local_id: localId });
}

export function listarSensores(dispositivoId: number): Promise<Sensor[]> {
  return apiGet<Sensor[]>('/sensores', { dispositivo_id: dispositivoId });
}

export function listarLeituras(sensorId: number, inicio?: string): Promise<Leitura[]> {
  return apiGet<Leitura[]>(
    '/leituras',
    inicio ? { sensor_id: sensorId, inicio } : { sensor_id: sensorId },
  );
}

export function listarConsumoDiario(sensorId: number): Promise<ConsumoDiario[]> {
  return apiGet<ConsumoDiario[]>('/consumo-diario', { sensor_id: sensorId });
}
