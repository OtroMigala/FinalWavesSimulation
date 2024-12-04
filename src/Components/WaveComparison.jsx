import React, { useState, useEffect } from 'react';

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-md ${className}`}>{children}</div>
);

const CardHeader = ({ children }) => (
  <div className="p-4 border-b">{children}</div>
);

const CardTitle = ({ children }) => (
  <h2 className="text-xl font-semibold">{children}</h2>
);

const CardContent = ({ children }) => (
  <div className="p-4">{children}</div>
);


const WaveComparison = () => {
  
  const [time, setTime] = useState(0);
  const [amplitude, setAmplitude] = useState(50);
  const [wavelength, setWavelength] = useState(200);
  const [frequency, setFrequency] = useState(1);
  const [showEField, setShowEField] = useState(true);
  const [showBField, setShowBField] = useState(true);
  const [observationPoint, setObservationPoint] = useState(300);
  
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
      const y = height/2 + amplitude * position * Math.cos(omega * time);
      return `${x},${y}`;
    }).join(' ');
  };

  // Función para generar puntos de onda viajera
  const generateTravelingWavePoints = (field) => {
    return Array.from({ length: 100 }, (_, i) => {
      const x = (i / 100) * width;
      const phase = field === 'E' ? 0 : Math.PI/2;
      const y = height/2 + amplitude * Math.sin(k * x - omega * time + phase);
      return `${x},${y}`;
    }).join(' ');
  };

  // Historial de oscilación del punto de observación
  const timeHistory = Array.from({ length: 50 }, (_, i) => {
    const pastTime = time - (i * 0.1);
    const x = width - (i * 5);
    const y = graphHeight/2 + amplitude/2 * Math.sin(k * observationPoint - omega * pastTime);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="container mx-auto flex flex-col items-center">
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
                    <line x1="0" y1={height/2} x2={width} y2={height/2} stroke="gray" strokeDasharray="4"/>
                    {showEField && (
                      <polyline points={generateStandingWavePoints('E')} fill="none" stroke="red" strokeWidth="2"/>
                    )}
                    {showBField && (
                      <polyline points={generateStandingWavePoints('B')} fill="none" stroke="blue" strokeWidth="2"/>
                    )}
                  </svg>
                </div>
              </div>
  
              {/* Onda Viajera */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Onda Viajera</h3>
                <div className="border-2 border-gray-200 rounded-lg p-3 bg-white">
                  <svg width={width} height={height} className="w-full">
                    <line x1="0" y1={height/2} x2={width} y2={height/2} stroke="gray" strokeDasharray="4"/>
                    {showEField && (
                      <polyline points={generateTravelingWavePoints('E')} fill="none" stroke="red" strokeWidth="2"/>
                    )}
                    {showBField && (
                      <polyline points={generateTravelingWavePoints('B')} fill="none" stroke="blue" strokeWidth="2"/>
                    )}
                  </svg>
                </div>
              </div>
  
              {/* Historial Temporal */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Historial Temporal</h3>
                <div className="border-2 border-gray-200 rounded-lg p-3 bg-white">
                  <svg width={width} height={graphHeight} className="w-full">
                    <line x1="0" y1={graphHeight/2} x2={width} y2={graphHeight/2} stroke="gray" strokeDasharray="4"/>
                    <polyline points={timeHistory} fill="none" stroke="purple" strokeWidth="2"/>
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
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Amplitud: {amplitude} unidades
                  </label>
                  <input
                    type="range"
                    value={amplitude}
                    onChange={(e) => setAmplitude(Number(e.target.value))}
                    min="10"
                    max="100"
                    className="w-full"
                  />
                </div>
  
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Longitud de onda: {wavelength} unidades
                  </label>
                  <input
                    type="range"
                    value={wavelength}
                    onChange={(e) => setWavelength(Number(e.target.value))}
                    min="100"
                    max="400"
                    className="w-full"
                  />
                </div>
  
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Frecuencia: {frequency} Hz
                  </label>
                  <input
                    type="range"
                    value={frequency}
                    onChange={(e) => setFrequency(Number(e.target.value))}
                    min="0.5"
                    max="2"
                    step="0.1"
                    className="w-full"
                  />
                </div>
  
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Punto de observación: {observationPoint}
                  </label>
                  <input
                    type="range"
                    value={observationPoint}
                    onChange={(e) => setObservationPoint(Number(e.target.value))}
                    min="0"
                    max={width}
                    className="w-full"
                  />
                </div>
  
                <div className="flex justify-center gap-6 pt-2">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={showEField}
                      onChange={(e) => setShowEField(e.target.checked)}
                      className="mr-2"
                    />
                    Campo E
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={showBField}
                      onChange={(e) => setShowBField(e.target.checked)}
                      className="mr-2"
                    />
                    Campo B
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
  
          {/* Panel de Información */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Información</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Los campos E y B mantienen un desfase de 90°</p>
                <p>• La energía de la onda es proporcional a A²ω²</p>
                <p>• La velocidad de fase viene dada por v = λf</p>
                <p>• Número de onda: k = 2π/λ</p>
                <p>• Frecuencia angular: ω = 2πf</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

};

export default WaveComparison;