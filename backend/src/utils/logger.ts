/**
 * Logger simples e estruturado. Não usamos uma biblioteca externa
 * (ex.: Winston/Pino) para manter a dependência mínima em um MVP
 * acadêmico - mas a saída já é estruturada (JSON por linha), o que
 * facilita evoluir para uma ferramenta de agregação de logs no futuro
 * sem reescrever quem chama o logger.
 *
 * Regra de segurança (seção 13 da documentação técnica): nunca logar
 * senhas, hashes de senha ou tokens em texto puro. Os serviços que
 * lidam com esses dados são responsáveis por não passá-los aqui.
 */

type LogLevel = 'info' | 'warn' | 'error';

function log(level: LogLevel, message: string, meta?: Record<string, unknown>): void {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...meta,
  };
  const line = JSON.stringify(entry);
  if (level === 'error') {
    console.error(line);
  } else if (level === 'warn') {
    console.warn(line);
  } else {
    console.log(line);
  }
}

export const logger = {
  info: (message: string, meta?: Record<string, unknown>) => log('info', message, meta),
  warn: (message: string, meta?: Record<string, unknown>) => log('warn', message, meta),
  error: (message: string, meta?: Record<string, unknown>) => log('error', message, meta),
};
