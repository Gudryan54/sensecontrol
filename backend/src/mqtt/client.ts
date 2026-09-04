import mqtt, { MqttClient } from 'mqtt';
import { env } from '../config/env';
import { logger } from '../utils/logger';

/**
 * Cliente MQTT do backend. A conexão é assíncrona e resiliente por
 * natureza (a lib reconecta sozinha) - por isso não bloqueamos a
 * inicialização do servidor HTTP esperando o broker responder. Se o
 * Mosquitto estiver fora do ar, a API REST continua funcionando
 * normalmente; só a ingestão via MQTT fica pausada até reconectar.
 */
export function createMqttClient(): MqttClient {
  const client = mqtt.connect(env.mqttUrl, {
    clientId: `sensecontrol-backend-${Math.random().toString(16).slice(2, 8)}`,
    reconnectPeriod: 2000,
  });

  client.on('connect', () => {
    logger.info('Conectado ao broker MQTT', { url: env.mqttUrl });
  });

  client.on('reconnect', () => {
    logger.warn('Reconectando ao broker MQTT...', { url: env.mqttUrl });
  });

  client.on('error', (err) => {
    logger.error('Erro na conexão MQTT', { url: env.mqttUrl, error: err.message });
  });

  return client;
}
