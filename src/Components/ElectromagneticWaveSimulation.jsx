import React, { useState, useEffect } from 'react';

const ElectromagneticWaveSimulation = () => {
  const [time, setTime] = useState(0);
  const [amplitude, setAmplitude] = useState(39);
  const [frequency, setFrequency] = useState(2);
  const [wavelength, setWavelength] = useState(200);
  const [boundaryCondition, setBoundaryCondition] = useState('both-open');
  const [showMagnetic, setShowMagnetic] = useState(true);
  const [showElectric, setShowElectric] = useState(true);
  
  // Constantes físicas
  const [c, setC] = useState(300000000);
  const [epsilon0, setEpsilon0] = useState(8.85e-12);
  const [mu0, setMu0] = useState(0.00000125663706143592);
  
  const width = 800;
  const height = 400;

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(t => (t + 0.05) % (2 * Math.PI));
    }, 50);
    return () => clearInterval(timer);
  }, []);

  const generateElectricField = () => {
    return Array.from({ length: 200 }, (_, i) => {
      const x = (i / 200) * width;
      const k = 2 * Math.PI / wavelength;
      const omega = 2 * Math.PI * frequency;
      const factor = boundaryCondition === 'both-open' ? 1 : Math.cos(k * x);
      const y = height/2 + amplitude * Math.sin(k * x - omega * time) * factor;
      return `${x},${y}`;
    }).join(' ');
  };

  const generateMagneticField = () => {
    return Array.from({ length: 200 }, (_, i) => {
      const x = (i / 200) * width;
      const k = 2 * Math.PI / wavelength;
      const omega = 2 * Math.PI * frequency;
      const factor = boundaryCondition === 'both-open' ? 1 : Math.sin(k * x);
      const y = height/2 + amplitude * Math.cos(k * x - omega * time + Math.PI/2) * factor;
      return `${x},${y}`;
    }).join(' ');
  };

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
            <line 
              x1="0" y1={height/2} 
              x2={width} y2={height/2} 
              stroke="#CCCCCC" 
              strokeDasharray="4"
            />
            
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
          </svg>
        </div>

        {/* Panel de control */}
        <div style={{flex: '1', backgroundColor: '#f5f5f5', padding: '20px'}}>
          <h2 style={{fontSize: '18px', marginBottom: '20px'}}>Parámetros de Control</h2>
          
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

          <div style={{display: 'flex', gap: '20px'}}>
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
        </div>
      </div>
    </div>
  );
};

export default ElectromagneticWaveSimulation;