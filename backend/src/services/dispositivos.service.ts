import { pool } from '../config/db';
import { ApiError } from '../utils/ApiError';

export interface Dispositivo {
  id: number;
  local_id: number;
  nome: string;
  identificador_mac: string;
  status: string;
  criado_em: Date;
}

async function garantirLocalExiste(localId: number): Promise<void> {
  const result = await pool.query('SELECT 1 FROM locais WHERE id = $1', [localId]);
  if (result.rowCount === 0) {
    throw ApiError.notFound(`Local ${localId} não encontrado.`);
  }
}

export async function criarDispositivo(dados: {
  local_id: number;
  nome: string;
  identificador_mac: string;
}): Promise<Dispositivo> {
  await garantirLocalExiste(dados.local_id);

  const macEmUso = await pool.query('SELECT 1 FROM dispositivos WHERE identificador_mac = $1', [
    dados.identificador_mac,
  ]);
  if (macEmUso.rowCount !== null && macEmUso.rowCount > 0) {
    throw ApiError.conflict(
      `Já existe um dispositivo cadastrado com o identificador_mac "${dados.identificador_mac}".`,
    );
  }

  // Todo dispositivo novo entra como "aguardando_conexao" (seção 5 -
  // caso de uso de cadastro de dispositivo): só passa a "ativo"
  // quando o gateway de fato publicar a primeira leitura (Etapa 3).
  const result = await pool.query<Dispositivo>(
    `INSERT INTO dispositivos (local_id, nome, identificador_mac, status)
     VALUES ($1, $2, $3, 'aguardando_conexao')
     RETURNING id, local_id, nome, identificador_mac, status, criado_em`,
    [dados.local_id, dados.nome, dados.identificador_mac],
  );
  return result.rows[0];
}

export async function listarDispositivosPorLocal(localId: number): Promise<Dispositivo[]> {
  await garantirLocalExiste(localId);

  const result = await pool.query<Dispositivo>(
    `SELECT id, local_id, nome, identificador_mac, status, criado_em
     FROM dispositivos WHERE local_id = $1 ORDER BY id`,
    [localId],
  );
  return result.rows;
}
