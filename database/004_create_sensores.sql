-- ============================================================
-- 004_create_sensores.sql
-- Sensor físico (água ou energia) ligado a um dispositivo IoT
-- ============================================================

CREATE TABLE IF NOT EXISTS sensores (
    id               SERIAL PRIMARY KEY,
    dispositivo_id   INTEGER NOT NULL REFERENCES dispositivos (id) ON DELETE CASCADE,
    tipo             VARCHAR(20) NOT NULL CHECK (tipo IN ('agua', 'energia')),
    unidade_medida   VARCHAR(10) NOT NULL CHECK (unidade_medida IN ('litros', 'kWh')),
    criado_em        TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sensores_dispositivo_id ON sensores (dispositivo_id);
