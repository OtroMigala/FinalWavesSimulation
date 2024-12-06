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
  const [amplitude, setAmplitude] = useState(1e-3); // V/m inicial
  const [selectedMode, setSelectedMode] = useState(1);
  const [cavityLength, setCavityLength] = useState(800);
  const [showEField, setShowEField] = useState(true);
  const [showBField, setShowBField] = useState(true);
  const [eMaxField, setEMaxField] = useState(1e-3); // V/m
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
  const EPSILON_0 = 8.854e-12; // F/m
  const MU_0 = 4 * Math.PI * 1e-7; // H/m

    // Calculate frequencies
  const fundamentalFreq = c / (2 * cavityLength);
  const modeFreq = fundamentalFreq * selectedMode;

  const bMaxField = eMaxField / c; // Tesla


  const energyDensityE = 0.5 * EPSILON_0 * eMaxField * eMaxField;
  const energyDensityB = 0.5 * (bMaxField * bMaxField) / MU_0;
  const totalEnergyDensity = energyDensityE + energyDensityB;

  // Función para formatear valores científicos
  const formatScientific = (value, unit) => {
      if (value === 0) return "0 " + unit;
      const exponent = Math.floor(Math.log10(Math.abs(value)));
      const mantissa = value / Math.pow(10, exponent);
      return `${mantissa.toFixed(2)}×10^${exponent} ${unit}`;
  };



  // Handle window resize
  //establece las dimensiones del componente
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

  /**Documentacion
 * Hook de efecto que configura un temporizador para actualizar el estado del tiempo 
 * en intervalos regulares.
 * 
 * Este efecto se ejecuta una vez al montar el componente y establece un temporizador 
 * que incrementa el estado
 * del tiempo (`time`) en 0.05 segundos cada 50 milisegundos. El valor del tiempo se
 *  reinicia a 0 después de 
 * completar un ciclo de 2π.
 * 
 * El temporizador se limpia automáticamente cuando el componente se desmonta para evitar
 * fugas de memoria.
 */
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(t => (t + 0.05) % (2 * Math.PI));
    }, 50);
    return () => clearInterval(timer);
  }, []);

  //función para calcular frecuencias según tipo de frontera
  const calculateFrequencies = (mode, boundaryType, cavityLength, c) => {
      let fundamentalWavelength;
      switch(boundaryType) {
        case 'closed-closed':
        case 'open-open':
          /**
           * Cuando la cavidad tiene extremos 
           * C-C o A-A, la longitud de onda fundamental es 2L
           * esto se debe a que en estos casos, se necesita
           * formar media onda estacionaria L/2 en la cavidad.
           *  
           * Permite que se cumplan las condiciones de 
           * frontera en ambos extremos (nodos o antinodos)
           * */ 
          fundamentalWavelength = 2 * cavityLength;
          break;
        case 'open-closed':
          /**
           * La longitud de onda fundamental debe ser cuatro veces
           *  la longitud de la cavidad
           * Esto forma un cuarto de onda (λ/4) dentro de la cavidad
           * Necesario para satisfacer condiciones diferentes en cada extremo:
           * Extremo abierto: requiere antinode (máximo)
           * Extremo cerrado: requiere node (cero)
           * Ejemplo: Si L = 1m, entonces λ₁ = 4m, formando un cuarto de onda
           * 
           * */ 
          fundamentalWavelength = 4 * cavityLength;
          break;
        default:
          //Caso inesperado, para no forzar un error
          //damos por sentado un modo A-A o C-C
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

  //Documentacion
  /**
   * Hook de efecto que recalcula las frecuencias resonantes cuando cambian los parámetros de la cavidad
   * @param {number} selectedMode - Número de modo armónico actual
   * @param {string} boundaryType - Tipo de condiciones de frontera (abierta/cerrada)
   * @param {number} cavityLength - Longitud de la cavidad
   * @param {number} c - Velocidad de la luz
   * 
   * Este efecto se dispara cuando:
   * - Cambia el modo seleccionado
   * - Cambia el tipo de frontera
   * - Cambia la longitud de la cavidad
   * 
   * Calcula las nuevas frecuencias resonantes basadas en estos parámetros
   * y actualiza el estado de frecuencias usando setFrequencies
   */
  useEffect(() => {
    const newFrequencies = calculateFrequencies(selectedMode, boundaryType, cavityLength, c);
    setFrequencies(newFrequencies);
  }, [selectedMode, boundaryType, cavityLength]);
      

  /**
   * 
   * @returns {JSX.Element} - Un componente SVG que representa las paredes de la cavidad resonante.
   */
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
// Función mejorada
const generateHarmonicPoints = (field, mode) => {
  const points = [];
  const numPoints = 200;
  const maxField = field === 'E' ? eMaxField : bMaxField;
  const visualScale = field === 'E' ? 1e7 : 1e10;
  
  // Tolerancia para puntos extremos
  const epsilon = 1e-10;

  for (let i = 0; i <= numPoints; i++) {
      const x = Math.min((i / numPoints) * cavityLength, cavityLength);
      const k = (mode * Math.PI) / cavityLength;
      
      let spatialComponent;
      switch(boundaryType) {
          case 'closed-closed':
              if (field === 'E') {
                  // Campo E debe tener nodos en ambos extremos
                  spatialComponent = (x < epsilon || Math.abs(x - cavityLength) < epsilon) 
                      ? 0  // Nodos forzados en los extremos
                      : Math.sin(k * x);
              } else {
                  // Campo B debe tener antinodos en ambos extremos
                  spatialComponent = Math.abs(x) < epsilon || Math.abs(x - cavityLength) < epsilon
                      ? 1  // Antinodos forzados en los extremos
                      : Math.cos(k * x);
              }
              break;
              
          case 'open-open':
              if (field === 'E') {
                  // Campo E debe tener antinodos en ambos extremos
                  spatialComponent = Math.abs(x) < epsilon || Math.abs(x - cavityLength) < epsilon
                      ? 1  // Antinodos forzados en los extremos
                      : Math.cos(k * x);
              } else {
                  // Campo B debe tener nodos en ambos extremos
                  spatialComponent = (x < epsilon || Math.abs(x - cavityLength) < epsilon)
                      ? 0  // Nodos forzados en los extremos
                      : Math.sin(k * x);
              }
              break;
              
          case 'open-closed':
              if (field === 'E') {
                  // Campo E: antinodo en extremo abierto (x=0), nodo en extremo cerrado (x=L)
                  if (x < epsilon) {
                      spatialComponent = 1;  // Antinodo en extremo abierto
                  } else if (Math.abs(x - cavityLength) < epsilon) {
                      spatialComponent = 0;  // Nodo en extremo cerrado
                  } else {
                      spatialComponent = Math.cos(k * x);
                  }
              } else {
                  // Campo B: nodo en extremo abierto (x=0), antinodo en extremo cerrado (x=L)
                  if (x < epsilon) {
                      spatialComponent = 0;  // Nodo en extremo abierto
                  } else if (Math.abs(x - cavityLength) < epsilon) {
                      spatialComponent = 1;  // Antinodo en extremo cerrado
                  } else {
                      spatialComponent = Math.sin(k * x);
                  }
              }
              break;
  
          default:
              // Caso por defecto o inesperado
              spatialComponent = 0;
              console.warn(`Unexpected boundary type: ${boundaryType}`);
              break;
      }
      
      const temporalComponent = Math.cos(2 * Math.PI * time);
      const y = dimensions.height/2 + maxField * visualScale * 
               spatialComponent * temporalComponent;
      
      points.push(`${x},${y}`);
  }
  
  if (!points.length || !points[points.length - 1].startsWith(`${cavityLength},`)) {
      const lastX = cavityLength;
      let lastSpatialComponent;
      
      switch(boundaryType) {
          case 'closed-closed':
              lastSpatialComponent = field === 'E' ? 0 : 1;
              break;
          case 'open-open':
              lastSpatialComponent = field === 'E' ? 1 : 0;
              break;
          case 'open-closed':
              lastSpatialComponent = field === 'E' ? 0 : 1;
              break;
          default:
              lastSpatialComponent = 0;
      }
      
      const temporalComponent = Math.cos(2 * Math.PI * time);
      const y = dimensions.height/2 + maxField * visualScale * 
               lastSpatialComponent * temporalComponent;
      
      points.push(`${lastX},${y}`);
  }
  
  return points.join(' ');
};
  // Generate field vectors, vectores de campo electrico
  const generateFieldVectors = (field, mode) => {
    const vectors = [];
    const numVectors = 20;
    const epsilon = 1e-10;
    
    for(let i = 0; i < numVectors; i++) {
        const x = (i / (numVectors-1)) * cavityLength;
        const k = (mode * Math.PI) / cavityLength;
        const maxField = field === 'E' ? eMaxField : bMaxField;
        
        let magnitude;
        switch(boundaryType) {
            case 'closed-closed':
                if (field === 'E') {
                    // Campo E: nodos en ambos extremos
                    magnitude = (x < epsilon || Math.abs(x - cavityLength) < epsilon) 
                        ? 0 
                        : Math.sin(k * x);
                } else {
                    // Campo B: antinodos en ambos extremos
                    magnitude = Math.abs(x) < epsilon || Math.abs(x - cavityLength) < epsilon
                        ? 1
                        : Math.cos(k * x);
                }
                break;
                
            case 'open-open':
                if (field === 'E') {
                    // Campo E: antinodos en ambos extremos
                    magnitude = Math.abs(x) < epsilon || Math.abs(x - cavityLength) < epsilon
                        ? 1
                        : Math.cos(k * x);
                } else {
                    // Campo B: nodos en ambos extremos
                    magnitude = (x < epsilon || Math.abs(x - cavityLength) < epsilon)
                        ? 0
                        : Math.sin(k * x);
                }
                break;
                
            case 'open-closed':
                if (field === 'E') {
                    // Campo E: antinodo en abierto, nodo en cerrado
                    if (x < epsilon) {
                        magnitude = 1; // Antinodo en extremo abierto
                    } else if (Math.abs(x - cavityLength) < epsilon) {
                        magnitude = 0; // Nodo en extremo cerrado
                    } else {
                        magnitude = Math.cos(k * x);
                    }
                } else {
                    // Campo B: nodo en abierto, antinodo en cerrado
                    if (x < epsilon) {
                        magnitude = 0; // Nodo en extremo abierto
                    } else if (Math.abs(x - cavityLength) < epsilon) {
                        magnitude = 1; // Antinodo en extremo cerrado
                    } else {
                        magnitude = Math.sin(k * x);
                    }
                }
                break;
                
            default:
                magnitude = 0;
                break;
        }

        magnitude *= Math.cos(2 * Math.PI * time);
        const visualScale = field === 'E' ? 1e7 : 1e10;
        const vectorLength = 50 * Math.abs(magnitude) * maxField * visualScale;
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

  // Generate nodes and antinodes for field
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
/**
 * 
 * @returns {JSX.Element} - Un componente SVG que representa una cuadrícula de la cavidad resonante.
 * para hacer más visible la oscilación y los vectores de campo
 */
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
               {/* Nuevo Control de Campo E Máximo */}
          <div className="space-y-4 mt-6">
            <div className="p-4 bg-gray-100 rounded-lg">
              <h3 className="font-semibold mb-2">Control de Campos Máximos</h3>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Campo E máximo: {formatScientific(eMaxField, "V/m")}
                </label>
                <input
                  type="range"
                  value={Math.log10(eMaxField) + 6}
                  onChange={(e) => {
                    const newEMax = Math.pow(10, e.target.value - 6);
                    setEMaxField(newEMax);
                  }}
                  min="-3"
                  max="3"
                  step="0.1"
                  className="w-full"
                />
              </div>

              <div className="mt-4 space-y-2">
                <p>Campo B máximo: {formatScientific(bMaxField, "T")}</p>
              </div>
            </div>

            {/* Densidades de Energía */}
            <div className="p-4 bg-gray-100 rounded-lg">
              <h3 className="font-semibold mb-2">Densidades de Energía</h3>
              <div className="space-y-2">
                <p>Energía eléctrica: {formatScientific(energyDensityE, "J/m³")}</p>
                <p>Energía magnética: {formatScientific(energyDensityB, "J/m³")}</p>
                <p>Energía total: {formatScientific(totalEnergyDensity, "J/m³")}</p>
              </div>
            </div>

            {/* Vector de Poynting */}
            <div className="p-4 bg-gray-100 rounded-lg">
              <h3 className="font-semibold mb-2">Vector de Poynting</h3>
              <p>Magnitud: {formatScientific(eMaxField * bMaxField / MU_0, "W/m²")}</p>
              <p>Presión de radiación: {formatScientific(eMaxField * bMaxField / (MU_0 * c), "N/m²")}</p>
            </div>
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
                <p>• Campo E máximo: {(eMaxField * 1e3).toFixed(2)} mV/m</p>
                <p>• Campo B máximo: {(bMaxField  * 1e9).toFixed(2)} nT</p>
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
                Amplitud: {formatScientific(amplitude, "V/m")}
              </label>
              <input
                type="range"
                value={Math.log10(amplitude) + 6}
                onChange={(e) => {
                  const newAmp = Math.pow(10, e.target.value - 6);
                  setAmplitude(newAmp);
                }}
                min="-6"  // 1 µV/m
                max="3"   // 1 kV/m
                step="0.1"
                className="w-full"
              />
              <div className="text-sm text-gray-600 mt-1">
                {/* Información adicional útil */}
                <p>Porcentaje del campo máximo: {((amplitude/eMaxField) * 100).toFixed(1)}%</p>
                <p>Amplitud del campo B: {formatScientific(amplitude/c, "T")}</p>
              </div>
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