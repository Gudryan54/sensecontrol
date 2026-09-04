# Backend - SenseControl

API REST em Node.js + TypeScript + Express, responsável pelos cadastros (usuários, locais, dispositivos, sensores) e pelo registro/consulta de leituras dos sensores.

## Endpoints implementados nesta etapa

| Método / Rota | Objetivo |
|---|---|
| `GET /health` | Verifica se a API e o banco estão no ar (rota operacional, não faz parte do produto). |
| `GET /usuarios/:id` | Consultar dados de um usuário. |
| `PUT /usuarios/:id` | Atualizar nome/email de um usuário. |
| `POST /locais` | Cadastrar um local (residência/estabelecimento) de um usuário. |
| `GET /locais?usuario_id=` | Listar locais de um usuário. |
| `POST /dispositivos` | Cadastrar um dispositivo (gateway IoT) em um local. |
| `GET /dispositivos?local_id=` | Listar dispositivos de um local. |
| `POST /sensores` | Cadastrar um sensor (água ou energia) em um dispositivo. |
| `POST /leituras` | Registrar uma nova leitura de um sensor (usado pelo gateway/simulador). |
| `GET /leituras?sensor_id=&inicio=&fim=` | Consultar leituras de um sensor, opcionalmente filtrando por período. |

Os endpoints `/locais` não estavam na tabela de rotas da seção 9 da documentação técnica original (que listava só usuários/dispositivos/sensores/leituras/consumo/alertas/recomendações), mas a entidade `locais` já existia no modelo de dados (seção 8) e é pré-requisito para cadastrar um dispositivo — sem ela, o fluxo de cadastro não fecha. Foi adicionado por necessidade do próprio modelo já documentado, não como funcionalidade nova.

Ainda **sem autenticação** (chega na Etapa 7) — por isso `PUT /usuarios/:id` e os cadastros aceitam qualquer chamada por enquanto. `POST /auth/registrar` e `POST /auth/login` também ficam para a Etapa 7.

## Decisões de implementação

- **Validação:** todo corpo/query de requisição passa por um schema [Zod](https://zod.dev/) antes de tocar o banco — inclusive validações de negócio, como a combinação `tipo`/`unidade_medida` de um sensor (água ⇒ litros, energia ⇒ kWh) e a faixa plausível de valor de uma leitura (configurável via `LEITURA_VALOR_MAXIMO`).
- **Erros:** um middleware central (`src/middlewares/errorHandler.ts`) converte qualquer erro (validação, regra de negócio via `ApiError`, ou erro inesperado) num JSON `{ erro, detalhes? }` com o status HTTP correto, sem vazar detalhes internos numa resposta 500.
- **Logs:** todo request loga método/rota/status/duração; erros de servidor logam a mensagem e stack no servidor (nunca senha/token) — ver `src/utils/logger.ts`.
- **Leituras e agregação diária:** ao registrar uma leitura, o backend também atualiza `consumo_diario` na mesma transação (ver `src/services/leituras.service.ts`), seguindo o fluxo descrito na seção 10 da documentação técnica. A detecção de desperdício/alertas (também citada nesse fluxo) fica para a Etapa 5.

## Como rodar localmente (fora do Docker)

Pré-requisito: o banco de dados já estar no ar (`docker compose up -d` na raiz do projeto - veja `docs/COMO_RODAR.md`).

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

`npm run dev` sobe a API com recarregamento automático (via `tsx watch`) em `http://localhost:3000`. Para rodar a versão compilada (mais parecido com produção):

```bash
npm run build
npm start
```

## Testando manualmente

```bash
curl http://localhost:3000/health

curl http://localhost:3000/usuarios/1

curl -X POST http://localhost:3000/leituras \
  -H "Content-Type: application/json" \
  -d '{"sensor_id": 1, "valor": 2.5}'

curl "http://localhost:3000/leituras?sensor_id=1"
```

(O usuário 1 e os sensores 1/2 já existem graças ao seed de demonstração de `database/009_demo_data.sql`.)

## Qualidade de código

```bash
npm run lint     # ESLint
npm run format   # Prettier
```

## Próximas etapas

Autenticação (Etapa 7), simulador IoT publicando via MQTT (Etapa 3), detecção de desperdício e alertas (Etapa 5), recomendações (Etapa 6), documentação Swagger e testes automatizados (Etapa 8). Veja `docs/ROADMAP.md` na raiz do projeto.
