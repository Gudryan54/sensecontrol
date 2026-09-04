import { pool } from '../config/db';
import { garantirSensorExiste } from './sensores.service';

export interface Leitura {
  id: number;
  sensor_id: number;
  valor: string; // DECIMAL vem do driver `pg` como string, para não perder precisão
  timestamp: Date;
}

const LIMITE_MAXIMO_RESULTADOS = 1000;

/**
 * Registra uma nova leitura e atualiza a agregação diária de consumo
 * (consumo_diario) correspondente, na mesma transação - exatamente o
 * fluxo descrito nos passos 42-43 da seção 10 da documentação técnica
 * ("O dado validado é armazenado... o sistema atualiza a agregação
 * diária de consumo correspondente"). Fazer as duas escritas numa
 * transação evita a tabela consumo_diario ficar dessincronizada da
 * tabela leituras se algo falhar no meio do caminho.
 *
 * A detecção de desperdício/geração de alertas (passos 44-45) fica
 * para a Etapa 5 - aqui só persistimos o dado.
 */
export async function registrarLeitura(dados: {
  sensor_id: number;
  valor: number;
  timestamp?: string;
}): Promise<Leitura> {
  await garantirSensorExiste(dados.sensor_id);

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const leituraResult = await client.query<Leitura>(
      `INSERT INTO leituras (sensor_id, valor, "timestamp")
       VALUES ($1, $2, COALESCE($3::timestamp, NOW()))
       RETURNING id, sensor_id, valor, "timestamp"`,
      [dados.sensor_id, dados.valor, dados.timestamp ?? null],
    );
    const leitura = leituraResult.rows[0];

    await client.query(
      `INSERT INTO consumo_diario (sensor_id, data, consumo_total)
       VALUES ($1, $2::timestamp::date, $3)
       ON CONFLICT (sensor_id, data)
       DO UPDATE SET consumo_total = consumo_diario.consumo_total + EXCLUDED.consumo_total`,
      [leitura.sensor_id, leitura.timestamp, dados.valor],
    );

    await client.query('COMMIT');
    return leitura;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function listarLeituras(filtro: {
  sensor_id: number;
  inicio?: string;
  fim?: string;
}): Promise<Leitura[]> {
  await garantirSensorExiste(filtro.sensor_id);

  const condicoes = ['sensor_id = $1'];
  const valores: unknown[] = [filtro.sensor_id];

  if (filtro.inicio) {
    valores.push(filtro.inicio);
    condicoes.push(`"timestamp" >= $${valores.length}`);
  }
  if (filtro.fim) {
    valores.push(filtro.fim);
    condicoes.push(`"timestamp" <= $${valores.length}`);
  }

  const result = await pool.query<Leitura>(
    `SELECT id, sensor_id, valor, "timestamp" FROM leituras
     WHERE ${condicoes.join(' AND ')}
     ORDER BY "timestamp" ASC
     LIMIT ${LIMITE_MAXIMO_RESULTADOS}`,
    valores,
  );
  return result.rows;
}
