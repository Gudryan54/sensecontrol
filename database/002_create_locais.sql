-- ============================================================
-- 002_create_locais.sql
-- Um usuário pode ter mais de um local (residência/estabelecimento)
-- ============================================================

CREATE TABLE IF NOT EXISTS locais (
    id            SERIAL PRIMARY KEY,
    usuario_id    INTEGER NOT NULL REFERENCES usuarios (id) ON DELETE CASCADE,
    nome          VARCHAR(100) NOT NULL,
    endereco      VARCHAR(255)
);

CREATE INDEX IF NOT EXISTS idx_locais_usuario_id ON locais (usuario_id);
