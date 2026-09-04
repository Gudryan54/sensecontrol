-- ============================================================
-- 007_create_alertas.sql
-- Alertas gerados pelas regras de detecção de desperdício (seção 11
-- da documentação técnica). Sem Machine Learning no MVP: regras
-- estatísticas simples sobre consumo_diario/leituras.
-- ============================================================

CREATE TABLE IF NOT EXISTS alertas (
    id                SERIAL PRIMARY KEY,
    usuario_id        INTEGER NOT NULL REFERENCES usuarios (id) ON DELETE CASCADE,
    sensor_id         INTEGER NOT NULL REFERENCES sensores (id) ON DELETE CASCADE,
    tipo              VARCHAR(50) NOT NULL,
    descricao         VARCHAR(255) NOT NULL,
    nivel_severidade  VARCHAR(20) NOT NULL DEFAULT 'medio'
                      CHECK (nivel_severidade IN ('baixo', 'medio', 'alto')),
    lido              BOOLEAN NOT NULL DEFAULT FALSE,
    criado_em         TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_alertas_usuario_id ON alertas (usuario_id);
CREATE INDEX IF NOT EXISTS idx_alertas_sensor_id ON alertas (sensor_id);
