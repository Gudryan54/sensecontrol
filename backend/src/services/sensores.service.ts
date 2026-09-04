import { pool } from '../config/db';
import { ApiError } from '../utils/ApiError';

export interface Sensor {
  id: number;
  dispositivo_id: number;
  tipo: string;
  unidade_medida: string;
  criado_em: Date;
}

export async function garantirSensorExiste(sensorId: number): Promise<Sensor> {
  const result = await pool.query<Sensor>(
    `SELECT id, dispositivo_id, tipo, unidade_medida, criado_em FROM sensores WHERE id = $1`,
    [sensorId],
  );
  if (result.rowCount === 0) {
    throw ApiError.notFound(`Sensor ${sensorId} não encontrado.`);
  }
  return result.rows[0];
}

export async function criarSensor(dados: {
  dispositivo_id: number;
  tipo: string;
  unidade_medida: string;
}): Promise<Sensor> {
  const dispositivo = await pool.query('SELECT 1 FROM dispositivos WHERE id = $1', [
    dados.dispositivo_id,
  ]);
  if (dispositivo.rowCount === 0) {
    throw ApiError.notFound(`Dispositivo ${dados.dispositivo_id} não encontrado.`);
  }

  const result = await pool.query<Sensor>(
    `INSERT INTO sensores (dispositivo_id, tipo, unidade_medida)
     VALUES ($1, $2, $3)
     RETURNING id, dispositivo_id, tipo, unidade_medida, criado_em`,
    [dados.dispositivo_id, dados.tipo, dados.unidade_medida],
  );
  return result.rows[0];
}
