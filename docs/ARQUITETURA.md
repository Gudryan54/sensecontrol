# Arquitetura - SenseControl

Este documento descreve a arquitetura adotada para a implementação do SenseControl, adaptando o desenho conceitual já presente na documentação técnica do projeto (`SenseControl_Documentacao_Desenvolvimento`, seção 6) para uma arquitetura de software concreta e executável.

## Visão geral

```
┌──────────────┐      ┌───────────────────┐      MQTT       ┌───────────────────────┐
│   Sensores    │      │  Dispositivo IoT   │ ───────────▶  │   Broker MQTT           │
│  (água/energia│─────▶│  (ESP32 real OU     │               │   (Mosquitto)           │
│   - físico)   │      │  simulador Node.js) │               └───────────┬─────────────┘
└──────────────┘      └───────────────────┘                           │ assina tópicos
                                                                       ▼
                                                        ┌───────────────────────────────┐
                                                        │        Backend / API           │
                                                        │  Node.js + TypeScript + Express │
                                                        │  - valida e persiste leituras   │
                                                        │  - aplica regras de detecção     │
                                                        │  - gera alertas/recomendações    │
                                                        │  - expõe REST + WebSocket        │
                                                        └───────────┬───────────┬─────────┘
                                                                    │           │
                                                       REST/WebSocket│           │ SQL
                                                                    ▼           ▼
                                                  ┌───────────────────────┐   ┌───────────────────┐
                                                  │  Frontend (dashboard)  │   │   PostgreSQL        │
                                                  │  React + TypeScript    │   │  (dados cadastrais, │
                                                  │  + Vite                │   │  leituras, alertas, │
                                                  └───────────────────────┘   │  recomendações)     │
                                                                              └───────────────────────┘
```

Todos os componentes acima rodam como serviços do `docker-compose.yml`, permitindo levantar o sistema completo com um único comando (`docker compose up`).

## Componentes

**Sensores.** No MVP acadêmico, os sensores físicos (YF-S201 para água, PZEM-004T para energia) são opcionais: o **simulador IoT** (pasta `iot/`, a ser implementado em etapa futura) gera leituras realistas de água (L) e energia (kWh) sem depender de hardware, o que torna a demonstração possível mesmo sem o kit físico montado. A arquitetura foi desenhada para que um ESP32 real possa publicar no mesmo tópico MQTT e substituir o simulador sem qualquer mudança no backend.

**Broker MQTT (Mosquitto).** Recebe as leituras publicadas pelo dispositivo/simulador em tópicos como `sensores/{sensor_id}/leitura` e as repassa ao backend, que está inscrito nesses tópicos. Protocolo leve, adequado a dispositivos com poucos recursos (ver seção 6 da documentação técnica).

**Backend/API.** Assina os tópicos MQTT, valida cada leitura recebida (sensor existente e ativo, valor dentro de uma faixa plausível), persiste no banco, atualiza a agregação diária de consumo, aplica as regras de detecção de desperdício (seção 11 da documentação técnica) e, quando uma anomalia é identificada, gera um alerta e, se aplicável, uma recomendação. Expõe uma API REST para consultas do frontend e um canal WebSocket para atualização do dashboard em tempo real.

**Banco de dados (PostgreSQL).** Armazena dados cadastrais (usuários, locais, dispositivos, sensores), leituras brutas, agregações diárias, alertas e recomendações. O modelo de dados completo está em `docs/BANCO_DE_DADOS.md`.

**Frontend (dashboard).** Interface web onde o usuário visualiza o consumo atual e histórico, os alertas e as recomendações.

## Por que esta arquitetura

A escolha por manter os quatro componentes desacoplados (sensores/simulador → MQTT → backend → banco, com o frontend consumindo só a API/WebSocket do backend) segue diretamente o desenho já validado na documentação técnica do projeto, e tem uma vantagem prática direta para este trabalho acadêmico: cada camada pode ser demonstrada e testada isoladamente (por exemplo, publicar uma leitura manualmente no Mosquitto e ver o efeito no banco, sem precisar do frontend rodando), o que facilita tanto o desenvolvimento em equipe (cada integrante pode focar em uma camada) quanto a avaliação por parte da professora.

A justificativa completa de cada escolha tecnológica, incluindo as alternativas consideradas, está em `docs/DECISOES_DE_TECNOLOGIA.md`.
