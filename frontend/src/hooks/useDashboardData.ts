import { useEffect, useRef, useState } from 'react';
import {
  listarConsumoDiario,
  listarDispositivos,
  listarLeituras,
  listarLocais,
  listarSensores,
} from '../api/client';
import type { ConsumoDiario, Dispositivo, Leitura, Sensor } from '../api/types';

const INTERVALO_ATUALIZACAO_MS = 5000;
// Janela usada para buscar a "leitura mais recente" de cada sensor -
// ampla o bastante para nunca ficar vazia numa demonstração, mas
// pequena o bastante para a resposta não crescer sem limite com o
// simulador rodando por horas.
const JANELA_LEITURA_RECENTE_HORAS = 6;

export interface DadosSensor {
  sensor: Sensor;
  leituraRecente: Leitura | null;
  consumoDiario: ConsumoDiario[];
}

interface EstadoDashboard {
  carregando: boolean;
  erro: string | null;
  dispositivo: Dispositivo | null;
  sensorAgua: DadosSensor | null;
  sensorEnergia: DadosSensor | null;
}

/**
 * Carrega os dados do dashboard (Etapa 4): resolve local -> dispositivo
 * -> sensores do usuário demo uma vez, depois passa a atualizar só as
 * leituras/consumo em intervalos regulares (polling), para o gráfico e
 * os tiles acompanharem o simulador IoT publicando novas leituras via
 * MQTT (Etapa 3) sem precisar recarregar a página.
 *
 * Optou-se por polling em vez do canal WebSocket citado em
 * docs/ARQUITETURA.md: a cada 5s já é suficiente para a demonstração
 * ("simulador publica -> leitura aparece no dashboard") e evita
 * implementar infraestrutura de WebSocket nesta etapa - fica registrado
 * como possível evolução futura, não como requisito não atendido.
 */
export function useDashboardData(usuarioId: number): EstadoDashboard {
  const [estado, setEstado] = useState<EstadoDashboard>({
    carregando: true,
    erro: null,
    dispositivo: null,
    sensorAgua: null,
    sensorEnergia: null,
  });

  // Guarda os sensores já resolvidos para o polling não precisar
  // refazer a cadeia local -> dispositivo -> sensores a cada 5s.
  const sensoresRef = useRef<{ agua: Sensor; energia: Sensor } | null>(null);

  useEffect(() => {
    let cancelado = false;

    async function carregarEstrutura(): Promise<void> {
      try {
        const locais = await listarLocais(usuarioId);
        if (locais.length === 0) {
          throw new Error(`Usuário ${usuarioId} não tem nenhum local cadastrado.`);
        }

        const dispositivos = await listarDispositivos(locais[0].id);
        if (dispositivos.length === 0) {
          throw new Error(`Local "${locais[0].nome}" não tem nenhum dispositivo cadastrado.`);
        }

        const sensores = await listarSensores(dispositivos[0].id);
        const agua = sensores.find((s) => s.tipo === 'agua');
        const energia = sensores.find((s) => s.tipo === 'energia');
        if (!agua || !energia) {
          throw new Error(
            `Dispositivo "${dispositivos[0].nome}" precisa ter um sensor de água e um de energia cadastrados.`,
          );
        }

        if (cancelado) return;
        sensoresRef.current = { agua, energia };
        setEstado((atual) => ({ ...atual, dispositivo: dispositivos[0], erro: null }));
        await atualizarLeiturasEConsumo();
      } catch (err) {
        if (cancelado) return;
        setEstado((atual) => ({
          ...atual,
          carregando: false,
          erro: err instanceof Error ? err.message : 'Erro desconhecido ao carregar o dashboard.',
        }));
      }
    }

    async function atualizarLeiturasEConsumo(): Promise<void> {
      const sensores = sensoresRef.current;
      if (!sensores) return;

      const desde = new Date(
        Date.now() - JANELA_LEITURA_RECENTE_HORAS * 60 * 60 * 1000,
      ).toISOString();

      try {
        const [leiturasAgua, leiturasEnergia, consumoAgua, consumoEnergia] = await Promise.all([
          listarLeituras(sensores.agua.id, desde),
          listarLeituras(sensores.energia.id, desde),
          listarConsumoDiario(sensores.agua.id),
          listarConsumoDiario(sensores.energia.id),
        ]);

        if (cancelado) return;
        setEstado((atual) => ({
          ...atual,
          carregando: false,
          erro: null,
          sensorAgua: {
            sensor: sensores.agua,
            leituraRecente: leiturasAgua.at(-1) ?? null,
            consumoDiario: consumoAgua,
          },
          sensorEnergia: {
            sensor: sensores.energia,
            leituraRecente: leiturasEnergia.at(-1) ?? null,
            consumoDiario: consumoEnergia,
          },
        }));
      } catch (err) {
        if (cancelado) return;
        // Uma falha pontual de polling não deve derrubar o dashboard
        // inteiro - só loga; a próxima atualização tenta de novo.
        console.error('Falha ao atualizar leituras/consumo:', err);
      }
    }

    void carregarEstrutura();
    const intervalo = setInterval(() => void atualizarLeiturasEConsumo(), INTERVALO_ATUALIZACAO_MS);

    return () => {
      cancelado = true;
      clearInterval(intervalo);
    };
  }, [usuarioId]);

  return estado;
}
