# Banco de dados - SenseControl

Este diretório contém o esquema do banco de dados (PostgreSQL) e os dados fictícios de demonstração.

## Estrutura

- `001_create_usuarios.sql` a `008_create_recomendacoes.sql` - migrations, uma por entidade, numeradas na ordem correta de dependência (FKs). Refletem o modelo de dados descrito em `docs/BANCO_DE_DADOS.md`.
- `009_demo_data.sql` - dados fictícios: 1 usuário demo, 1 local, 1 dispositivo, 2 sensores (água e energia), cerca de 30h de leituras (incluindo uma janela de ~2h de consumo de água contínuo e elevado, simulando um possível vazamento), a agregação diária correspondente, 1 alerta e 1 recomendação já gerados. O objetivo é que o dashboard mostre dados reais assim que o sistema subir, sem depender do simulador IoT estar rodando.

Os arquivos ficam todos juntos (sem subpastas) de propósito: a imagem oficial do PostgreSQL executa automaticamente, em ordem alfabética, todo arquivo `.sql` que estiver **diretamente** dentro de `/docker-entrypoint-initdb.d` — ela não entra em subpastas. Por isso este diretório inteiro é montado nesse caminho no `docker-compose.yml`, e a numeração (001, 002, ...) garante que as tabelas sejam criadas antes das que dependem delas, e que o seed (009) rode por último.

## Como aplicar (via Docker Compose - recomendado)

Ao rodar `docker compose up` pela primeira vez, o serviço `db` já aplica automaticamente todos os arquivos `.sql` deste diretório, na ordem numérica. Não é preciso rodar nada manualmente. (Isso só acontece na primeira inicialização do volume de dados do Postgres - veja `docs/COMO_RODAR.md`.)

## Como aplicar manualmente (sem Docker, ex.: Postgres local)

```bash
createdb sensecontrol
for f in database/0*.sql; do psql -d sensecontrol -f "$f"; done
```

## Credencial de demonstração

Usuário: `demo@sensecontrol.app` / senha: `demo1234` (hash bcrypt já no seed - o endpoint de login será implementado na Etapa 2, junto com a API).
