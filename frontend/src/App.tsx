import { ConsumoTile } from './components/ConsumoTile';
import { HistoricoChart } from './components/HistoricoChart';
import { StatusDispositivo } from './components/StatusDispositivo';
import { useDashboardData } from './hooks/useDashboardData';

// Ainda sem autenticação (Etapa 7) - o dashboard mostra os dados do
// usuário de demonstração configurado no .env, mesma abordagem já
// usada no backend ("sem autenticação obrigatória, para simplificar a
// primeira demonstração ponta a ponta", ver backend/README.md).
const USUARIO_ID_DEMO = Number(import.meta.env.VITE_USUARIO_ID_DEMO ?? 1);

function App() {
  const { carregando, erro, dispositivo, sensorAgua, sensorEnergia } =
    useDashboardData(USUARIO_ID_DEMO);

  return (
    <div className="pagina">
      <header className="cabecalho">
        <h1>SenseControl</h1>
        {dispositivo && <StatusDispositivo dispositivo={dispositivo} />}
      </header>

      {carregando && <p className="mensagem-central">Carregando dados do dashboard...</p>}

      {erro && (
        <p className="mensagem-central mensagem-erro">
          Não foi possível carregar o dashboard: {erro}
          <br />
          Confira se o backend está rodando (<code>npm run dev</code> em <code>backend/</code>) e se
          o banco tem os dados de demonstração aplicados.
        </p>
      )}

      {!carregando && !erro && sensorAgua && sensorEnergia && (
        <main>
          <section className="tiles">
            <ConsumoTile titulo="Água" icone="💧" dados={sensorAgua} />
            <ConsumoTile titulo="Energia" icone="⚡" dados={sensorEnergia} />
          </section>

          <section className="graficos">
            <HistoricoChart
              titulo="Histórico de consumo de água"
              unidade="L"
              cor="var(--cor-agua)"
              consumoDiario={sensorAgua.consumoDiario}
            />
            <HistoricoChart
              titulo="Histórico de consumo de energia"
              unidade="kWh"
              cor="var(--cor-energia)"
              consumoDiario={sensorEnergia.consumoDiario}
            />
          </section>
        </main>
      )}

      <footer className="rodape">
        Atualiza automaticamente a cada 5s. Rode o simulador (<code>iot/simulator</code>) para ver
        novas leituras chegarem ao vivo.
      </footer>
    </div>
  );
}

export default App;
