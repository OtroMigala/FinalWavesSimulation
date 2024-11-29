import React, { useState, useEffect } from 'react';

const ElectromagneticWaveSimulation = () => {
  const [time, setTime] = useState(0);
  const [amplitude, setAmplitude] = useState(39);
  const [frequency, setFrequency] = useState(2);
  const [boundaryCondition, setBoundaryCondition] = useState('both-open');
  const [showMagnetic, setShowMagnetic] = useState(true);
  const [showElectric, setShowElectric] = useState(true);
  
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
      const k = 2 * Math.PI / 200;
      const omega = 2 * Math.PI * frequency;
      const factor = boundaryCondition === 'both-open' ? 1 : Math.cos(k * x);
      const y = height/2 + amplitude * Math.sin(k * x - omega * time) * factor;
      return `${x},${y}`;
    }).join(' ');
  };

  const generateMagneticField = () => {
    return Array.from({ length: 200 }, (_, i) => {
      const x = (i / 200) * width;
      const k = 2 * Math.PI / 200;
      const omega = 2 * Math.PI * frequency;
      const factor = boundaryCondition === 'both-open' ? 1 : Math.sin(k * x);
      const y = height/2 + amplitude * Math.cos(k * x - omega * time + Math.PI/2) * factor;
      return `${x},${y}`;
    }).join(' ');
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: 'white',
    minHeight: '100vh',
    maxWidth: '1000px',
    margin: '0 auto'
  };

  const controlStyle = {
    width: '100%',
    maxWidth: '800px',
    marginBottom: '10px'
  };

  const checkboxContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginBottom: '10px'
  };

  return (
    <div style={containerStyle}>
      <h1 style={{fontSize: '24px', marginBottom: '20px', textAlign: 'center'}}>
        Simulación de Ondas Electromagnéticas Estacionarias
      </h1>

      <div style={{marginBottom: '20px', backgroundColor: 'white'}}>
        <svg width={width} height={height}>
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

      <div style={controlStyle}>
        <div style={{marginBottom: '10px', textAlign: 'left'}}>
          <label style={{display: 'block', marginBottom: '5px'}}>
            Amplitud: {amplitude} unidades
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

        <div style={{marginBottom: '10px', textAlign: 'left'}}>
          <label style={{display: 'block', marginBottom: '5px'}}>
            Frecuencia: {frequency} Hz
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

        <div style={checkboxContainerStyle}>
          <label>
            <input
              type="checkbox"
              checked={showElectric}
              onChange={(e) => setShowElectric(e.target.checked)}
              style={{marginRight: '5px'}}
            />
            Campo Eléctrico
          </label>
          <label>
            <input
              type="checkbox"
              checked={showMagnetic}
              onChange={(e) => setShowMagnetic(e.target.checked)}
              style={{marginRight: '5px'}}
            />
            Campo Magnético
          </label>
        </div>

        <div style={{marginBottom: '20px', textAlign: 'left'}}>
          <label style={{display: 'block', marginBottom: '5px'}}>
            Condiciones de Frontera
          </label>
          <select 
            value={boundaryCondition}
            onChange={(e) => setBoundaryCondition(e.target.value)}
            style={{padding: '2px', width: '200px'}}
          >
            <option value="both-open">Ambos extremos abiertos</option>
            <option value="one-closed">Un extremo cerrado</option>
          </select>
        </div>
      </div>

      <div style={{width: '100%', maxWidth: '800px', textAlign: 'left'}}>
        <h2 style={{fontSize: '20px', marginBottom: '10px'}}>Parámetros Físicos:</h2>
        <ul style={{listStyle: 'none', padding: 0}}>
          <li>• Velocidad de propagación: c (velocidad de la luz)</li>
          <li>• Número de onda (k): {(2 * Math.PI / 200).toFixed(3)} rad/unidad</li>
          <li>• Frecuencia angular (ω): {(2 * Math.PI * frequency).toFixed(3)} rad/s</li>
          <li>• Longitud de onda: 200 unidades</li>
        </ul>
      </div>
    </div>
  );
};

export default ElectromagneticWaveSimulation;