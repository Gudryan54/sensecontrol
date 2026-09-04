// Tipos que espelham o formato retornado pela API do backend (ver
// backend/src/services/*.ts) - mantidos manualmente, sem geração
// automática, pelo mesmo motivo de manter o projeto simples para o MVP
// acadêmico (ver docs/DECISOES_DE_TECNOLOGIA.md).

export interface Local {
  id: number;
  usuario_id: number;
  nome: string;
  endereco: string | null;
}

export interface Dispositivo {
  id: number;
  local_id: number;
  nome: string;
  identificador_mac: string;
  status: 'ativo' | 'offline' | 'aguardando_conexao';
  criado_em: string;
}

export type TipoSensor = 'agua' | 'energia';

export interface Sensor {
  id: number;
  dispositivo_id: number;
  tipo: TipoSensor;
  unidade_medida: 'litros' | 'kWh';
  criado_em: string;
}

export interface Leitura {
  id: number;
  sensor_id: number;
  valor: string; // DECIMAL vem como string do backend, ver leituras.service.ts
  timestamp: string;
}

export interface ConsumoDiario {
  id: number;
  sensor_id: number;
  data: string;
  consumo_total: string;
}
