import { pool } from '../config/db';
import { garantirSensorExiste } from './sensores.service';

export interface ConsumoDiario {
  id: number;
  sensor_id: number;
  data: string; // DATE vem do driver `pg` como string 'YYYY-MM-DD'
  consumo_total: string; // DECIMAL vem como string, mesma razão de leituras.service.ts
}

const LIMITE_MAXIMO_RESULTADOS = 366; // até um ano de agregados diários é mais que suficiente para o MVP

/**
 * Consulta a agregação diária de consumo (tabela consumo_diario, seção
 * 8 da documentação técnica) de um sensor - é o que sustenta o gráfico
 * de histórico e o tile de "consumo hoje" do dashboard (Etapa 4), sem
 * precisar somar a tabela "leituras" inteira a cada requisição (razão
 * de a agregação já existir pré-calculada desde a Etapa 1).
 */
export async function listarConsumoDiario(filtro: {
  sensor_id: number;
  inicio?: string;
  fim?: string;
}): Promise<ConsumoDiario[]> {
  await garantirSensorExiste(filtro.sensor_id);

  const condicoes = ['sensor_id = $1'];
  const valores: unknown[] = [filtro.sensor_id];

  if (filtro.inicio) {
    valores.push(filtro.inicio);
    condicoes.push(`data >= $${valores.length}`);
  }
  if (filtro.fim) {
    valores.push(filtro.fim);
    condicoes.push(`data <= $${valores.length}`);
  }

  const result = await pool.query<ConsumoDiario>(
    `SELECT id, sensor_id, data, consumo_total FROM consumo_diario
     WHERE ${condicoes.join(' AND ')}
     ORDER BY data ASC
     LIMIT ${LIMITE_MAXIMO_RESULTADOS}`,
    valores,
  );
  return result.rows;
}
