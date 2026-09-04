-- ============================================================
-- 008_create_recomendacoes.sql
-- Recomendações textuais geradas para o usuário a partir dos
-- padrões de consumo identificados.
-- ============================================================

CREATE TABLE IF NOT EXISTS recomendacoes (
    id           SERIAL PRIMARY KEY,
    usuario_id   INTEGER NOT NULL REFERENCES usuarios (id) ON DELETE CASCADE,
    titulo       VARCHAR(100) NOT NULL,
    descricao    VARCHAR(255) NOT NULL,
    criado_em    TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_recomendacoes_usuario_id ON recomendacoes (usuario_id);
