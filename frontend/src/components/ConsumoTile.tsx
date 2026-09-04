import type { DadosSensor } from '../hooks/useDashboardData';
import { formatarHora, formatarNumero } from '../utils/formatadores';

interface Props {
  titulo: string;
  icone: string;
  dados: DadosSensor;
}

/**
 * Tile de consumo atual de um sensor: consumo do dia mais recente
 * (agregação pré-calculada em consumo_diario) e a última leitura bruta
 * recebida, para o professor/avaliador ver visualmente que uma nova
 * leitura chegou assim que o simulador publica (Etapa 3).
 */
export function ConsumoTile({ titulo, icone, dados }: Props) {
  const { sensor, leituraRecente, consumoDiario } = dados;
  const consumoHoje = consumoDiario.at(-1) ?? null;

  return (
    <div className="tile">
      <div className="tile-cabecalho">
        <span className="tile-icone" aria-hidden="true">
          {icone}
        </span>
        <h2>{titulo}</h2>
      </div>

      <div className="tile-valor-principal">
        {consumoHoje ? formatarNumero(consumoHoje.consumo_total) : '—'}
        <span className="tile-unidade">{sensor.unidade_medida}</span>
      </div>
      <p className="tile-legenda">consumo hoje</p>

      <div className="tile-rodape">
        {leituraRecente ? (
          <>
            última leitura: <strong>{formatarNumero(leituraRecente.valor)}</strong>{' '}
            {sensor.unidade_medida} às {formatarHora(leituraRecente.timestamp)}
          </>
        ) : (
          `nenhuma leitura nas últimas horas`
        )}
      </div>
    </div>
  );
}
