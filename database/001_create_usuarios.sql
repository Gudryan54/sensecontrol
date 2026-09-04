-- ============================================================
-- 001_create_usuarios.sql
-- Tabela de usuários do sistema (comum, técnico, admin)
-- ============================================================

CREATE TABLE IF NOT EXISTS usuarios (
    id            SERIAL PRIMARY KEY,
    nome          VARCHAR(150) NOT NULL,
    email         VARCHAR(150) NOT NULL UNIQUE,
    senha_hash    VARCHAR(255) NOT NULL,
    perfil        VARCHAR(20)  NOT NULL DEFAULT 'comum'
                  CHECK (perfil IN ('comum', 'tecnico', 'admin')),
    criado_em     TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios (email);
