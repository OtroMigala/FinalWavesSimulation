import React, { useState } from 'react';
import WaveComparison from './Components/WaveComparison';
import WaveHarmonics from './Components/WaveHarmonics';
import EnhancedCavity from './Components/EnhancedCavity';
import NewComponent from './Components/WaveControls';
import WaveControls from './Components/WaveControls';


const App = () => {
  const [activeTab, setActiveTab] = useState('comparison');

  const tabs = [
    { id: 'comparison', label: 'Comparación de Ondas', component: <WaveComparison /> },
    { id: 'harmonics', label: 'Ecuaciones', component: <WaveControls /> },
    { id: 'cavity', label: 'Cavidad Resonante', component: <EnhancedCavity /> }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header - Centrado */}
      <header className="w-full bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Simulación de Ondas Electromagnéticas
          </h1>
        </div>
      </header>

      {/* Main Content - Centrado */}
      <main className="container mx-auto px-4 py-6">
        {/* Tabs Navigation - Centrado */}
        <div className="max-w-3xl mx-auto mb-6">
          <div className="flex justify-center gap-2 bg-white p-2 rounded-lg shadow-sm">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  py-2.5 px-8 rounded-md text-sm font-medium
                  transition-all duration-200 ease-in-out
                  ${activeTab === tab.id 
                    ? 'bg-blue-500 text-white shadow-sm' 
                    : 'text-gray-700 hover:bg-gray-50'}
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Component Container - Centrado */}
        <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-sm p-6">
          {tabs.find(tab => tab.id === activeTab)?.component}
        </div>

        {/* Mostrar Datos */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">
            Datos
          </h2>
          <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-sm p-6">
            
          </div>
        </div>


      </main>

      {/* Footer - Centrado */}
      <footer className="w-full bg-white border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4 py-6 text-center">
          <div className="text-gray-600 text-sm">
            <p className="mb-2">© 2024 Simulación de Ondas Electromagnéticas</p>
            <p>Desarrollado para visualización y análisis de fenómenos ondulatorios</p>
            <p>Desarrollado por: Alejandro Cardenas, Paulo C. Chamorro, Jesus G. Parra y Elkin A. Morillo</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;