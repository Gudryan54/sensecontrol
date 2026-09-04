# Como rodar - estado atual do projeto (Etapa 3)

## Pré-requisitos

- Docker e Docker Compose instalados ([guia oficial](https://docs.docker.com/get-docker/)).
- Node.js 20+ e npm, para rodar o backend fora do Docker (o backend só entra no `docker-compose.yml` na Etapa 9 - até lá, roda nativamente, o que agiliza o desenvolvimento com recarregamento automático).

Se o seu computador não conseguir rodar o Docker Desktop (mensagem de erro do tipo "Virtualization support not detected" - comum em notebooks corporativos com a virtualização bloqueada por política de TI), uma alternativa que não depende disso é o [GitHub Codespaces](https://github.com/features/codespaces): abra o repositório no GitHub, clique em **Code → Codespaces → Create codespace on main**, e o ambiente completo (com Docker já disponível) sobe direto no navegador, sem precisar instalar nada localmente.

## Passo 1 - Infraestrutura (banco de dados + broker MQTT)

1. Copie o arquivo de variáveis de ambiente de exemplo (na raiz do projeto):

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
   docker compose ps
   docker compose exec db psql -U sensecontrol_app -d sensecontrol -c "SELECT nome, email FROM usuarios;"
   docker compose exec db psql -U sensecontrol_app -d sensecontrol -c "SELECT COUNT(*) FROM leituras;"
   ```

   O resultado esperado é: `sensecontrol-db` e `sensecontrol-mosquitto` com status "healthy"/"running", 1 usuário (`demo@sensecontrol.app`) e cerca de 240 leituras.

## Passo 2 - Backend (API REST)

Com a infraestrutura do passo 1 já no ar:

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

A API sobe em `http://localhost:3000`. Teste rapidamente:

```bash
curl http://localhost:3000/health
curl http://localhost:3000/usuarios/1
curl "http://localhost:3000/leituras?sensor_id=1"
```

Detalhes de todos os endpoints, decisões de implementação e mais exemplos de teste em `backend/README.md`.

## Passo 3 - Simulador IoT (leituras via MQTT)

Com a infraestrutura (passo 1) e o backend (passo 2) já no ar, em um **terceiro terminal**:

```bash
cd iot/simulator
cp .env.example .env
npm install

npm start
```

Você verá o simulador publicando uma leitura de água e uma de energia a cada 5 segundos, e no terminal do backend (passo 2) o log confirmando cada leitura recebida via MQTT (`"Leitura registrada via MQTT"`). Para conferir que os dados realmente chegaram ao banco:

```bash
curl "http://localhost:3000/leituras?sensor_id=1"
```

Para simular um possível vazamento (consumo de água constante e elevado, cenário citado no roteiro de demonstração do MVP), pare o simulador (`Ctrl+C`) e rode:

```bash
npm run start:anomalia
```

A Etapa 5 (detecção de desperdício) vai usar exatamente esse padrão de consumo para gerar um alerta automaticamente. Por enquanto, as leituras só são persistidas — sem alerta.

Detalhes de implementação do simulador em `iot/README.md`.

## Para desligar tudo

```bash
# Pare o simulador (Ctrl+C) e o backend (Ctrl+C), nos respectivos terminais

# E os serviços de infraestrutura:
docker compose down

# Ou, para também apagar os dados do banco (reaplica o schema/seed do zero na próxima subida):
docker compose down -v
```

## Nas próximas etapas

Conforme o dashboard (frontend) for implementado, este documento será atualizado (veja `docs/ROADMAP.md`). Na Etapa 9, backend e frontend entram no `docker-compose.yml`, e todo o sistema sobe com um único `docker compose up`.
