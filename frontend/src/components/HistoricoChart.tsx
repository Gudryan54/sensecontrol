import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { ConsumoDiario } from '../api/types';
import { formatarDataCurta, formatarNumero } from '../utils/formatadores';

interface Props {
  titulo: string;
  unidade: string;
  cor: string;
  consumoDiario: ConsumoDiario[];
}

/**
 * Gráfico de histórico de consumo diário de um sensor (Etapa 4),
 * lendo diretamente a agregação pré-calculada em consumo_diario -
 * mesma fonte de dados do tile de "consumo hoje" (ConsumoTile).
 */
export function HistoricoChart({ titulo, unidade, cor, consumoDiario }: Props) {
  const dados = consumoDiario.map((c) => ({
    data: formatarDataCurta(c.data),
    consumo: Number(c.consumo_total),
  }));

  return (
    <div className="grafico">
      <h3>{titulo}</h3>
      {dados.length === 0 ? (
        <p className="grafico-vazio">Ainda sem histórico suficiente para exibir o gráfico.</p>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={dados} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--cor-grade)" />
            <XAxis dataKey="data" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} width={48} />
            <Tooltip
              formatter={(valor: number) => [`${formatarNumero(valor)} ${unidade}`, 'Consumo']}
              contentStyle={{ fontSize: 13 }}
            />
            <Bar dataKey="consumo" fill={cor} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
