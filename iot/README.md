# IoT - SenseControl

- `mosquitto.conf` - configuração do broker MQTT usada pelo `docker-compose.yml` (já funcional desde a Etapa 1).
- `simulator/` - simulador de sensores IoT (**Etapa 3**), implementado em Node.js/TypeScript. Representa o papel de um dispositivo ESP32 real: gera leituras plausíveis de água (L) e energia (kWh) e publica no broker MQTT, no tópico `sensores/{sensor_id}/leitura`, no mesmo formato que um gateway real usaria.

## Modos do simulador

- **normal** (padrão) - gera consumo plausível para o horário atual (mais alto de manhã/à noite, quase zero de madrugada), no mesmo padrão dos dados de demonstração (`database/009_demo_data.sql`).
- **anomalia** - força uma leitura de água constante e elevada (7.5-9.5 L por leitura), simulando um possível vazamento - o cenário citado no roteiro de demonstração do MVP, que a Etapa 5 (detecção de desperdício) vai usar para gerar um alerta.

## Como rodar

Pré-requisito: infraestrutura (`docker compose up -d`) e backend (`npm run dev` em `backend/`) já no ar - veja `docs/COMO_RODAR.md`.

```bash
cd iot/simulator
cp .env.example .env
npm install

npm start              # modo normal
npm run start:anomalia # modo anomalia (simula vazamento)
```

O simulador publica uma leitura de água e uma de energia a cada `INTERVALO_MS` (padrão 5s), para os sensores configurados em `.env` (`SENSOR_AGUA_ID`, `SENSOR_ENERGIA_ID` - por padrão, os sensores 1 e 2 do seed de demonstração). Pare com `Ctrl+C` (encerramento gracioso).

O backend (`backend/src/mqtt/subscriber.ts`) assina esse mesmo tópico e registra cada leitura recebida exatamente como faria via `POST /leituras` - reaproveita a mesma validação e a mesma regra de negócio, só muda o transporte.

Um ESP32 real, quando disponível, poderá publicar no mesmo tópico MQTT que o simulador usa, sem exigir nenhuma mudança no backend (veja `docs/ARQUITETURA.md`).
