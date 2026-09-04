import 'dotenv/config';

/**
 * Carrega e valida as variáveis de ambiente usadas pelo backend.
 * Falha rápido (na inicialização) se algo obrigatório estiver faltando,
 * em vez de deixar o processo subir "quebrado" e falhar de forma
 * confusa na primeira requisição.
 */
function required(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === '') {
    throw new Error(
      `Variável de ambiente obrigatória ausente: ${name}. Copie backend/.env.example para backend/.env e preencha os valores.`,
    );
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 3000),
  databaseUrl: required('DATABASE_URL'),
  leituraValorMaximo: Number(process.env.LEITURA_VALOR_MAXIMO ?? 1000),
};
