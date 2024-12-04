import WaveComparison from './Components/WaveComparison';
import WaveHarmonics from './Components/WaveHarmonics';
import ResonantCavity from './Components/ResonantCavity';
import EnhancedCavity from './Components/EnhancedCavity';

function App() {
  return (
    <div className="App">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        <header className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Simulación de Ondas Electromagnéticas
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore las características de las ondas electromagnéticas a través de simulaciones interactivas
          </p>
        </header>

        <div className="grid gap-12">
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              Comparación de Ondas
            </h2>
            <WaveComparison />
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              Armónicos de Ondas
            </h2>
            <WaveHarmonics />
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              Cavidad Resonante
            </h2>
            <EnhancedCavity />
          </section>
        </div>

        <footer className="text-center text-gray-600 text-sm mt-12">
          <p>© 2024 Simulación de Ondas Electromagnéticas</p>
        </footer>
      </div>
    </div>
  );
}

export default App;