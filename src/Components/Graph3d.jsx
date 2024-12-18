import React, { useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Line, Text } from "@react-three/drei";
import { evaluate } from "mathjs";
import { OrbitControls } from "@react-three/drei";

const Axes = () => {
  return (
    <>
      <Line
        points={[
          [-15, 0, 0],
          [15, 0, 0],
        ]}
        color="#99e550"
        lineWidth={2}
      />
      <Text
        position={[16, 0, 0]}
        fontSize={1}
        color="#99e550"
        anchorX="center"
        anchorY="middle"
      >
        Y
      </Text>
      <Line
        points={[
          [0, -15, 0],
          [0, 15, 0],
        ]}
        color="#639bff"
        lineWidth={2}
      />
      <Text
        position={[0, 16, 0]}
        fontSize={1}
        color="#639bff"
        anchorX="center"
        anchorY="middle"
      >
        Z
      </Text>
      <Line
        points={[
          [0, 0, -10],
          [0, 0, 50],
        ]}
        color="#d95763"
        lineWidth={2}
      />
    </>
  );
};

const Wave = ({ color, formula, axis, label, l, phaseT, phaseX }) => {
  const points = [];
  const positionLabel = axis === "x" ? [10, 4, 0] : [10, 2, 0];

  // Generar puntos basados en la fórmula
  for (let z = 0; z <= l; z += 0.1) {
    let displacement = 0;
    try {
      displacement = evaluate(`${formula}`, {
        z: phaseX,
        t: phaseT,
        x: z,
      });
      //console.log(formula);
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

const PlaneComponent = ({ position, color }) => {
  return (
    <mesh position={position}>
      <planeGeometry args={[15, 15]} />
      <meshBasicMaterial color={color} opacity={0.3} transparent side={2} />
    </mesh>
  );
};

const ElectromagneticWave = ({
  formulas,
  cavityLenght,
  harmonicNumber,
  closedData,
}) => {
  const [phaseX, setPhaseX] = React.useState(0); // Contador para x
  const [phaseT, setPhaseT] = React.useState(0); // Contador para t

  React.useEffect(() => {
    const interval = setInterval(() => {
      setPhaseT((prev) => prev + 0.0000005); // Actualiza el tiempo
      setPhaseX((prev) => prev + 0.0000005); // Actualiza la posición espacial
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const electricField = formulas.electric;

  const magneticField = formulas.magnetic; //podrías sumarle un valor alto como 100000000

  return (
    <>
      <div style={styles.container}>
        <p>La vista tiene navegación</p>
        <div style={styles.canvasContainer}>
          <Canvas camera={{ position: [12, 8, 30], rotateY: 50, fov: 60 }}>
            <ambientLight intensity={0.1} />
            <pointLight position={[10, 10, 10]} />

            <Axes />

            <Wave
              color="#df7126"
              formula={electricField}
              axis="x"
              label="Campo Eléctrico (E)"
              l={cavityLenght}
              phaseT={phaseT}
              phaseX={phaseX}
            />

            <Wave
              color="#632c78"
              formula={magneticField}
              axis="y"
              label="Campo Magnético (B)"
              l={cavityLenght}
              phaseT={phaseT}
              phaseX={phaseX}
            />

            {closedData === "abierta-cerrada" && (
              <PlaneComponent position={[0, 0, cavityLenght]} color="green" />
            )}

            {closedData === "cerrada-cerrada" && (
              <>
                <PlaneComponent position={[0, 0, cavityLenght]} color="green" />
                <PlaneComponent position={[0, 0, 0]} color="red" />
              </>
            )}
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
