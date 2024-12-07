import React, { useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Line, Text } from "@react-three/drei";
import { evaluate } from "mathjs";
import { OrbitControls } from "@react-three/drei";

const Axes = () => {
  return (
    <>
      {/* Eje X */}
      <Line
        points={[
          [-15, 0, 0],
          [15, 0, 0],
        ]}
        color="#d95763"
        lineWidth={2}
      />
      <Text
        position={[16, 0, 0]}
        fontSize={1}
        color="#d95763"
        anchorX="center"
        anchorY="middle"
      >
        X
      </Text>
      {/* Eje Y */}
      <Line
        points={[
          [0, -15, 0],
          [0, 15, 0],
        ]}
        color="#99e550"
        lineWidth={2}
      />
      <Text
        position={[0, 16, 0]}
        fontSize={1}
        color="#99e550"
        anchorX="center"
        anchorY="middle"
      >
        Y
      </Text>
      {/* Eje Z */}
      <Line
        points={[
          [0, 0, -10],
          [0, 0, 50],
        ]}
        color="#639bff"
        lineWidth={2}
      />
    </>
  );
};

const Wave = ({ color, formula, axis, label }) => {
  const points = [];
  const positionLabel = axis === "x" ? [5, 4, 0] : [5, 2, 0];

  // Generar puntos basados en la fórmula
  for (let z = 0; z <= 20; z += 0.1) {
    let displacement = 0;
    try {
      displacement = evaluate(formula, { z });
    } catch (e) {
      console.error("Error evaluando fórmula:", e);
    }

    if (axis === "x") {
      points.push([displacement, 0, z]); // Onda en X
    } else if (axis === "y") {
      points.push([0, displacement, z]); // Onda en Y
    }
  }

  return (
    <>
      <Line points={points} color={color} lineWidth={2} />
      {/* Etiqueta de la onda */}
      <Text
        position={positionLabel}
        fontSize={1}
        color={color}
        anchorX="middle"
        anchorY="middle"
      >
        {label}
      </Text>
    </>
  );
};

const ElectromagneticWave = () => {
  const phaseRef = useRef(0);
  const [phase, setPhase] = useState(0);

  const [time, setTime] = useState(0);
  const [lenght, setLenght] = useState(0); //x

  const [electricFieldFormula, setElectricFieldFormula] = useState(
    "2 * sin((2 * pi / 5) * z - phase)"
  );
  const [magneticFieldFormula, setMagneticFieldFormula] = useState(
    "2 * sin((2 * pi / 5) * z - phase)"
  );

  // Animar la fase
  React.useEffect(() => {
    const interval = setInterval(() => {
      phaseRef.current += 0.1;
      setPhase(phaseRef.current); // Actualizar la fase
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div style={styles.container}>
        <p>La vista tiene navegación</p>
        <div style={styles.canvasContainer}>
          <Canvas camera={{ position: [12, 8, 30], rotateY: 50, fov: 60 }}>
            <ambientLight intensity={0.1} />
            <pointLight position={[10, 10, 10]} />

            {/* Ejes */}
            <Axes />

            {/* Campo eléctrico */}
            <Wave
              color="#df7126"
              formula={electricFieldFormula.replace("phase", phase)}
              axis="x"
              label="Campo Eléctrico (E)"
            />

            {/* Campo magnético */}
            <Wave
              color="#632c78"
              formula={magneticFieldFormula.replace("phase", phase)}
              axis="y"
              label="Campo Magnético (B)"
            />
            <OrbitControls />
          </Canvas>
        </div>
      </div>
    </>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
    padding: "10px",
    margin: "10px",
  },
  controls: {
    marginBottom: "20px",
    textAlign: "center",
  },
  canvasContainer: {
    border: "2px solid #000",
    borderRadius: "10px",
    width: "80%",
    height: "70vh",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
};

export default ElectromagneticWave;
