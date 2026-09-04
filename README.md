# SenseControl

Sistema inteligente de monitoramento e controle para o consumo consciente de água e energia elétrica, desenvolvido como projeto acadêmico da disciplina UPX 3 (Usina de Projetos Experimentais) - Curso de Análise e Desenvolvimento de Sistemas, FACENS.

## O problema

Hoje, o consumidor comum só percebe quanto gastou de água e energia quando a conta chega no fim do mês, sem visibilidade em tempo real do consumo e sem entender qual comportamento causou o aumento do gasto. Isso dificulta identificar a tempo desperdícios como vazamentos ou equipamentos ligados sem necessidade.

## O que o SenseControl faz

Monitora, em tempo real, o consumo de água e de energia elétrica de uma residência ou pequeno estabelecimento a partir de sensores (físicos ou simulados), apresenta esses dados em um dashboard, identifica padrões e possíveis desperdícios por meio de regras simples e explicáveis, gera alertas e recomenda ações para reduzir consumo e custo.

## Documentação

- [`docs/ARQUITETURA.md`](docs/ARQUITETURA.md) - arquitetura da solução, diagrama e papel de cada componente.
- [`docs/DECISOES_DE_TECNOLOGIA.md`](docs/DECISOES_DE_TECNOLOGIA.md) - stack escolhida e comparação com as alternativas consideradas.
- [`docs/BANCO_DE_DADOS.md`](docs/BANCO_DE_DADOS.md) - modelo de dados completo.
- [`docs/ROADMAP.md`](docs/ROADMAP.md) - ordem de implementação por etapas e prioridades do MVP.
- [`docs/COMO_RODAR.md`](docs/COMO_RODAR.md) - passo a passo de execução (atualizado a cada etapa concluída).

A documentação técnica completa original do produto (requisitos, casos de uso, UML, backlog detalhado) foi elaborada separadamente pelo grupo e serviu de base para todos os documentos acima.

## Estrutura do repositório

```
sensecontrol/
├── backend/          # API REST + WebSocket (Node.js/TypeScript/Express) - a partir da Etapa 2
├── frontend/         # Dashboard web (React/TypeScript/Vite) - a partir da Etapa 4
├── iot/              # Configuração do broker MQTT e simulador de sensores - a partir da Etapa 3
├── database/         # Migrations SQL do schema + dados fictícios de demonstração (já implementado)
├── docs/             # Documentação de arquitetura, decisões técnicas, banco de dados e roadmap
├── docker-compose.yml
├── .env.example
└── LICENSE
```

## Status do projeto

**Trabalho acadêmico em desenvolvimento.** Este repositório está sendo construído em etapas, cada uma implementada, testada e documentada antes de avançar para a próxima (veja `docs/ROADMAP.md`). O estado atual é:

- [x] Etapa 1 - Estrutura do repositório, Docker Compose (banco de dados + broker MQTT), schema do banco e dados de demonstração.
- [x] Etapa 2 - Backend: API de cadastros e leituras.
- [ ] Etapa 3 - Simulador IoT + ingestão via MQTT.
- [ ] Etapa 4 - Dashboard.
- [ ] Etapa 5 - Detecção de desperdício e alertas.
- [ ] Etapa 6 - Recomendações.
- [ ] Etapa 7 - Autenticação (JWT).
- [ ] Etapa 8 - Documentação da API (Swagger) e testes automatizados.
- [ ] Etapa 9 - Sistema completo integrado no Docker Compose.

## Como rodar (estado atual)

Veja [`docs/COMO_RODAR.md`](docs/COMO_RODAR.md) - nesta etapa, já é possível subir o banco de dados com o schema e dados de demonstração aplicados via `docker compose up`.

## Equipe

Curso de Análise e Desenvolvimento de Sistemas - FACENS - UPX 3

- Gudryan (líder do grupo)
- William Consorte de Almeida
- Arieli Leopisi Rodrigues de Oliveira
- Bernard Motta Rosa
- Lydia Alves de Souza
- Nathaly Marsura

## Licença

Distribuído sob a licença MIT (veja [`LICENSE`](LICENSE)) - trabalho acadêmico, sem fins comerciais.
