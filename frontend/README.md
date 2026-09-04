# Frontend - SenseControl

Dashboard web em React + TypeScript + Vite (Etapa 4): mostra o consumo atual e o histórico de água e energia, lendo direto da API do backend.

## O que a tela mostra

- **Tiles de consumo atual** (água/energia): consumo do dia mais recente (agregação `consumo_diario`) e a última leitura bruta recebida, com horário — para acompanhar visualmente uma leitura nova chegando quando o simulador (`iot/simulator/`) está publicando.
- **Gráfico de histórico**: consumo diário dos últimos dias, um gráfico de barras por sensor (biblioteca [Recharts](https://recharts.org/), decisão já registrada em `docs/DECISOES_DE_TECNOLOGIA.md`).
- **Status do dispositivo**: badge no cabeçalho (`ativo` / `aguardando conexão` / `offline`).

A tela atualiza sozinha a cada 5 segundos (polling), sem precisar recarregar a página.

## Por que polling e não WebSocket

`docs/ARQUITETURA.md` cita um canal WebSocket para atualização em tempo real do dashboard. Nesta etapa, optamos por buscar os dados via REST a cada 5s em vez de implementar esse canal: para a demonstração ("simulador publica → leitura aparece no dashboard"), 5s já é imperceptível, e evita adicionar a complexidade de um servidor WebSocket antes de o restante do MVP (Prioridade 1) estar pronto. Fica registrado aqui como uma redução de escopo consciente, não como algo esquecido — se sobrar tempo, é um ponto natural de evolução.

## Ainda sem autenticação

Como o backend ainda não tem login (Etapa 7), o dashboard mostra os dados de um usuário fixo, configurado em `.env` (`VITE_USUARIO_ID_DEMO`, padrão `1` — o usuário do seed de demonstração). Quando a Etapa 7 implementar autenticação, essa variável dá lugar ao usuário logado.

## Como rodar localmente

Pré-requisito: infraestrutura (`docker compose up -d`) e backend (`cd backend && npm install && npm run dev`) já no ar — veja `docs/COMO_RODAR.md`.

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Abre em `http://localhost:5173`. Rode o simulador (`cd iot/simulator && npm start`) em outro terminal para ver os tiles e o gráfico atualizarem com leituras novas.

## Qualidade de código

```bash
npm run lint     # ESLint
npm run format   # Prettier
npm run build    # build de produção (tsc + vite build), útil para pegar erros de tipo antes de commitar
```

## Estrutura

- `src/api/` — cliente HTTP (`client.ts`) e tipos (`types.ts`) espelhando o formato retornado pelo backend.
- `src/hooks/useDashboardData.ts` — resolve usuário → local → dispositivo → sensores uma vez, depois faz o polling de leituras/consumo.
- `src/components/` — `ConsumoTile`, `HistoricoChart`, `StatusDispositivo`.

## Próximas etapas

Exibição de alertas e recomendações no dashboard (Etapas 5 e 6), tela de login (Etapa 7), e entrada no `docker-compose.yml` junto com o backend (Etapa 9). Veja `docs/ROADMAP.md` na raiz do projeto.
