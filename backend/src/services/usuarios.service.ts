import { pool } from '../config/db';
import { ApiError } from '../utils/ApiError';

export interface UsuarioPublico {
  id: number;
  nome: string;
  email: string;
  perfil: string;
  criado_em: Date;
}

// Nunca selecionamos "senha_hash" nas consultas públicas abaixo -
// não é um campo que devolvemos em nenhuma resposta da API.
const COLUNAS_PUBLICAS = 'id, nome, email, perfil, criado_em';

export async function buscarUsuarioPorId(id: number): Promise<UsuarioPublico> {
  const result = await pool.query(`SELECT ${COLUNAS_PUBLICAS} FROM usuarios WHERE id = $1`, [id]);
  if (result.rowCount === 0) {
    throw ApiError.notFound(`Usuário ${id} não encontrado.`);
  }
  return result.rows[0];
}

export async function atualizarUsuario(
  id: number,
  dados: { nome?: string; email?: string },
): Promise<UsuarioPublico> {
  // Garante que o usuário existe antes de qualquer outra checagem,
  // para devolver 404 (e não 409/500) quando o id não existe.
  await buscarUsuarioPorId(id);

  if (dados.email) {
    const emailEmUso = await pool.query('SELECT id FROM usuarios WHERE email = $1 AND id <> $2', [
      dados.email,
      id,
    ]);
    if (emailEmUso.rowCount !== null && emailEmUso.rowCount > 0) {
      throw ApiError.conflict(`O email "${dados.email}" já está em uso por outro usuário.`);
    }
  }

  const campos: string[] = [];
  const valores: unknown[] = [];
  let indice = 1;

  if (dados.nome !== undefined) {
    campos.push(`nome = $${indice++}`);
    valores.push(dados.nome);
  }
  if (dados.email !== undefined) {
    campos.push(`email = $${indice++}`);
    valores.push(dados.email);
  }
  valores.push(id);

  const result = await pool.query(
    `UPDATE usuarios SET ${campos.join(', ')} WHERE id = $${indice} RETURNING ${COLUNAS_PUBLICAS}`,
    valores,
  );
  return result.rows[0];
}
