import 'dotenv/config';
import mqtt from 'mqtt';

/**
 * Simulador de sensores IoT do SenseControl.
 *
 * Representa o papel do dispositivo ESP32 (seção 6 da documentação
 * técnica): lê os sensores, monta uma mensagem com sensor_id, valor e
 * timestamp, e publica no broker MQTT no tópico
 * "sensores/{sensor_id}/leitura" - exatamente como um gateway real
 * faria. O backend (Etapa 3 - src/mqtt/subscriber.ts) não sabe, e não
 * precisa saber, se quem publicou foi este simulador ou um ESP32 de
 * verdade: ambos falam o mesmo protocolo.
 *
 * Dois modos:
 *  - "normal": gera consumo de água e energia plausível para o
 *    horário atual (mais alto de manhã/à noite, quase zero de
 *    madrugada), do mesmo jeito que os dados de demonstração
 *    (database/009_demo_data.sql) foram gerados.
 *  - "anomalia": força uma leitura de água constante e elevada,
 *    simulando um possível vazamento - o cenário citado
 *    explicitamente no prompt do projeto e que a Etapa 5 (detecção de
 *    desperdício) vai usar para gerar um alerta.
 */

const MQTT_URL = process.env.MQTT_URL ?? 'mqtt://localhost:1883';
const SENSOR_AGUA_ID = Number(process.env.SENSOR_AGUA_ID ?? 1);
const SENSOR_ENERGIA_ID = Number(process.env.SENSOR_ENERGIA_ID ?? 2);
const INTERVALO_MS = Number(process.env.INTERVALO_MS ?? 5000);
const MODO = process.env.MODO === 'anomalia' ? 'anomalia' : 'normal';

function aleatorioEntre(min: number, max: number): number {
  return Math.round((min + Math.random() * (max - min)) * 1000) / 1000;
}

/** Litros consumidos no intervalo, plausíveis para a hora atual. */
function gerarValorAgua(hora: number): number {
  if (MODO === 'anomalia') {
    // Consumo contínuo e elevado, independente da hora - o padrão que
    // a regra de "possível vazamento" (Etapa 5) deve reconhecer.
    return aleatorioEntre(7.5, 9.5);
  }
  if (hora >= 6 && hora <= 8) return aleatorioEntre(3.0, 9.0); // banho matinal
  if (hora >= 18 && hora <= 21) return aleatorioEntre(3.0, 9.0); // uso noturno
  if (hora >= 0 && hora <= 5) return aleatorioEntre(0.0, 0.15); // madrugada
  return aleatorioEntre(0.2, 1.8);
}

/** kWh consumidos no intervalo, plausíveis para a hora atual. */
function gerarValorEnergia(hora: number): number {
  if (hora >= 18 && hora <= 22) return aleatorioEntre(0.35, 0.75);
  if (hora >= 0 && hora <= 5) return aleatorioEntre(0.05, 0.12);
  return aleatorioEntre(0.12, 0.35);
}

interface LeituraPublicada {
  sensor_id: number;
  valor: number;
  timestamp: string;
}

function montarLeitura(sensorId: number, valor: number): LeituraPublicada {
  return { sensor_id: sensorId, valor, timestamp: new Date().toISOString() };
}

function main(): void {
  console.log(
    `[simulador] conectando em ${MQTT_URL} | modo=${MODO} | intervalo=${INTERVALO_MS}ms | sensor água=${SENSOR_AGUA_ID} sensor energia=${SENSOR_ENERGIA_ID}`,
  );

  const client = mqtt.connect(MQTT_URL, {
    clientId: `sensecontrol-simulador-${Math.random().toString(16).slice(2, 8)}`,
    reconnectPeriod: 2000,
  });

  client.on('connect', () => {
    console.log('[simulador] conectado ao broker MQTT. Publicando leituras...');

    const publicar = (): void => {
      const hora = new Date().getHours();

      const leituraAgua = montarLeitura(SENSOR_AGUA_ID, gerarValorAgua(hora));
      const leituraEnergia = montarLeitura(SENSOR_ENERGIA_ID, gerarValorEnergia(hora));

      for (const leitura of [leituraAgua, leituraEnergia]) {
        const topico = `sensores/${leitura.sensor_id}/leitura`;
        client.publish(topico, JSON.stringify(leitura), { qos: 1 }, (err) => {
          if (err) {
            console.error(`[simulador] falha ao publicar em ${topico}:`, err.message);
            return;
          }
          console.log(
            `[simulador] -> ${topico} valor=${leitura.valor} ${MODO === 'anomalia' && leitura.sensor_id === SENSOR_AGUA_ID ? '(ANOMALIA)' : ''}`,
          );
        });
      }
    };

    publicar();
    const intervalo = setInterval(publicar, INTERVALO_MS);

    const encerrar = (): void => {
      console.log('\n[simulador] encerrando...');
      clearInterval(intervalo);
      client.end(false, {}, () => process.exit(0));
    };
    process.on('SIGINT', encerrar);
    process.on('SIGTERM', encerrar);
  });

  client.on('error', (err) => {
    console.error('[simulador] erro de conexão MQTT:', err.message);
  });
}

main();
