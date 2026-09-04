import { pool } from '../config/db';
import { ApiError } from '../utils/ApiError';

export interface Local {
  id: number;
  usuario_id: number;
  nome: string;
  endereco: string | null;
}

async function garantirUsuarioExiste(usuarioId: number): Promise<void> {
  const result = await pool.query('SELECT 1 FROM usuarios WHERE id = $1', [usuarioId]);
  if (result.rowCount === 0) {
    throw ApiError.notFound(`Usuário ${usuarioId} não encontrado.`);
  }
}

export async function criarLocal(dados: {
  usuario_id: number;
  nome: string;
  endereco?: string;
}): Promise<Local> {
  await garantirUsuarioExiste(dados.usuario_id);

  const result = await pool.query<Local>(
    `INSERT INTO locais (usuario_id, nome, endereco)
     VALUES ($1, $2, $3)
     RETURNING id, usuario_id, nome, endereco`,
    [dados.usuario_id, dados.nome, dados.endereco ?? null],
  );
  return result.rows[0];
}

export async function listarLocaisPorUsuario(usuarioId: number): Promise<Local[]> {
  await garantirUsuarioExiste(usuarioId);

  const result = await pool.query<Local>(
    `SELECT id, usuario_id, nome, endereco FROM locais WHERE usuario_id = $1 ORDER BY id`,
    [usuarioId],
  );
  return result.rows;
}
