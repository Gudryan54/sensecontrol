import { MqttClient } from 'mqtt';
import { criarLeituraSchema } from '../validators/leituras.validator';
import { registrarLeitura } from '../services/leituras.service';
import { logger } from '../utils/logger';

/**
 * Tópico assinado pelo backend - "+" é o wildcard MQTT de um nível,
 * então "sensores/+/leitura" recebe mensagens de qualquer sensor
 * (ex.: sensores/1/leitura, sensores/2/leitura, ...). O sensor_id que
 * importa de fato é o que vem dentro do corpo JSON da mensagem, não o
 * do tópico - o tópico só existe para permitir, no futuro, assinar
 * sensores específicos se for preciso.
 */
const TOPICO_LEITURAS = 'sensores/+/leitura';

/**
 * Liga o consumidor MQTT de leituras a um client já criado (ver
 * mqtt/client.ts). Reaproveita exatamente a mesma validação (Zod) e o
 * mesmo service (registrarLeitura) usados pelo endpoint
 * POST /leituras - a ingestão via MQTT não é um caminho de código
 * separado ou duplicado, é a mesma regra de negócio recebendo dados
 * por um transporte diferente.
 */
export function iniciarConsumidorMqtt(client: MqttClient): void {
  client.on('connect', () => {
    client.subscribe(TOPICO_LEITURAS, { qos: 1 }, (err) => {
      if (err) {
        logger.error('Falha ao assinar tópico MQTT de leituras', {
          topico: TOPICO_LEITURAS,
          error: err.message,
        });
        return;
      }
      logger.info('Assinado ao tópico MQTT de leituras', { topico: TOPICO_LEITURAS });
    });
  });

  client.on('message', (topic, payload) => {
    void processarMensagem(topic, payload);
  });
}

async function processarMensagem(topic: string, payload: Buffer): Promise<void> {
  let dadosBrutos: unknown;
  try {
    dadosBrutos = JSON.parse(payload.toString('utf-8'));
  } catch {
    logger.warn('Mensagem MQTT descartada: corpo não é um JSON válido', { topic });
    return;
  }

  const resultado = criarLeituraSchema.safeParse(dadosBrutos);
  if (!resultado.success) {
    logger.warn('Mensagem MQTT descartada: dados inválidos', {
      topic,
      problemas: resultado.error.issues.map((issue) => issue.message),
    });
    return;
  }

  try {
    const leitura = await registrarLeitura(resultado.data);
    logger.info('Leitura registrada via MQTT', {
      topic,
      sensor_id: leitura.sensor_id,
      valor: leitura.valor,
    });
  } catch (err) {
    // Ex.: sensor_id não existe no banco (ApiError 404) ou falha de
    // banco. Uma mensagem malformada/de um sensor inexistente não
    // pode derrubar o processo - só é descartada e logada.
    logger.error('Falha ao processar leitura recebida via MQTT', {
      topic,
      error: err instanceof Error ? err.message : String(err),
    });
  }
}
