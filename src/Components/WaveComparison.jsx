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

  // Función para generar puntos de onda estacionaria
  /**
   * Math.sin(k * x) o Math.cos(k * x): Define el patrón espacial fijo
    Math.cos(2 * Math.PI * frequency * time): Define la oscilación temporal
   */
  const generateStandingWavePoints = (field) => {
    return Array.from({ length: 100 }, (_, i) => {
      const x = (i / 100) * width;
      const k = 2 * Math.PI / wavelength;
      // Campo E vertical, B horizontal
      const position = field === 'E' ? Math.sin(k * x) : Math.cos(k * x);


      const y = height/2 + amplitude * position * Math.cos(2 * Math.PI * frequency * time);
      return `${x},${y}`;
    }).join(' ');
  };

  // Función para generar puntos de onda viajera
  const generateTravelingWavePoints = (field) => {
    return Array.from({ length: 100 }, (_, i) => {
      const x = (i / 100) * width;
      const k = 2 * Math.PI / wavelength;
      const omega = 2 * Math.PI * frequency;
      // Campo E vertical, B horizontal, desfasados 90°
      const phase = field === 'E' ? 0 : Math.PI/2;
      const y = height/2 + amplitude * Math.sin(k * x - omega * time + phase);
      return `${x},${y}`;
    }).join(' ');
  };

  // Historial de oscilación del punto de observación
  const timeHistory = Array.from({ length: 50 }, (_, i) => {
    const pastTime = time - (i * 0.1);
    const k = 2 * Math.PI / wavelength;
    const omega = 2 * Math.PI * frequency;
    const x = width - (i * 5);
    const y = graphHeight/2 + amplitude/2 * Math.sin(k * observationPoint - omega * pastTime);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="flex flex-col items-center w-full max-w-6xl mx-auto">
      <Card className='w-full'>
        <CardHeader>
          <CardTitle className="text-center">Onda Electromagnética Estacionaria</CardTitle>
        </CardHeader>
        <CardContent className ="flex flex-col items-center space-y-6">
          <svg width={width} height={height} className="bg-gray-50">
            <line x1="0" y1={height/2} x2={width} y2={height/2} stroke="gray" strokeDasharray="4"/>
            
            {showEField && (
              <polyline
                points={generateStandingWavePoints('E')}
                fill="none"
                stroke="red"
                strokeWidth="2"
              />
            )}
            
            {showBField && (
              <polyline
                points={generateStandingWavePoints('B')}
                fill="none"
                stroke="blue"
                strokeWidth="2"
              />
            )}

            {/* Nodos y Antinodos del campo E */}
            {showEField && Array.from({ length: Math.floor(width/wavelength) + 1 }, (_, i) => (
              <React.Fragment key={`epoints-${i}`}>
                {/* Nodos */}
                <circle 
                  cx={i * wavelength/2} 
                  cy={height/2} 
                  r="4" 
                  fill="red" 
                  opacity="0.7"
                />
                {/* Antinodos */}
                {i < Math.floor(width/wavelength) && (
                  <circle 
                    cx={(i + 0.5) * wavelength/2} 
                    cy={height/2} 
                    r="4" 
                    fill="red" 
                    stroke="white"
                    strokeWidth="2"
                    opacity="0.7"
                  />
                )}
              </React.Fragment>
            ))}

            {/* Nodos y Antinodos del campo B */}
            {showBField && Array.from({ length: Math.floor(width/wavelength) + 1 }, (_, i) => (
              <React.Fragment key={`bpoints-${i}`}>
                {/* Nodos */}
                <circle 
                  cx={(i + 0.5) * wavelength/2} 
                  cy={height/2} 
                  r="4" 
                  fill="blue" 
                  opacity="0.7"
                />
                {/* Antinodos */}
                {i < Math.floor(width/wavelength) && (
                  <circle 
                    cx={i * wavelength/2} 
                    cy={height/2} 
                    r="4" 
                    fill="blue" 
                    stroke="white"
                    strokeWidth="2"
                    opacity="0.7"
                  />
                )}
              </React.Fragment>
            ))}

            {/* Punto de observación */}
            <circle 
              cx={observationPoint}
              cy={height/2}
              r="6"
              fill="purple"
              opacity="0.7"
            />
          </svg>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Onda Electromagnética Viajera</CardTitle>
        </CardHeader>
        <CardContent>
          <svg width={width} height={height} className="bg-gray-50">
            <line x1="0" y1={height/2} x2={width} y2={height/2} stroke="gray" strokeDasharray="4"/>
            
            {showEField && (
              <polyline
                points={generateTravelingWavePoints('E')}
                fill="none"
                stroke="red"
                strokeWidth="2"
              />
            )}
            
            {showBField && (
              <polyline
                points={generateTravelingWavePoints('B')}
                fill="none"
                stroke="blue"
                strokeWidth="2"
              />
            )}

            {/* Punto de observación */}
            <circle 
              cx={observationPoint}
              cy={height/2}
              r="6"
              fill="purple"
              opacity="0.7"
            />
          </svg>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Oscilación en el Punto de Observación</CardTitle>
        </CardHeader>
        <CardContent>
          <svg width={width} height={graphHeight} className="bg-gray-50">
            <line x1="0" y1={graphHeight/2} x2={width} y2={graphHeight/2} stroke="gray" strokeDasharray="4"/>
            
            {/* Historial de oscilación */}
            <polyline
              points={timeHistory}
              fill="none"
              stroke="purple"
              strokeWidth="2"
            />
          </svg>
        </CardContent>
      </Card>

      {/* Controles */}
      <div className="space-y-4">
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

        <div>
          <label className="block text-sm font-medium mb-1">
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
          <label className="block text-sm font-medium mb-1">
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
          <label className="block text-sm font-medium mb-1">
            Posición del punto de observación
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
      <div className="text-sm text-gray-600 space-y-2">
        <p>• En la onda estacionaria, observe cómo los nodos permanecen fijos mientras los antinodos oscilan</p>
        <p>• En la onda viajera, observe cómo toda la onda se desplaza hacia la derecha</p>
        <p>• El punto púrpura muestra una posición fija - observe cómo oscila diferente en cada caso</p>
        <p>• La gráfica inferior muestra el historial de oscilación del punto observado</p>
      </div>
    </div>
  );
};

export default WaveComparison;