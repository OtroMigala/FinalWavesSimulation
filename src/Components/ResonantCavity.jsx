import React, { useState, useEffect } from 'react';

// Simple Card components
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

const ResonantCavity = () => {
  const [time, setTime] = useState(0);
  const [amplitude, setAmplitude] = useState(50);
  const [selectedMode, setSelectedMode] = useState(1);
  const [cavityLength, setCavityLength] = useState(800); // Longitud de la cavidad en unidades
  const [showEField, setShowEField] = useState(true);
  const [showBField, setShowBField] = useState(true);
  
  const height = 200;
  const c = 3e8; // Velocidad de la luz en m/s
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(t => (t + 0.05) % (2 * Math.PI));
    }, 50);
    return () => clearInterval(timer);
  }, []);

  // Calcula la frecuencia fundamental y la frecuencia del modo actual
  const fundamentalFreq = c / (2 * cavityLength);
  const modeFreq = fundamentalFreq * selectedMode;

  const generateHarmonicPoints = (field, mode) => {
    return Array.from({ length: 100 }, (_, i) => {
      const x = (i / 100) * cavityLength;
      const k = (mode * Math.PI) / cavityLength;
      
      const position = field === 'E' ? 
        Math.sin(k * x) : 
        Math.cos(k * x);
      
      const y = height/2 + amplitude * position * Math.cos(2 * Math.PI * time);
      return `${x},${y}`;
    }).join(' ');
  };

  const generateNodes = (field, mode) => {
    const nodes = [];
    for(let i = 0; i <= mode; i++) {
      const position = (i * cavityLength) / mode;
      const offset = field === 'E' ? 0 : cavityLength/(2 * mode);
      
      // Nodos
      if (i < mode) {
        nodes.push(
          <g key={`node-${i}`}>
            <circle 
              cx={position + offset} 
              cy={height/2} 
              r="4" 
              fill={field === 'E' ? "red" : "blue"} 
              opacity="0.7"
            />
            <line
              x1={position + offset}
              y1={height/2 + 10}
              x2={position + offset}
              y2={height/2 - 10}
              stroke={field === 'E' ? "red" : "blue"}
              strokeDasharray="2"
              opacity="0.5"
            />
          </g>
        );
      }
      
      // Antinodos
      if (i < mode) {
        nodes.push(
          <g key={`antinode-${i}`}>
            <circle 
              cx={position + (field === 'E' ? cavityLength/(2 * mode) : 0)} 
              cy={height/2} 
              r="4" 
              fill={field === 'E' ? "red" : "blue"}
              stroke="white"
              strokeWidth="2" 
              opacity="0.7"
            />
            <line
              x1={position + (field === 'E' ? cavityLength/(2 * mode) : 0)}
              y1={height/2 + 15}
              x2={position + (field === 'E' ? cavityLength/(2 * mode) : 0)}
              y2={height/2 - 15}
              stroke={field === 'E' ? "red" : "blue"}
              strokeDasharray="4"
              opacity="0.5"
            />
          </g>
        );
      }
    }
    return nodes;
  };

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Frecuencias de Resonancia en Cavidad</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Cavidad y ondas */}
          <div className="border-2 border-gray-300 rounded-lg p-2 bg-gray-50">
            <svg width={cavityLength} height={height}>
              {/* Paredes de la cavidad */}
              <line x1="0" y1="0" x2="0" y2={height} stroke="black" strokeWidth="2"/>
              <line x1={cavityLength} y1="0" x2={cavityLength} y2={height} stroke="black" strokeWidth="2"/>
              <line x1="0" y1={height/2} x2={cavityLength} y2={height/2} stroke="gray" strokeDasharray="4"/>
              
              {showEField && (
                <polyline
                  points={generateHarmonicPoints('E', selectedMode)}
                  fill="none"
                  stroke="red"
                  strokeWidth="2"
                />
              )}
              
              {showBField && (
                <polyline
                  points={generateHarmonicPoints('B', selectedMode)}
                  fill="none"
                  stroke="blue"
                  strokeWidth="2"
                />
              )}

              {showEField && generateNodes('E', selectedMode)}
              {showBField && generateNodes('B', selectedMode)}
            </svg>
          </div>

          {/* Información de frecuencias */}
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <h3 className="font-semibold mb-2">Frecuencias de Resonancia:</h3>
            <div className="space-y-2">
              <p>• Frecuencia fundamental (f₁): {(fundamentalFreq/1e6).toFixed(2)} MHz</p>
              <p>• Frecuencia del modo actual (f_{selectedMode}): {(modeFreq/1e6).toFixed(2)} MHz</p>
              <p>• Longitud de onda fundamental (λ₁): {(2 * cavityLength).toFixed(2)} unidades</p>
              <p>• Longitud de onda del modo actual (λ_{selectedMode}): {(2 * cavityLength/selectedMode).toFixed(2)} unidades</p>
            </div>
          </div>

          {/* Controles */}
          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Modo (Armónico): {selectedMode}
              </label>
              <input
                type="range"
                value={selectedMode}
                onChange={(e) => setSelectedMode(Number(e.target.value))}
                min="1"
                max="5"
                step="1"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Longitud de la cavidad: {cavityLength} unidades
              </label>
              <input
                type="range"
                value={cavityLength}
                onChange={(e) => setCavityLength(Number(e.target.value))}
                min="400"
                max="1200"
                step="100"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
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

            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showEField}
                  onChange={(e) => setShowEField(e.target.checked)}
                  className="mr-2"
                />
                Mostrar campo E
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showBField}
                  onChange={(e) => setShowBField(e.target.checked)}
                  className="mr-2"
                />
                Mostrar campo B
              </label>
            </div>
          </div>

          {/* Explicación */}
          <div className="mt-4 text-sm text-gray-600 space-y-2">
            <p>• Las líneas punteadas verticales representan los nodos (puntos de amplitud cero) y antinodos (puntos de máxima amplitud)</p>
            <p>• Observe cómo la frecuencia aumenta con el número de modo: f_n = n × f_fundamental</p>
            <p>• Note que la longitud de onda disminuye al aumentar el modo: λ_n = λ_fundamental/n</p>
            <p>• La longitud de la cavidad determina qué frecuencias pueden resonar en ella</p>
            <p>• Los campos E y B mantienen su desfase de 90° en todos los modos</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResonantCavity;