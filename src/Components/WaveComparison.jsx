import React, { useState, useEffect } from 'react';
import WaveControls from "./WaveControls";

// Componentes de la tarjeta
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-md flex flex-col items-center w-full ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children }) => (
  <div className="w-full p-4 border-b text-center flex justify-center items-center">
    {children}
  </div>
);

const CardTitle = ({ children }) => (
  <h2 className="text-xl font-semibold text-center">
    {children}
  </h2>
);

const CardContent = ({ children }) => (
  <div className="w-full p-4 flex flex-col items-center">
    {children}
  </div>
);

const WaveComparison = () => {

  // Estados para controlar las variables
  const [time, setTime] = useState(0);
  const [amplitude, setAmplitude] = useState(50);
  const [wavelength, setWavelength] = useState(200);
  const [frequency, setFrequency] = useState(1);
  const [showEField, setShowEField] = useState(true);
  const [showBField, setShowBField] = useState(true);
  const [observationPoint, setObservationPoint] = useState(300);
  const [boundaryCondition, setBoundaryCondition] = useState('open-open'); // Nuevo estado para condiciones de frontera

  // Dimensiones para cada visualización
  const width = 800;
  const height = 200;
  const graphHeight = 150;

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(t => (t + 0.05) % (2 * Math.PI));
    }, 50);
    return () => clearInterval(timer);
  }, []);

  // Cálculos físicos en tiempo real
  const k = 2 * Math.PI / wavelength; // Número de onda
  const omega = 2 * Math.PI * frequency; // Frecuencia angular
  const period = 1 / frequency; // Período
  const phaseVelocity = wavelength * frequency; // Velocidad de fase
  const energy = 0.5 * Math.pow(amplitude, 2) * Math.pow(omega, 2); // Energía proporcional

  // Función para generar puntos de onda estacionaria
  const generateStandingWavePoints = (field) => {
    return Array.from({ length: 100 }, (_, i) => {
      const x = (i / 100) * width;
      const position = field === 'E' ? Math.sin(k * x) : Math.cos(k * x);
      const y = height / 2 + amplitude * position * Math.cos(omega * time);
      return `${x},${y}`;
    }).join(' ');
  };

  // Función para generar puntos de onda viajera
  const generateTravelingWavePoints = (field) => {
    return Array.from({ length: 100 }, (_, i) => {
      const x = (i / 100) * width;
      const phase = field === 'E' ? 0 : Math.PI / 2;
      const y = height / 2 + amplitude * Math.sin(k * x - omega * time + phase);
      return `${x},${y}`;
    }).join(' ');
  };

  // Historial de oscilación del punto de observación
  const timeHistory = Array.from({ length: 50 }, (_, i) => {
    const pastTime = time - (i * 0.1);
    const x = width - (i * 5);
    const y = graphHeight / 2 + amplitude / 2 * Math.sin(k * observationPoint - omega * pastTime);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="container mx-auto flex flex-col items-center w-full">
      <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-8 p-4">
        {/* Columna izquierda - Visualizaciones */}
        <div className="w-full lg:w-2/3">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Visualización de Ondas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Onda Estacionaria */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Onda Estacionaria</h3>
                <div className="border-2 border-gray-200 rounded-lg p-3 bg-white">
                  <svg width={width} height={height} className="w-full">
                    <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke="gray" strokeDasharray="4" />
                    {showEField && (
                      <polyline points={generateStandingWavePoints('E')} fill="none" stroke="red" strokeWidth="2" />
                    )}
                    {showBField && (
                      <polyline points={generateStandingWavePoints('B')} fill="none" stroke="blue" strokeWidth="2" />
                    )}
                  </svg>
                </div>
              </div>

              {/* Onda Viajera */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Onda Viajera</h3>
                <div className="border-2 border-gray-200 rounded-lg p-3 bg-white">
                  <svg width={width} height={height} className="w-full">
                    <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke="gray" strokeDasharray="4" />
                    {showEField && (
                      <polyline points={generateTravelingWavePoints('E')} fill="none" stroke="red" strokeWidth="2" />
                    )}
                    {showBField && (
                      <polyline points={generateTravelingWavePoints('B')} fill="none" stroke="blue" strokeWidth="2" />
                    )}
                  </svg>
                </div>
              </div>

              {/* Historial Temporal */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Historial Temporal</h3>
                <div className="border-2 border-gray-200 rounded-lg p-3 bg-white">
                  <svg width={width} height={graphHeight} className="w-full">
                    <line x1="0" y1={graphHeight / 2} x2={width} y2={graphHeight / 2} stroke="gray" strokeDasharray="4" />
                    <polyline points={timeHistory} fill="none" stroke="purple" strokeWidth="2" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Columna derecha - Controles */}
        <div className="w-full lg:w-1/3 space-y-4">
          {/* Panel de Parámetros */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Parámetros Físicos</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Parámetros Físicos */}
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="font-medium">Número de onda (k): </span>
                  <span className="font-mono">{k.toFixed(4)}</span>
                  <span className="text-gray-600"> rad/m</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="font-medium">Frecuencia angular (ω): </span>
                  <span className="font-mono">{omega.toFixed(4)}</span>
                  <span className="text-gray-600"> rad/s</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="font-medium">Velocidad de fase: </span>
                  <span className="font-mono">{phaseVelocity.toFixed(4)}</span>
                  <span className="text-gray-600"> m/s</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="font-medium">Energía relativa: </span>
                  <span className="font-mono">{energy.toFixed(4)}</span>
                  <span className="text-gray-600"> u.a.</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Panel de Controles */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Controles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Condiciones de frontera */}
                <div>
                  <label className="block text-sm font-medium mb-2">Condiciones de Frontera:</label>
                  <div className="flex gap-4">
                    <label className="cursor-pointer">
                      <input
                        type="radio"
                        name="boundaryCondition"
                        value="open-open"
                        checked={boundaryCondition === 'open-open'}
                        onChange={(e) => setBoundaryCondition(e.target.value)}
                      />
                      Abierta-Abierta
                    </label>
                    <label className="cursor-pointer">
                      <input
                        type="radio"
                        name="boundaryCondition"
                        value="closed-closed"
                        checked={boundaryCondition === 'closed-closed'}
                        onChange={(e) => setBoundaryCondition(e.target.value)}
                      />
                      Cerrada-Cerrada
                    </label>
                    <label className="cursor-pointer">
                      <input
                        type="radio"
                        name="boundaryCondition"
                        value="open-closed"
                        checked={boundaryCondition === 'open-closed'}
                        onChange={(e) => setBoundaryCondition(e.target.value)}
                      />
                      Abierta-Cerrada
                    </label>
                  </div>
                </div>

                {/* Parámetros de la onda */}
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="font-medium">Amplitud:</span>
                    <div className="flex gap-2">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={amplitude}
                        onChange={(e) => setAmplitude(Number(e.target.value))}
                      />
                      <span>{amplitude} unidades</span>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-medium">Longitud de onda:</span>
                    <div className="flex gap-2">
                      <input
                        type="range"
                        min="100"
                        max="500"
                        value={wavelength}
                        onChange={(e) => setWavelength(Number(e.target.value))}
                      />
                      <span>{wavelength} m</span>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-medium">Frecuencia:</span>
                    <div className="flex gap-2">
                      <input
                        type="range"
                        min="0.1"
                        max="5"
                        step="0.1"
                        value={frequency}
                        onChange={(e) => setFrequency(Number(e.target.value))}
                      />
                      <span>{frequency} Hz</span>
                    </div>
                  </div>
                </div>

                {/* Mostrar campos */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={showEField}
                      onChange={() => setShowEField(!showEField)}
                    />
                    <span>Mostrar Campo E</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={showBField}
                      onChange={() => setShowBField(!showBField)}
                    />
                    <span>Mostrar Campo B</span>
                  </div>
                </div>
              </div>

            </CardContent>
            {/* Parámetros de salida */}
            <div className="container mx-auto mt-8">
              <h1 className="text-2xl font-bold mb-4">Datos de Ondas</h1>
              {/* Componente */}
              <WaveControls />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WaveComparison;
