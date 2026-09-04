# Decisões de tecnologia - SenseControl

A documentação técnica original (seção 7) sugere alternativas para cada camada. Este documento registra a escolha definitiva feita para a implementação, com a comparação que embasou cada decisão. O critério de decisão, em todos os casos, seguiu as prioridades definidas para este trabalho acadêmico: funcionalidade, clareza do código, organização, facilidade de execução e facilidade de avaliação pela professora - não uma solução comercial.

## Backend: Node.js + TypeScript + Express

| Opção | Complexidade | Curva de aprendizado (equipe) | Facilidade de rodar/avaliar |
|---|---|---|---|
| **Express + TypeScript** (escolhido) | Baixa - estrutura de pastas definida manualmente, poucas convenções para aprender | Baixa - a maioria dos tutoriais e materiais de referência em Node usa Express | Alta - um único processo, sobe rápido, stack trace direto ao ponto |
| NestJS + TypeScript | Média/alta - módulos, injeção de dependência, decorators, convenções próprias | Média/alta - exige entender o "framework dentro do framework" antes de escrever a primeira rota | Alta, mas com mais "mágica" (decorators) para explicar durante uma avaliação |
| Python + FastAPI | Baixa | Depende da equipe já ter mais prática em Python do que em JS/TS | Alta |

**Decisão:** Express com TypeScript. NestJS traria mais organização "de fábrica", mas seu overhead conceitual (módulos, providers, decorators) não se paga para uma API do tamanho do MVP do SenseControl, e tornaria o código mais difícil de explicar linha a linha para a professora. FastAPI foi descartado porque a equipe e o restante do ecossistema do projeto (scripts de simulação, testes) ficam mais coesos concentrados em um único runtime (Node.js/TypeScript), inclusive compartilhando tipos entre backend e o simulador IoT.

## Frontend: React + TypeScript + Vite

React foi a única opção seriamente considerada na própria documentação técnica (seção 7), por ser madura, ter bibliotecas de gráficos consolidadas (Recharts, usada neste projeto) e grande volume de material de apoio. Vite foi escolhido como ferramenta de build por ter start e hot-reload quase instantâneos comparado a alternativas como Create React App (hoje descontinuado) - relevante para agilizar o desenvolvimento em equipe e as demonstrações ao vivo.

## Banco de dados: PostgreSQL

| Opção | Complexidade para o MVP | Facilidade de execução via Docker |
|---|---|---|
| **PostgreSQL puro** (escolhido) | Baixa - imagem oficial, schema relacional direto | Alta - imagem `postgres:16-alpine` padrão, amplamente documentada |
| PostgreSQL + extensão TimescaleDB | Média - exige imagem customizada (`timescale/timescaledb`) e configuração de hypertables | Média - mais uma peça específica para o avaliador precisar entender |
| InfluxDB (banco de série temporal dedicado) | Alta - modelo de dados e linguagem de consulta diferentes (Flux/InfluxQL), exigiria reaprendizado da equipe | Média |

**Decisão:** PostgreSQL "puro" (sem TimescaleDB) para o MVP. O volume de leituras de um MVP acadêmico de demonstração (poucos sensores simulados, dias de histórico) não chega perto do ponto em que a otimização para série temporal do TimescaleDB faz diferença prática, e adicionar essa extensão agora só aumentaria a complexidade de setup sem benefício visível na demonstração. A tabela `leituras` (ver `docs/BANCO_DE_DADOS.md`) foi desenhada de forma compatível com uma futura migração para hypertable, caso o projeto evolua além do MVP - isso fica registrado no roadmap (`docs/ROADMAP.md`) como evolução possível, não como requisito atual.

## Comunicação IoT: MQTT + Mosquitto

Mantido exatamente como proposto na documentação técnica: MQTT é o protocolo padrão de fato para IoT de baixo consumo, e o Mosquitto é a implementação de broker mais usada em ambiente acadêmico/demonstração, com imagem Docker oficial leve (`eclipse-mosquitto`).

## Simulador de sensores (em vez de hardware físico obrigatório)

O grupo não depende de ter o kit ESP32 + sensores fisicamente montado para demonstrar o sistema funcionando: um simulador em Node.js (mesma linguagem do backend, facilitando reaproveitar tipos e validações) publica leituras realistas de água e energia no mesmo tópico MQTT que um ESP32 real usaria, incluindo a capacidade de simular um cenário de consumo anômalo sob demanda. Essa decisão é o que torna a "Demonstração visual" (prioridade explícita deste trabalho) viável dentro do prazo do UPX 3, independentemente do hardware físico estar pronto a tempo.

## Infraestrutura: Docker + Docker Compose

Escolhido porque permite que a professora suba o sistema completo (banco, broker MQTT, backend, frontend) com um único comando (`docker compose up`), sem precisar instalar PostgreSQL, Node.js ou Mosquitto manualmente na própria máquina - atendendo diretamente ao critério de "facilidade de execução" definido como prioridade para este trabalho.
