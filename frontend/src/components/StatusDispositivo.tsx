import type { Dispositivo } from '../api/types';

const LEGENDAS: Record<Dispositivo['status'], string> = {
  ativo: 'ativo',
  offline: 'offline',
  aguardando_conexao: 'aguardando conexão',
};

export function StatusDispositivo({ dispositivo }: { dispositivo: Dispositivo }) {
  return (
    <span className={`status-badge status-${dispositivo.status}`}>
      {dispositivo.nome} · {LEGENDAS[dispositivo.status]}
    </span>
  );
}
