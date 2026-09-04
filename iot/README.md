# IoT - SenseControl

- `mosquitto.conf` - configuração do broker MQTT usada pelo `docker-compose.yml` (já funcional desde a Etapa 1).
- Simulador de sensores (`simulator.js` ou similar) - ainda não implementado. Vai gerar leituras realistas de água (L) e energia (kWh) e publicá-las no broker MQTT, incluindo um modo para simular um cenário de consumo anômalo (ex.: possível vazamento), central para o roteiro de demonstração do MVP. Chega na **Etapa 3** do roadmap (veja `docs/ROADMAP.md` na raiz do projeto).

Um ESP32 real, quando disponível, poderá publicar no mesmo tópico MQTT que o simulador usa, sem exigir nenhuma mudança no backend (veja `docs/ARQUITETURA.md`).
