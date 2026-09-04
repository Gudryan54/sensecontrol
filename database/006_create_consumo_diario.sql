-- ============================================================
-- 006_create_consumo_diario.sql
-- Agregação diária de consumo por sensor - acelera consultas de
-- histórico/comparação sem precisar somar "leituras" a cada requisição.
-- ============================================================

CREATE TABLE IF NOT EXISTS consumo_diario (
    id              BIGSERIAL PRIMARY KEY,
    sensor_id       INTEGER NOT NULL REFERENCES sensores (id) ON DELETE CASCADE,
    data            DATE NOT NULL,
    consumo_total   DECIMAL(10, 3) NOT NULL DEFAULT 0,
    UNIQUE (sensor_id, data)
);

CREATE INDEX IF NOT EXISTS idx_consumo_diario_sensor_data
    ON consumo_diario (sensor_id, data DESC);
