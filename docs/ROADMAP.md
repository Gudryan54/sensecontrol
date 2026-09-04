# Roadmap de implementação - SenseControl

Este roadmap traduz a lista de prioridades definida para o MVP acadêmico em etapas de desenvolvimento concretas, seguindo o ciclo combinado (analisar → planejar → implementar → testar → corrigir → documentar → próxima etapa), uma etapa por vez.

## Prioridades do MVP (referência)

- **Prioridade 1 (obrigatório):** backend, banco de dados, API, simulador IoT, leituras, dashboard, consumo de água, consumo de energia.
- **Prioridade 2 (importante):** detecção de desperdício, alertas, recomendações, autenticação, Swagger, testes.
- **Prioridade 3 (futuro, fora do MVP):** Machine Learning, app mobile, automação residencial, integração com dispositivos reais, previsão de consumo, IA avançada, integração com energia solar.

## Etapas

1. **Etapa 1 - Esqueleto do projeto (esta etapa).** Estrutura de repositório, Docker Compose com banco de dados e broker MQTT, schema do banco (migrations) e dados de demonstração (seed). Sem código de aplicação ainda - o objetivo é ter a fundação sobre a qual todo o resto é construído, já validável (banco sobe com dados reais).
2. **Etapa 2 - Backend: cadastros e leituras (Prioridade 1).** API REST para usuários, locais, dispositivos, sensores e leituras (`POST/GET` conforme a seção 9 da documentação técnica), com validação de entrada, tratamento de erros e logs. Ainda sem autenticação obrigatória, para simplificar a primeira demonstração ponta a ponta.
3. **Etapa 3 - Simulador IoT + ingestão via MQTT (Prioridade 1).** Script Node.js que publica leituras realistas de água e energia no Mosquitto, incluindo um modo "simular consumo anômalo"; backend assinando os tópicos e persistindo as leituras recebidas.
4. **Etapa 4 - Dashboard (Prioridade 1).** Frontend React consumindo a API: tiles de consumo atual, gráfico de histórico, dados vindos do banco (populado pelo seed e/ou pelo simulador).
5. **Etapa 5 - Detecção de desperdício e alertas (Prioridade 2).** Implementação das regras estatísticas simples descritas na seção 11 da documentação técnica (consumo acima da média, consumo contínuo fora de hora, possível vazamento etc.), geração de alertas e exibição no dashboard.
6. **Etapa 6 - Recomendações (Prioridade 2).** Geração de recomendações textuais a partir dos alertas/padrões identificados, exibidas no dashboard.
7. **Etapa 7 - Autenticação e autorização (Prioridade 2).** Cadastro/login com JWT, proteção das rotas da API por usuário autenticado.
8. **Etapa 8 - Documentação da API (Swagger) e testes automatizados (Prioridade 2).** Especificação OpenAPI/Swagger navegável; testes unitários das regras de consumo/desperdício e testes de integração da API.
9. **Etapa 9 - Backend e frontend entram no Docker Compose; README final.** Nesse ponto, `docker compose up` sobe o sistema completo (banco, broker, backend, frontend) com um único comando, e o README principal é finalizado com o passo a passo de execução e o roteiro de demonstração.

Itens de Prioridade 3 (Machine Learning, app mobile, automação, dispositivos reais, previsão de consumo, energia solar) ficam deliberadamente fora deste roadmap de implementação: são registrados como trabalhos futuros no README principal, não implementados nesta entrega, para manter o escopo realista para uma equipe pequena de estudantes dentro do prazo do UPX 3.

## Corte de escopo, se o prazo apertar

Se o tempo disponível não for suficiente para todas as etapas, a ordem acima já reflete a prioridade de corte: as etapas de Prioridade 2 (5 a 8) podem ser reduzidas ou simplificadas antes de qualquer etapa de Prioridade 1 (2 a 4) ser comprometida, porque são as etapas de Prioridade 1 que sustentam o roteiro de demonstração central (login → dashboard → simulador → leitura anômala → alerta → recomendação).
