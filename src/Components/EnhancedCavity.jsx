import React, { useState, useEffect } from 'react';

// Card components
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
  // State
  const [time, setTime] = useState(0);
  const [amplitude, setAmplitude] = useState(50);
  const [selectedMode, setSelectedMode] = useState(1);
  const [cavityLength, setCavityLength] = useState(800);
  const [showEField, setShowEField] = useState(true);
  const [showBField, setShowBField] = useState(true);
  const [showFieldVectors, setShowFieldVectors] = useState(true);
  const [dimensions, setDimensions] = useState({
    width: Math.min(1200, window.innerWidth - 48),
    height: Math.min(600, window.innerHeight * 0.6)
  });
  const [boundaryType, setBoundaryType] = useState('closed-closed');

  const [frequencies, setFrequencies] = useState({
    fundamentalFreq: 0,
    modeFreq: 0,
    fundamentalWavelength: 0,
    modeWavelength: 0
  });


  // Physical constants
  const c = 3e8; // Speed of light in m/s
  const E_MAX = 1e-3; // Maximum E-field in V/m (1 mV/m)
  const B_MAX = E_MAX / c; // Maximum B-field in Tesla

  // Handle window resize
  useEffect(() => {
    /**
     * handleResize es una función que ajusta las dimensiones de un componente
     * en función del tamaño de la ventana del navegador.
     * 
     * La función establece las dimensiones del componente utilizando los valores
     * mínimos entre 1200 píxeles y el ancho de la ventana menos 48 píxeles para el ancho,
     * y entre 600 píxeles y el 60% de la altura de la ventana para la altura.
     * 

     */
    const handleResize = () => {
      setDimensions({
        width: Math.min(1200, window.innerWidth - 48),
        height: Math.min(600, window.innerHeight * 0.6)
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Animation timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(t => (t + 0.05) % (2 * Math.PI));
    }, 50);
    return () => clearInterval(timer);
  }, []);

  // Calculate frequencies
  const fundamentalFreq = c / (2 * cavityLength);
  const modeFreq = fundamentalFreq * selectedMode;

    // Nueva función para calcular frecuencias según tipo de frontera
    const calculateFrequencies = (mode, boundaryType, cavityLength, c) => {
      let fundamentalWavelength;
      switch(boundaryType) {
        case 'closed-closed':
        case 'open-open':
          fundamentalWavelength = 2 * cavityLength;
          break;
        case 'open-closed':
          fundamentalWavelength = 4 * cavityLength;
          break;
        default:
          fundamentalWavelength = 2 * cavityLength;
      }
      
      const fundamentalFreq = c / fundamentalWavelength;
      const modeFreq = fundamentalFreq * mode;
      const modeWavelength = fundamentalWavelength / mode;
    
      return {
        fundamentalFreq,
        modeFreq,
        fundamentalWavelength,
        modeWavelength
      };
    };

    useEffect(() => {
      const newFrequencies = calculateFrequencies(selectedMode, boundaryType, cavityLength, c);
      setFrequencies(newFrequencies);
    }, [selectedMode, boundaryType, cavityLength]);
    


    const generateBoundaryWalls = () => (
        <g>
          {/* Pared izquierda */}
          <line 
            x1="0" y1="0" x2="0" y2={dimensions.height}
            stroke={boundaryType.startsWith('closed') ? "black" : "gray"}
            strokeWidth={boundaryType.startsWith('closed') ? "4" : "2"}
            strokeDasharray={boundaryType.startsWith('open') ? "5,5" : "none"}
          />
          {boundaryType.startsWith('closed') && (
            <g>
              <text x="10" y={dimensions.height-30} fill="gray" className="text-sm">
                E ⊥ pared
              </text>
              <text x="10" y={dimensions.height-15} fill="gray" className="text-sm">
                B ∥ pared
              </text>
            </g>
          )}
          
          {/* Pared derecha */}
          <line 
            x1={cavityLength} y1="0" x2={cavityLength} y2={dimensions.height}
            stroke={boundaryType.endsWith('closed') ? "black" : "gray"}
            strokeWidth={boundaryType.endsWith('closed') ? "4" : "2"}
            strokeDasharray={boundaryType.endsWith('open') ? "5,5" : "none"}
          />
          {boundaryType.endsWith('closed') && (
            <g>
              <text x={cavityLength-60} y={dimensions.height-30} fill="gray" className="text-sm">
                E ⊥ pared
              </text>
              <text x={cavityLength-60} y={dimensions.height-15} fill="gray" className="text-sm">
                B ∥ pared
              </text>
            </g>
          )}
        </g>
      );

  // Generate harmonic points
  // Función modificada para generar armónicos según tipo de frontera
  const generateHarmonicPoints = (field, mode) => {
    const points = [];
    const numPoints = 200;
    const maxField = field === 'E' ? E_MAX : B_MAX;
    const visualScale = field === 'E' ? 1e5 : 1e8;
  
    for (let i = 0; i <= numPoints; i++) {
      // Asegurar que x está dentro de la cavidad
      const x = Math.min((i / numPoints) * cavityLength, cavityLength);
      
      // Calcular k usando cavityLength en lugar de dimensions.width
      const k = (mode * Math.PI) / cavityLength;
      
      let spatialComponent;
      switch(boundaryType) {
        case 'closed-closed':
            spatialComponent = field === 'E' ? 
                // Force nodes at boundaries for E field
                (x === 0 || x === cavityLength) ? 0 : Math.sin(k * x) :
                // B field has antinodes at boundaries
                Math.cos(k * x);
            break;
            
        case 'open-open':
            spatialComponent = field === 'E' ? 
                // E field has antinodes at boundaries
                Math.cos(k * x) :
                // B field has nodes at boundaries
                (x === 0 || x === cavityLength) ? 0 : Math.sin(k * x);
            break;
            
        case 'open-closed':
            // At x = 0 (open): E has antinode (cos), B has node (sin = 0)
            // At x = L (closed): E has node (cos = 0), B has antinode (sin)
            spatialComponent = field === 'E' ? 
                (x === cavityLength) ? 0 : Math.cos(k * x) :
                (x === 0) ? 0 : Math.sin(k * x);
            break;
    
        default:
            // Handle unexpected boundary types
            spatialComponent = 0;
            console.warn(`Unexpected boundary type: ${boundaryType}`);
            break;
      }
      
      const temporalComponent = Math.cos(2 * Math.PI * time);
      const y = dimensions.height/2 + (amplitude * maxField * visualScale) 
               * spatialComponent * temporalComponent;
      
      points.push(`${x},${y}`);
    }
    
    // Asegurar que el último punto está exactamente en el borde de la cavidad
    if (!points.length || !points[points.length - 1].startsWith(`${cavityLength},`)) {
      const lastX = cavityLength;
      const k = (mode * Math.PI) / cavityLength;
      let lastSpatialComponent;
      
      switch(boundaryType) {
        case 'closed-closed':
          lastSpatialComponent = field === 'E' ? 0 : Math.cos(k * lastX);
          break;
        case 'open-open':
          lastSpatialComponent = field === 'E' ? Math.cos(k * lastX) : 0;
          break;
        case 'open-closed':
          lastSpatialComponent = field === 'E' ? 0 : Math.sin(k * lastX);
          break;
        default:
          lastSpatialComponent = 0;
          console.warn(`Unexpected boundary type: ${boundaryType}`);
      }
      
      const temporalComponent = Math.cos(2 * Math.PI * time);
      const y = dimensions.height/2 + (amplitude * maxField * visualScale) 
               * lastSpatialComponent * temporalComponent;
      
      points.push(`${lastX},${y}`);
    }
    
    return points.join(' ');
};

  // Generate field vectors
  const generateFieldVectors = (field, mode) => {
    const vectors = [];
    const numVectors = 20;
    
    for(let i = 0; i < numVectors; i++) {
      const x = (i / (numVectors-1)) * cavityLength;
      const k = (mode * Math.PI) / cavityLength;
      
      const maxField = field === 'E' ? E_MAX : B_MAX;
      const magnitude = field === 'E' ? 
        Math.sin(k * x) * Math.cos(2 * Math.PI * time) :
        Math.cos(k * x) * Math.cos(2 * Math.PI * time);

      const visualScale = field === 'E' ? 1e5 : 1e8;
      const vectorLength = 20 * Math.abs(magnitude) * maxField * visualScale;
      const direction = magnitude > 0 ? -1 : 1;
      
      if(field === 'E') {
        vectors.push(
          <g key={`${field}-${i}`}>
            <line 
              x1={x} y1={dimensions.height/2}
              x2={x} y2={dimensions.height/2 + direction * vectorLength}
              stroke="red"
              strokeWidth="2"
              markerEnd="url(#arrowhead-red)"
            />
          </g>
        );
      } else {
        vectors.push(
          <g key={`${field}-${i}`}>
            <circle 
              cx={x} cy={dimensions.height/2}
              r={4}
              fill="white"
              stroke="blue"
            />
            {magnitude > 0 ? 
              <circle cx={x} cy={dimensions.height/2} r={2} fill="blue"/> :
              <g>
                <line 
                  x1={x-3} y1={dimensions.height/2-3}
                  x2={x+3} y2={dimensions.height/2+3}
                  stroke="blue"
                  strokeWidth="2"
                />
                <line 
                  x1={x-3} y1={dimensions.height/2+3}
                  x2={x+3} y2={dimensions.height/2-3}
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

  // Generate nodes and antinodes
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
              cy={dimensions.height/2} 
              r="4" 
              fill={field === 'E' ? "red" : "blue"} 
              opacity="0.7"
            />
            <line
              x1={position + offset}
              y1={dimensions.height/2 + 10}
              x2={position + offset}
              y2={dimensions.height/2 - 10}
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
              cy={dimensions.height/2} 
              r="4" 
              fill={field === 'E' ? "red" : "blue"}
              stroke="white"
              strokeWidth="2" 
              opacity="0.7"
            />
            <line
              x1={position + (field === 'E' ? cavityLength/(2 * mode) : 0)}
              y1={dimensions.height/2 + 15}
              x2={position + (field === 'E' ? cavityLength/(2 * mode) : 0)}
              y2={dimensions.height/2 - 15}
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

  const generateGrid = () => (
    <g className="grid opacity-20">
        {/* Líneas verticales - aumentamos de 10 a 20 divisiones */}
        {Array.from({length: 20}, (_, i) => (
            <line 
                key={`v-${i}`}
                x1={cavityLength * i/20} 
                y1="0" 
                x2={cavityLength * i/20} 
                y2={dimensions.height}
                stroke="gray" 
                strokeDasharray="1,1"  // Reducimos el patrón de guiones
                strokeWidth="0.5"      // Líneas más finas
            />
        ))}
        {/* Líneas horizontales - aumentamos de 6 a 12 divisiones */}
        {Array.from({length: 12}, (_, i) => (
            <line 
                key={`h-${i}`}
                x1="0" 
                y1={dimensions.height * i/12} 
                x2={cavityLength} 
                y2={dimensions.height * i/12}
                stroke="gray" 
                strokeDasharray="1,1"  // Reducimos el patrón de guiones
                strokeWidth="0.5"      // Líneas más finas
            />
        ))}
    </g>
);




return (
    <div className="w-full max-w-[1200px] mx-auto p-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Cavidad Resonante con Campos Electromagnéticos</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <div className="w-full overflow-x-auto">
            <svg 
              width={dimensions.width} 
              height={dimensions.height}
              className="bg-gray-50 mx-auto"
              viewBox={`0 0 ${cavityLength} ${dimensions.height}`}
              preserveAspectRatio="xMidYMid meet"
            >
            <clipPath id="cavity-area">
              <rect x="0" y="0" width={cavityLength} height={dimensions.height} />
            </clipPath>
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

              {/* Paredes según tipo de frontera */}
              {generateBoundaryWalls()}

              {/* Grid */}
              {generateGrid()}

              {/* Eje central */}
              <line 
                x1="0" 
                y1={dimensions.height/2} 
                x2={cavityLength} 
                y2={dimensions.height/2} 
                stroke="gray" 
                strokeDasharray="4"
              />
              
              {/* Ondas Estacionarias */}
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

              {/* Vectores de Campo */}
              {showFieldVectors && (
                <>
                  {showEField && generateFieldVectors('E', selectedMode)}
                  {showBField && generateFieldVectors('B', selectedMode)}
                </>
              )}

              {/* Nodos y Antinodos */}
              {showEField && generateNodes('E', selectedMode)}
              {showBField && generateNodes('B', selectedMode)}

              {/* Etiquetas de Dirección */}
              <text x={cavityLength-40} y={dimensions.height/2-20} fill="gray">+z (propagación)</text>
              <text x={20} y={20} fill="red">+y (campo E)</text>
              <text x={20} y={dimensions.height-10} fill="blue">+x (campo B)</text>
            </svg>
          </div>

          <div className="w-full max-w-3xl space-y-4 mt-6">
            {/* Selector de Tipo de Frontera */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Tipo de Frontera
              </label>
              <select 
                value={boundaryType}
                onChange={(e) => setBoundaryType(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="closed-closed">Cerrado-Cerrado</option>
                <option value="open-open">Abierto-Abierto</option>
                <option value="open-closed">Abierto-Cerrado</option>
              </select>
            </div>

            {/* Frecuencias de Resonancia */}
            <div className="p-4 bg-gray-100 rounded-lg">
              <h3 className="font-semibold mb-2">Frecuencias de Resonancia:</h3>
                <div className="space-y-2">
                  <p>• Frecuencia fundamental (f₁): {(frequencies.fundamentalFreq/1e6).toFixed(2)} MHz</p>
                  <p>• Frecuencia del modo actual (f_{selectedMode}): {(frequencies.modeFreq/1e6).toFixed(2)} MHz</p>
                  <p>• Longitud de onda fundamental (λ₁): {frequencies.fundamentalWavelength.toFixed(2)} unidades</p>
                  <p>• Longitud de onda del modo actual (λ_{selectedMode}): {frequencies.modeWavelength.toFixed(2)} unidades</p>
                </div>
           </div>  

            {/* Magnitudes de Campo */}
            <div className="p-4 bg-gray-100 rounded-lg">
              <h3 className="font-semibold mb-2">Magnitudes de Campo:</h3>
              <div className="space-y-2">
                <p>• Campo E máximo: {(E_MAX * 1e3).toFixed(2)} mV/m</p>
                <p>• Campo B máximo: {(B_MAX * 1e9).toFixed(2)} nT</p>
                <p>• Relación E/B = c = {c.toExponential(2)} m/s</p>
              </div>
            </div>

            {/* Controles */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Modo (Armónico): {selectedMode}
                </label>
                <input
                  type="range"
                  value={selectedMode}
                  onChange={(e) => setSelectedMode(Number(e.target.value))}
                  min="1"
                  max="10"
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
                  Amplitud: {amplitude}% de {(E_MAX * 1e3).toFixed(2)} mV/m
                </label>
                <input
                  type="range"
                  value={amplitude}
                  onChange={(e) => setAmplitude(Number(e.target.value))}
                  min="1"
                  max="100"
                  step="1"
                  className="w-full"
                />
              </div>

              <div className="flex flex-wrap gap-4">
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

            {/* Condiciones de Frontera */}
            <div className="p-4 bg-gray-100 rounded-lg">
              <h3 className="font-semibold mb-2">Condiciones de Contorno:</h3>
              <div className="space-y-2">
                <p>• Extremo Cerrado (Conductor):</p>
                <p className="ml-4">- Campo E perpendicular (nodo)</p>
                <p className="ml-4">- Campo B paralelo (antinodo)</p>
                <p>• Extremo Abierto:</p>
                <p className="ml-4">- Campo E paralelo (antinodo)</p>
                <p className="ml-4">- Campo B perpendicular (nodo)</p>
              </div>
            </div>

            {/* Información de Fase */}
            <div className="p-4 bg-gray-100 rounded-lg">
              <h3 className="font-semibold mb-2">Relación de Fase:</h3>
              <div className="space-y-2">
                <p>• Los campos E y B:</p>
                <p className="ml-4">- Oscilan en fase temporal</p>
                <p className="ml-4">- Mantienen desfase espacial de 90°</p>
              </div>
            </div>

            {/* Explicación */}
            <div className="text-sm text-gray-600 space-y-2">
              <p>• Las flechas rojas verticales representan el campo eléctrico (E)</p>
              <p>• Los puntos (⋅) y cruces (×) azules representan el campo magnético (B) saliendo/entrando del plano</p>
              <p>• Los campos E y B están siempre desfasados 90° espacialmente</p>
              <p>• La longitud de los vectores indica la magnitud del campo en cada punto</p>
              <p>• Note cómo la dirección de los campos se invierte en cada nodo</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedCavity;