# Modelo de dados - SenseControl

O modelo de dados implementado é o mesmo já especificado na documentação técnica do projeto (seção 8), transcrito aqui junto com a justificativa de cada decisão de implementação (tipos de coluna, índices, etc.). O SQL executável está em `database/001_create_usuarios.sql` a `database/008_create_recomendacoes.sql`.

## Entidades e relacionamentos

Todas as relações são 1:N (um usuário tem vários locais, um local tem vários dispositivos, e assim por diante):

```
usuarios 1───N locais 1───N dispositivos 1───N sensores 1───N leituras
                                                      │
                                                      └──N consumo_diario
usuarios 1───N alertas
usuarios 1───N recomendacoes
```

| Tabela | Campos principais | Observações de implementação |
|---|---|---|
| `usuarios` | id, nome, email (único), senha_hash, perfil (`comum`/`tecnico`/`admin`), criado_em | `perfil` validado por `CHECK`, refletindo os 3 perfis de usuário da seção 4 da documentação técnica. Senha nunca armazenada em texto puro (bcrypt). |
| `locais` | id, usuario_id (FK), nome, endereco (opcional) | Um usuário pode monitorar mais de uma residência/estabelecimento. |
| `dispositivos` | id, local_id (FK), nome, identificador_mac (único), status (`ativo`/`offline`/`aguardando_conexao`), criado_em | `identificador_mac` único evita cadastrar o mesmo gateway ESP32 duas vezes. |
| `sensores` | id, dispositivo_id (FK), tipo (`agua`/`energia`), unidade_medida (`litros`/`kWh`), criado_em | Um dispositivo pode ter mais de um sensor (ex.: água e energia no mesmo gateway). |
| `leituras` | id (BIGSERIAL), sensor_id (FK), valor (DECIMAL 10,3), timestamp | Tabela de maior volume (uma leitura a cada poucos minutos, por sensor). Índice composto `(sensor_id, timestamp DESC)` sustenta as consultas de histórico por período. |
| `consumo_diario` | id (BIGSERIAL), sensor_id (FK), data, consumo_total | Agregação diária pré-calculada, para não somar `leituras` inteira a cada consulta do dashboard/comparação de períodos. `UNIQUE(sensor_id, data)` evita duplicidade. |
| `alertas` | id, usuario_id (FK), sensor_id (FK), tipo, descricao, nivel_severidade (`baixo`/`medio`/`alto`), lido (boolean), criado_em | Gerado pelas regras de detecção (seção 11 da documentação técnica). |
| `recomendacoes` | id, usuario_id (FK), titulo, descricao, criado_em | Gerada a partir dos padrões de consumo identificados. |

## Decisões de implementação

- **Chaves primárias:** `SERIAL`/`BIGSERIAL` (inteiros autoincrementais) em vez de UUID, por simplicidade de leitura durante o desenvolvimento e a avaliação (mais fácil de referenciar em testes manuais via Postman/curl do que UUIDs longos) - decisão coerente com a prioridade de clareza sobre a de um sistema comercial.
- **`ON DELETE CASCADE`** nas chaves estrangeiras: ao remover um usuário de teste, por exemplo, seus locais/dispositivos/sensores/leituras são removidos automaticamente, o que facilita reinicializar o ambiente de demonstração sem deixar dados órfãos.
- **`CHECK` constraints** nos campos de enumeração (`perfil`, `status`, `tipo`, `unidade_medida`, `nivel_severidade`) em vez de tabelas de domínio separadas: menos tabelas para acompanhar em um MVP pequeno, com a mesma garantia de integridade.
- **Unidades e datas:** `valor` em `leituras` usa `DECIMAL(10,3)` (3 casas decimais) para comportar tanto litros quanto kWh com precisão adequada; todos os campos de data/hora usam `TIMESTAMP` (sem fuso embutido) - o sistema assume que backend e banco rodam no mesmo fuso (America/Sao_Paulo), documentado aqui para evitar ambiguidade.
- **Dados de demonstração:** `database/009_demo_data.sql` popula todas as tabelas com dados fictícios e plausíveis (ver `database/README.md`), para que o dashboard mostre informação real assim que o sistema subir.
