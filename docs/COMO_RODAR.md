# Como rodar - estado atual do projeto (Etapa 1)

Nesta etapa, o projeto ainda não tem código de aplicação (backend/frontend virão nas próximas etapas - veja `docs/ROADMAP.md`). O que já existe e já pode ser executado agora é a infraestrutura de dados: banco de dados PostgreSQL com o schema completo e dados de demonstração, e o broker MQTT.

## Pré-requisitos

- Docker e Docker Compose instalados ([guia oficial](https://docs.docker.com/get-docker/)).

## Passo a passo

1. Copie o arquivo de variáveis de ambiente de exemplo:

   ```bash
   cp .env.example .env
   ```

   Os valores padrão já funcionam para fins de demonstração acadêmica - não é preciso editar nada para rodar localmente.

2. Suba os serviços:

   ```bash
   docker compose up -d
   ```

3. Verifique se o banco subiu e já tem os dados de demonstração:

   ```bash
   docker compose exec db psql -U sensecontrol_app -d sensecontrol -c "SELECT nome, email FROM usuarios;"
   docker compose exec db psql -U sensecontrol_app -d sensecontrol -c "SELECT tipo, unidade_medida FROM sensores;"
   docker compose exec db psql -U sensecontrol_app -d sensecontrol -c "SELECT COUNT(*) FROM leituras;"
   ```

   O resultado esperado é: 1 usuário (`demo@sensecontrol.app`), 2 sensores (água e energia) e cerca de 240 leituras.

4. Para parar os serviços:

   ```bash
   docker compose down
   ```

   Para parar **e apagar os dados** (útil se quiser reaplicar o schema/seed do zero):

   ```bash
   docker compose down -v
   ```

## Nas próximas etapas

Conforme o backend e o frontend forem implementados, este documento será atualizado com o passo a passo completo (`docker compose up` subindo tudo, URL do dashboard, roteiro de demonstração). Este arquivo existe desde já para que o ambiente de dados seja verificável a cada etapa, e não só no final do projeto.
