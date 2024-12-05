import React, { useState, useEffect } from 'react';

const ScaleInfo = ({ showScaledB, E0 }) => {
  const B0 = E0 / 3e8;
  return (
    <div className="mt-4 p-4 bg-blue-50 rounded-lg text-sm">
      <h3 className="font-semibold mb-2">Información de Escalas:</h3>
      {showScaledB ? (
        <div>
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">⚠️ Nota sobre la escala real:</span>
          </p>
          <p className="text-gray-600">
            El campo B parece "desaparecer" porque estás viendo la escala física real. 
            Para E₀ = {E0} V/m, B₀ = {B0.toExponential(2)} T, una diferencia de {(E0/B0).toExponential(2)} veces.
            Esta diferencia de magnitud hace que B sea casi imperceptible en esta escala.
          </p>
        </div>
      ) : (
        <p className="text-gray-600">
          Actualmente mostrando una visualización amplificada del campo B para propósitos didácticos. 
          La relación real B₀ = E₀/c es mucho menor.
        </p>
      )}
    </div>
  );
};

const ModeInfo = ({ modes, width }) => {
  const c = 3e8;
  return (
    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
      <h3 className="font-semibold">Información de Modos:</h3>
      <p>Frecuencias permitidas: fn = nc/(2L)</p>
      <p>Longitudes de onda: λn = 2L/n</p>
      <p>Números de onda: kn = nπ/L</p>
      {modes.map(n => (
        <div key={n}>
          Modo {n}: f{n} = {(n * c/(2*width)).toExponential(2)} Hz
        </div>
      ))}
    </div>
  );
};

const ElectromagneticWaveSimulation = () => {
  // Estados básicos
  const [time, setTime] = useState(0);
  const [amplitude, setAmplitude] = useState(0.001); // Aumentado
  const [frequency, setFrequency] = useState(1e7); // Ajustado a 10MHz inicial
  const [boundaryCondition, setBoundaryCondition] = useState('both-closed');
  const [showMagnetic, setShowMagnetic] = useState(true);
  const [showElectric, setShowElectric] = useState(true);
  const [showScaledB, setShowScaledB] = useState(false);
  const [selectedModes, setSelectedModes] = useState([1]); // Comenzar con modo fundamental

  // Constantes físicas
  const c = 3e8;
  const epsilon0 = 8.85e-12;
  const mu0 = 1.256637061e-6;

  // Dimensiones de visualización
  const width = 800;
  const height = 400;

  // Cálculos derivados
  const wavelength = c / frequency;

  const calculateMagneticAmplitude = (electricAmplitude) => {
    // Usar la impedancia del vacío para el cálculo
    const Z0 = Math.sqrt(mu0/epsilon0);
    return showScaledB ? electricAmplitude / Z0 : electricAmplitude;
  };

  // Modificar las funciones de generación de campos
  const generateElectricField = () => {
    const L = width;
    const visualScale = 50000;
    return Array.from({ length: 400 }, (_, i) => {
      const x = (i / 400) * L;
      let E = 0;
      
      selectedModes.forEach(n => {
        const kn = n * Math.PI / L;
        // Reducir la frecuencia para visualización
        const omega = 0.5; // Frecuencia angular más lenta para visualización
        switch(boundaryCondition) {
          case 'both-closed':
            E += amplitude * Math.sin(kn * x) * Math.cos(omega * time);
            break;
          case 'one-closed':
            E += amplitude * Math.cos(kn * x / 2) * Math.cos(omega * time);
            break;
          default:
            E += amplitude * Math.sin(kn * x) * Math.cos(omega * time);
        }
      });
      
      return `${x},${height/2 - (E * visualScale)}`; 
    }).join(' ');
  };
  
  const generateMagneticField = () => {
    const L = width;
    const visualScale = 50000; // Mismo factor de escala
    return Array.from({ length: 400 }, (_, i) => {
      const x = (i / 400) * L;
      let B = 0;
      
      selectedModes.forEach(n => {
        const kn = n * Math.PI / L;
        // Usar la misma frecuencia angular reducida que en el campo eléctrico
        const omega = 0.5; // Frecuencia angular más lenta para visualización
        switch(boundaryCondition) {
          case 'both-closed':
            // Desfase de π/2 respecto al campo E, usando sin cuando E usa cos
            B += calculateMagneticAmplitude(amplitude) * Math.cos(kn * x) * 
                 Math.sin(omega * time);
            break;
          case 'one-closed':
            B += calculateMagneticAmplitude(amplitude) * Math.sin(kn * x / 2) * 
                 Math.sin(omega * time);
            break;
          default:
            B += calculateMagneticAmplitude(amplitude) * Math.cos(kn * x) * 
                 Math.sin(omega * time);
        }
      });
      
      return `${x},${height/2 - (B * visualScale)}`;
    }).join(' ');
  };

// Modificar useEffect para una animación más suave
useEffect(() => {
  const timer = setInterval(() => {
    setTime(oldTime => {
      const newTime = oldTime + 0.1;  // Aumentar el incremento
      console.log('Time:', newTime); // Para debug
      return newTime % (2 * Math.PI);
    });
  }, 50);  // Ajustar el intervalo
  return () => clearInterval(timer);
}, []);

return (
  <div className="flex flex-col items-center w-full min-h-screen p-4 bg-gray-50">
    <h1 className="text-2xl font-bold text-center mb-8">
      Simulación de Ondas Electromagnéticas Estacionarias en Cavidad Conductora
    </h1>

    <div className="flex flex-col md:flex-row w-full max-w-7xl gap-8">
      {/* Panel de visualización */}
      <div className="flex-1 bg-white rounded-lg shadow-md p-4">
        <svg 
          width={width} 
          height={height} 
          className="w-full h-full"
          style={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb'
          }}
        >
          {/* Líneas de referencia */}
          {/* Líneas horizontales */}
          <line 
            x1="0" y1={height/4} 
            x2={width} y2={height/4} 
            stroke="#CCCCCC" 
            strokeDasharray="4,4"
          />
          <line 
            x1="0" y1={height/2} 
            x2={width} y2={height/2} 
            stroke="#000000" 
            strokeWidth="0.5" 
            strokeDasharray="2,2"
          />
          <line 
            x1="0" y1={3*height/4} 
            x2={width} y2={3*height/4} 
            stroke="#CCCCCC" 
            strokeDasharray="4,4"
          />
          
          {/* Líneas verticales para los extremos */}
          <line 
            x1="0" y1="0" 
            x2="0" y2={height} 
            stroke="#000000" 
            strokeWidth="0.5"
          />
          <line 
            x1={width} y1="0" 
            x2={width} y2={height} 
            stroke="#000000" 
            strokeWidth="0.5"
          />

          {/* Campos Electromagnéticos */}
          {showElectric && (
            <polyline
              points={generateElectricField()}
              fill="none"
              stroke="blue"
              strokeWidth="2"
            />
          )}
          
          {showMagnetic && (
            <polyline
              points={generateMagneticField()}
              fill="none"
              stroke="red"
              strokeWidth="2"
            />
          )}

          {/* Leyenda */}
          <text x="10" y="20" fill="blue" fontSize="12">Campo E</text>
          <text x="10" y="40" fill="red" fontSize="12">Campo B</text>
        </svg>
      </div>

      {/* Panel de control */}
      <div className="w-full md:w-96 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-6">Parámetros de Control</h2>
        
        {/* Control de Amplitud */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amplitud del Campo E (E₀): {amplitude.toExponential(3)} V/m
          </label>
          <input
            type="range"
            min="0.001"
            max="0.01"
            step="0.001"
            value={amplitude}
            onChange={(e) => setAmplitude(Number(e.target.value))}
            className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Control de Frecuencia */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Frecuencia (f): {frequency.toExponential(2)} Hz
          </label>
          <input
            type="range"
            min="1e6"
            max="1e9"
            step="1e6"
            value={frequency}
            onChange={(e) => setFrequency(Number(e.target.value))}
            className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
          />
          <div className="text-sm text-gray-500 mt-1">
            λ = {wavelength.toExponential(2)} m
          </div>
        </div>

        {/* Condiciones de Frontera */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Condiciones de Frontera
          </label>
          <select 
            value={boundaryCondition}
            onChange={(e) => setBoundaryCondition(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
          >
            <option value="both-closed">Ambos extremos cerrados</option>
            <option value="one-closed">Un extremo cerrado</option>
            <option value="both-open">Ambos extremos abiertos</option>
          </select>
        </div>

        {/* Modos Armónicos */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Modos Armónicos
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5].map(mode => (
              <label key={mode} className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={selectedModes.includes(mode)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedModes([...selectedModes, mode]);
                    } else {
                      setSelectedModes(selectedModes.filter(m => m !== mode));
                    }
                  }}
                  className="form-checkbox h-4 w-4 text-blue-600"
                />
                <span className="ml-2 text-sm text-gray-700">Modo {mode}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Controles de Visualización */}
        <div className="flex flex-col gap-2 mb-6">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={showElectric}
              onChange={(e) => setShowElectric(e.target.checked)}
              className="form-checkbox h-4 w-4 text-blue-600"
            />
            <span className="ml-2 text-sm text-gray-700">Campo E</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={showMagnetic}
              onChange={(e) => setShowMagnetic(e.target.checked)}
              className="form-checkbox h-4 w-4 text-blue-600"
            />
            <span className="ml-2 text-sm text-gray-700">Campo B</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={showScaledB}
              onChange={(e) => setShowScaledB(e.target.checked)}
              className="form-checkbox h-4 w-4 text-blue-600"
            />
            <span className="ml-2 text-sm text-gray-700">Mostrar B con escala física real</span>
          </label>
        </div>

        <ScaleInfo showScaledB={showScaledB} E0={amplitude} />
        <ModeInfo modes={selectedModes} width={width} />
      </div>
    </div>
  </div>
);
};

export default ElectromagneticWaveSimulation;