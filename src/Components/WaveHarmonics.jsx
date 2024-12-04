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
  
  const width = 800;
  const height = 200;
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(t => (t + 0.05) % (2 * Math.PI));
    }, 50);
    return () => clearInterval(timer);
  }, []);

  // Función para generar puntos de los armónicos
  const generateHarmonicPoints = (field, mode) => {
    return Array.from({ length: 100 }, (_, i) => {
      const x = (i / 100) * width;
      // k depende del modo (armónico)
      const k = (mode * Math.PI) / width;
      
      // El campo E usa seno para tener antinodos en el centro
      // El campo B usa coseno para tener nodos en el centro
      const position = field === 'E' ? 
        Math.sin(k * x) : 
        Math.cos(k * x);
      
      const y = height/2 + amplitude * position * Math.cos(2 * Math.PI * time);
      return `${x},${y}`;
    }).join(' ');
  };

  // Función para generar nodos y antinodos para cada modo
  const generateNodes = (field, mode) => {
    const nodes = [];
    // Para cada modo, tenemos (modo) nodos
    for(let i = 0; i <= mode; i++) {
      // Posición de los nodos: múltiplos de λ/2
      const position = (i * width) / mode;
      // Offset para campo B (desfasado 90°)
      const offset = field === 'E' ? 0 : width/(2 * mode);
      
      // Nodos
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
      
      // Antinodos
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
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Armónicos de Onda Electromagnética Estacionaria</CardTitle>
        </CardHeader>
        <CardContent>
          <svg width={width} height={height} className="bg-gray-50">
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

            {/* Nodos y Antinodos */}
            {showEField && generateNodes('E', selectedMode)}
            {showBField && generateNodes('B', selectedMode)}
          </svg>

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

          <div className="mt-4 text-sm text-gray-600 space-y-2">
            <p>• Modo 1 (Fundamental): Un antinodo central</p>
            <p>• Modo 2: Dos antinodos, un nodo central</p>
            <p>• Modo 3: Tres antinodos, dos nodos</p>
            <p>• Frecuencia de cada modo: f_n = n × f_fundamental</p>
            <p>• Observe cómo los campos E y B mantienen su desfase de 90°</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WaveHarmonics;