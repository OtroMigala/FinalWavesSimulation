import React, { useState, useEffect } from 'react';

const ScaleInfo = ({ showScaledB, E0 }) => {
  const B0 = E0 / 3e8; // Calculamos B0 real
  
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
      <p className="mt-2 text-gray-500 italic">
        Alterna entre escalas usando el checkbox "Mostrar B con escala física real"
      </p>
    </div>
  );
};

const ElectromagneticWaveSimulation = () => {
  // Estados básicos
  const [time, setTime] = useState(0);
  const [amplitude, setAmplitude] = useState(39);
  const [frequency, setFrequency] = useState(2);
  const [wavelength, setWavelength] = useState(200);
  const [boundaryCondition, setBoundaryCondition] = useState('both-open');
  const [showMagnetic, setShowMagnetic] = useState(true);
  const [showElectric, setShowElectric] = useState(true);
  const [showScaledB, setShowScaledB] = useState(false);

  // Constantes físicas
  const [c, setC] = useState(300000000);
  const [epsilon0, setEpsilon0] = useState(8.85e-12);
  const [mu0, setMu0] = useState(0.00000125663706143592);
  
  // Dimensiones de visualización
  const width = 800;
  const height = 400;

  // Cálculos físicos
  const calculateMagneticAmplitude = (electricAmplitude) => {
    return showScaledB ? electricAmplitude / c : electricAmplitude;
  };

  const verifyLightSpeed = () => {
    const calculatedC = 1 / Math.sqrt(epsilon0 * mu0);
    return Math.abs(calculatedC - c) < 1e-6;
  };

  // Animación
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(t => (t + 0.05) % (2 * Math.PI));
    }, 50);
    return () => clearInterval(timer);
  }, []);

  // Funciones de generación de campos
  const generateElectricField = () => {
    return Array.from({ length: 200 }, (_, i) => {
      const x = (i / 200) * width;
      const k = 2 * Math.PI / wavelength;
      const omega = 2 * Math.PI * frequency;
      const factor = boundaryCondition === 'both-open' ? 1 : Math.cos(k * x);
      const E = amplitude * Math.sin(k * x - omega * time) * factor;
      return `${x},${height/2 + E}`;
    }).join(' ');
  };

  const generateMagneticField = () => {
    const B0 = calculateMagneticAmplitude(amplitude);
    return Array.from({ length: 200 }, (_, i) => {
      const x = (i / 200) * width;
      const k = 2 * Math.PI / wavelength;
      const omega = 2 * Math.PI * frequency;
      const factor = boundaryCondition === 'both-open' ? 1 : Math.sin(k * x);
      const B = B0 * Math.sin(k * x - omega * time + Math.PI/2) * factor;
      return `${x},${height/2 + B}`;
    }).join(' ');
  };

  // Continuación del componente ElectromagneticWaveSimulation
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{fontSize: '24px', marginBottom: '20px', textAlign: 'center'}}>
        Simulación de Ondas Electromagnéticas Estacionarias
      </h1>

      <div style={{display: 'flex', width: '100%', gap: '20px'}}>
        {/* Panel de visualización */}
        <div style={{flex: '3'}}>
          <svg 
            width={width} 
            height={height} 
            style={{
              backgroundColor: 'white',
              border: '1px solid #ccc'
            }}
          >
            {/* Eje x */}
            <line 
              x1="0" y1={height/2} 
              x2={width} y2={height/2} 
              stroke="#CCCCCC" 
              strokeDasharray="4"
            />
            
            {/* Campo Eléctrico */}
            {showElectric && (
              <polyline
                points={generateElectricField()}
                fill="none"
                stroke="blue"
                strokeWidth="2"
              />
            )}
            
            {/* Campo Magnético */}
            {showMagnetic && (
              <polyline
                points={generateMagneticField()}
                fill="none"
                stroke="red"
                strokeWidth="2"
              />
            )}
          </svg>
        </div>

        {/* Panel de control */}
        <div style={{flex: '1', backgroundColor: '#f5f5f5', padding: '20px'}}>
          <h2 style={{fontSize: '18px', marginBottom: '20px'}}>Parámetros de Control</h2>
          
          {/* Control de Amplitud */}
          <div style={{marginBottom: '20px'}}>
            <label style={{display: 'block', marginBottom: '5px'}}>
              Amplitud (E₀): {amplitude} V/m
            </label>
            <input
              type="range"
              min="10"
              max="100"
              value={amplitude}
              onChange={(e) => setAmplitude(Number(e.target.value))}
              style={{width: '100%'}}
            />
          </div>

          {/* Control de Frecuencia */}
          <div style={{marginBottom: '20px'}}>
            <label style={{display: 'block', marginBottom: '5px'}}>
              Frecuencia (f): {frequency} Hz
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={frequency}
              onChange={(e) => setFrequency(Number(e.target.value))}
              style={{width: '100%'}}
            />
          </div>

          {/* Control de Longitud de Onda */}
          <div style={{marginBottom: '20px'}}>
            <label style={{display: 'block', marginBottom: '5px'}}>
              Longitud de onda (λ): {wavelength} m
            </label>
            <input
              type="range"
              min="100"
              max="400"
              step="10"
              value={wavelength}
              onChange={(e) => setWavelength(Number(e.target.value))}
              style={{width: '100%'}}
            />
          </div>

          <h2 style={{fontSize: '18px', marginBottom: '15px', marginTop: '30px'}}>
            Constantes Fundamentales
          </h2>

          {/* Velocidad de la luz */}
          <div style={{marginBottom: '15px'}}>
            <label style={{display: 'block', marginBottom: '5px'}}>
              c (m/s):
            </label>
            <input
              type="number"
              value={c}
              onChange={(e) => setC(Number(e.target.value))}
              style={{width: '100%', padding: '4px'}}
            />
          </div>

          {/* Permitividad del vacío */}
          <div style={{marginBottom: '15px'}}>
            <label style={{display: 'block', marginBottom: '5px'}}>
              ε₀ (F/m):
            </label>
            <input
              type="number"
              value={epsilon0}
              onChange={(e) => setEpsilon0(Number(e.target.value))}
              style={{width: '100%', padding: '4px'}}
            />
          </div>

          {/* Permeabilidad del vacío */}
          <div style={{marginBottom: '15px'}}>
            <label style={{display: 'block', marginBottom: '5px'}}>
              μ₀ (H/m):
            </label>
            <input
              type="number"
              value={mu0}
              onChange={(e) => setMu0(Number(e.target.value))}
              style={{width: '100%', padding: '4px'}}
            />
          </div>

          {/* Condiciones de Frontera */}
          <div style={{marginBottom: '20px'}}>
            <label style={{display: 'block', marginBottom: '5px'}}>
              Condiciones de Frontera
            </label>
            <select 
              value={boundaryCondition}
              onChange={(e) => setBoundaryCondition(e.target.value)}
              style={{width: '100%', padding: '4px'}}
            >
              <option value="both-open">Ambos extremos abiertos</option>
              <option value="one-closed">Un extremo cerrado</option>
            </select>
          </div>

          {/* Controles de visualización */}
          <div style={{display: 'flex', gap: '20px', marginBottom: '15px'}}>
            <label>
              <input
                type="checkbox"
                checked={showElectric}
                onChange={(e) => setShowElectric(e.target.checked)}
                style={{marginRight: '5px'}}
              />
              Campo E
            </label>
            <label>
              <input
                type="checkbox"
                checked={showMagnetic}
                onChange={(e) => setShowMagnetic(e.target.checked)}
                style={{marginRight: '5px'}}
              />
              Campo B
            </label>
          </div>

        <ScaleInfo 
        showScaledB={showScaledB} 
        E0={amplitude}
        />

          {/* Toggle de escala real */}
          <div>
            <label>
              <input
                type="checkbox"
                checked={showScaledB}
                onChange={(e) => setShowScaledB(e.target.checked)}
                style={{marginRight: '5px'}}
              />
              Mostrar B con escala física real
            </label>

               {/* Valores calculados adicionales */}
        <div className="mt-4 p-4 bg-gray-50 rounded">
          <h3 className="font-semibold mb-2">Valores Calculados:</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>Velocidad de fase: {(frequency * wavelength).toFixed(2)} m/s</div>
            <div>Número de onda (k): {(2 * Math.PI / wavelength).toFixed(4)} rad/m</div>
            <div>Frecuencia angular (ω): {(2 * Math.PI * frequency).toFixed(4)} rad/s</div>
            <div>Período: {(1/frequency).toFixed(4)} s</div>
          </div>
        </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElectromagneticWaveSimulation;