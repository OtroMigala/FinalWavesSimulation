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

const WaveHarmonics = () => {
  const [time, setTime] = useState(0);
  const [amplitude, setAmplitude] = useState(50);
  const [selectedMode, setSelectedMode] = useState(1);
  const [showEField, setShowEField] = useState(true);
  const [showBField, setShowBField] = useState(true);
  
  const width = 600; // Reducido para ajustarse mejor al layout
  const height = 300; // Aumentado para mejor visualización
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(t => (t + 0.05) % (2 * Math.PI));
    }, 50);
    return () => clearInterval(timer);
  }, []);

  const generateHarmonicPoints = (field, mode) => {
    return Array.from({ length: 100 }, (_, i) => {
      const x = (i / 100) * width;
      const k = (mode * Math.PI) / width;
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
      const position = (i * width) / mode;
      const offset = field === 'E' ? 0 : width/(2 * mode);
      
      if (i < mode) {
        nodes.push(
          <circle 
            key={`node-${i}`}
            cx={position + offset} 
            cy={height/2} 
            r="4" 
            fill={field === 'E' ? "red" : "blue"} 
            opacity="0.7"
          />
        );
      }
      
      if (i < mode) {
        nodes.push(
          <circle 
            key={`antinode-${i}`}
            cx={position + (field === 'E' ? width/(2 * mode) : 0)} 
            cy={height/2} 
            r="4" 
            fill={field === 'E' ? "red" : "blue"}
            stroke="white"
            strokeWidth="2" 
            opacity="0.7"
          />
        );
      }
    }
    return nodes;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Panel Izquierdo - Visualización */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Visualización de Armónicos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <svg width={width} height={height} className="bg-gray-50 rounded-lg">
              <line 
                x1="0" y1={height/2} 
                x2={width} y2={height/2} 
                stroke="gray" 
                strokeDasharray="4"
              />
              
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
        </CardContent>
      </Card>

      {/* Panel Derecho - Controles e Información */}
      <div className="lg:col-span-1 space-y-6">
        {/* Controles */}
        <Card>
          <CardHeader>
            <CardTitle>Controles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
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

            <div className="space-y-2">
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
          </CardContent>
        </Card>

        {/* Información */}
        <Card>
          <CardHeader>
            <CardTitle>Información</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• Modo 1 (Fundamental): Un antinodo central</p>
              <p>• Modo 2: Dos antinodos, un nodo central</p>
              <p>• Modo 3: Tres antinodos, dos nodos</p>
              <p>• Frecuencia de cada modo: f_n = n × f_fundamental</p>
              <p>• Los campos E y B mantienen su desfase de 90°</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WaveHarmonics;