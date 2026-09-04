-- ============================================================
-- 003_create_dispositivos.sql
-- Dispositivo IoT (gateway ESP32) instalado em um local
-- ============================================================

CREATE TABLE IF NOT EXISTS dispositivos (
    id                 SERIAL PRIMARY KEY,
    local_id           INTEGER NOT NULL REFERENCES locais (id) ON DELETE CASCADE,
    nome               VARCHAR(100) NOT NULL,
    identificador_mac  VARCHAR(50) NOT NULL UNIQUE,
    status             VARCHAR(20) NOT NULL DEFAULT 'aguardando_conexao'
                       CHECK (status IN ('ativo', 'offline', 'aguardando_conexao')),
    criado_em          TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dispositivos_local_id ON dispositivos (local_id);
