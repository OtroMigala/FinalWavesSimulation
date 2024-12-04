import React, { useState, useEffect } from 'react';

// Simple Card components permanecen igual...
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

const EnhancedCavity = () => {
  const [time, setTime] = useState(0);
  const [amplitude, setAmplitude] = useState(50);
  const [selectedMode, setSelectedMode] = useState(1);
  const [cavityLength, setCavityLength] = useState(800);
  const [showEField, setShowEField] = useState(true);
  const [showBField, setShowBField] = useState(true);
  const [showFieldVectors, setShowFieldVectors] = useState(true);
  
  const height = 300; // Aumentamos la altura para acomodar los vectores
  const c = 3e8;

  
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(t => (t + 0.05) % (2 * Math.PI));
    }, 50);
    return () => clearInterval(timer);
  }, []);

  // Calcula frecuencias
  const fundamentalFreq = c / (2 * cavityLength);
  const modeFreq = fundamentalFreq * selectedMode;

  // Función para generar la onda estacionaria
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

  // Función para generar vectores de campo
  const generateFieldVectors = (field, mode) => {
    const vectors = [];
    const numVectors = 20; // Más vectores para mejor visualización
    
    for(let i = 0; i < numVectors; i++) {
      const x = (i / (numVectors-1)) * cavityLength;
      const k = (mode * Math.PI) / cavityLength;
      
      // Calculamos la magnitud del campo en este punto
      const magnitude = field === 'E' ? 
        Math.sin(k * x) * Math.cos(2 * Math.PI * time) :
        Math.cos(k * x) * Math.cos(2 * Math.PI * time);
      
      const vectorLength = 20 * Math.abs(magnitude);
      const direction = magnitude > 0 ? -1 : 1;
      
      if(field === 'E') {
        // Vectores verticales para campo E
        vectors.push(
          <g key={`${field}-${i}`}>
            <line 
              x1={x} y1={height/2}
              x2={x} y2={height/2 + direction * vectorLength}
              stroke="red"
              strokeWidth="2"
              markerEnd="url(#arrowhead-red)"
            />
          </g>
        );
      } else {
        // Círculos con punto/cruz para campo B
        vectors.push(
          <g key={`${field}-${i}`}>
            <circle 
              cx={x} cy={height/2}
              r={4}
              fill="white"
              stroke="blue"
            />
            {magnitude > 0 ? 
              <circle cx={x} cy={height/2} r={2} fill="blue"/> :
              <g>
                <line 
                  x1={x-3} y1={height/2-3}
                  x2={x+3} y2={height/2+3}
                  stroke="blue"
                  strokeWidth="2"
                />
                <line 
                  x1={x-3} y1={height/2+3}
                  x2={x+3} y2={height/2-3}
                  stroke="blue"
                  strokeWidth="2"
                />
              </g>
            }
          </g>
        );
      }
    }
    return vectors;
  };

  // Función para generar nodos y antinodos
  const generateNodes = (field, mode) => {
    const nodes = [];
    for(let i = 0; i <= mode; i++) {
      const position = (i * cavityLength) / mode;
      const offset = field === 'E' ? 0 : cavityLength/(2 * mode);
      
      if (i < mode) {
        nodes.push(
          <g key={`node-${field}-${i}`}>
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

        nodes.push(
          <g key={`antinode-${field}-${i}`}>
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
          <CardTitle>Cavidad Resonante con Campos Electromagnéticos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-gray-300 rounded-lg p-2 bg-gray-50">
            <svg width={cavityLength} height={height}>
              {/* Definimos las flechas para los vectores */}
              <defs>
                <marker
                  id="arrowhead-red"
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon points="0 0, 10 3.5, 0 7" fill="red"/>
                </marker>
              </defs>

              {/* Paredes de la cavidad */}
              <line x1="0" y1="0" x2="0" y2={height} stroke="black" strokeWidth="2"/>
              <line x1={cavityLength} y1="0" x2={cavityLength} y2={height} stroke="black" strokeWidth="2"/>
              <line x1="0" y1={height/2} x2={cavityLength} y2={height/2} stroke="gray" strokeDasharray="4"/>
              
              {/* Ondas estacionarias */}
              {showEField && (
                <polyline
                  points={generateHarmonicPoints('E', selectedMode)}
                  fill="none"
                  stroke="red"
                  strokeWidth="2"
                  opacity={showFieldVectors ? 0.3 : 1}
                />
              )}
              
              {showBField && (
                <polyline
                  points={generateHarmonicPoints('B', selectedMode)}
                  fill="none"
                  stroke="blue"
                  strokeWidth="2"
                  opacity={showFieldVectors ? 0.3 : 1}
                />
              )}

              {/* Vectores de campo si están activados */}
              {showFieldVectors && (
                <>
                  {showEField && generateFieldVectors('E', selectedMode)}
                  {showBField && generateFieldVectors('B', selectedMode)}
                </>
              )}

              {/* Nodos y antinodos */}
              {showEField && generateNodes('E', selectedMode)}
              {showBField && generateNodes('B', selectedMode)}

              {/* Etiquetas de dirección */}
              <text x={cavityLength-40} y={height/2-20} fill="gray">+z (propagación)</text>
              <text x={20} y={20} fill="red">+y (campo E)</text>
              <text x={20} y={height-10} fill="blue">+x (campo B)</text>
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
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showFieldVectors}
                  onChange={(e) => setShowFieldVectors(e.target.checked)}
                  className="mr-2"
                />
                Mostrar vectores de campo
              </label>
            </div>
          </div>

          {/* Explicación */}
          <div className="mt-4 text-sm text-gray-600 space-y-2">
            <p>• Las flechas rojas verticales representan el campo eléctrico (E)</p>
            <p>• Los puntos (⋅) y cruces (×) azules representan el campo magnético (B) saliendo/entrando del plano</p>
            <p>• Los campos E y B están siempre desfasados 90° espacialmente</p>
            <p>• La longitud de los vectores indica la magnitud del campo en cada punto</p>
            <p>• Note cómo la dirección de los campos se invierte en cada nodo</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedCavity;