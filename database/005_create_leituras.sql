-- ============================================================
-- 005_create_leituras.sql
-- Leituras brutas dos sensores (série temporal, tabela de maior volume).
-- Usa BIGSERIAL porque o número de linhas cresce rapidamente
-- (um sensor pode gerar uma leitura a cada poucos segundos/minutos).
-- O índice composto (sensor_id, timestamp) é o que sustenta as
-- consultas de histórico por período (GET /leituras?sensor_id=&inicio=&fim=).
-- ============================================================

CREATE TABLE IF NOT EXISTS leituras (
    id          BIGSERIAL PRIMARY KEY,
    sensor_id   INTEGER NOT NULL REFERENCES sensores (id) ON DELETE CASCADE,
    valor       DECIMAL(10, 3) NOT NULL,
    "timestamp" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leituras_sensor_timestamp
    ON leituras (sensor_id, "timestamp" DESC);

-- Observação para evolução futura (roadmap - ver docs/ARQUITETURA.md):
-- esta tabela é a candidata natural a virar uma hypertable do TimescaleDB
-- quando o volume de leituras justificar a migração.
