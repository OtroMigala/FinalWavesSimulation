import React, { useState, useEffect } from "react";
import katex from "katex";
import "katex/dist/katex.min.css"; // Importa los estilos de KaTeX
import Graph3d from "./Graph3d";
/*
const WaveControls = () => {
  let k, w, lambda, E0, B0;
  const [boundaryCondition, setBoundaryCondition] = useState("cerrada-cerrada");

  const equations = {
    "cerrada-cerrada": {
      factor: 2, // Factor multiplicativo para esta condición
      E: (k, w, E0) =>
        `E(x,t) = ${2 * E0} · Sin(${k.toFixed(2)}x) · Cos(${w.toFixed(2)}t)`,
      B: (k, w, B0) =>
        `B(x,t) = ${2 * B0} · Sin(${w.toFixed(2)}t) · Cos(${k.toFixed(2)}x)`,
    },
    "abierta-abierta": {
      factor: 2, // Factor multiplicativo para esta condición
      E: (k, w, E0) =>
        `E(x,t) = ${2 * E0} · Cos(${k.toFixed(2)}x) · Cos(${w.toFixed(2)}t)`,
      B: (k, w, B0) =>
        `B(x,t) = ${2 * B0} · Sin(${k.toFixed(2)}x) · Sin(${w.toFixed(2)}t)`,
    },
    "abierta-cerrada": {
      factor: 1, // Sin multiplicador adicional
      E: (k, w, E0) =>
        `E(x,t) = ${E0} · Cos(${k.toFixed(2)}x) · Cos(${w.toFixed(2)}t)`,
      B: (k, w, B0) =>
        `B(x,t) = ${B0} · Sin(${k.toFixed(2)}x) · Cos(${w.toFixed(2)}t)`,
    },
  };

  const [inputs, setInputs] = useState({
    L: "", // cadena vacía en lugar de 1
    v: "", // cadena vacía en lugar de 1
    amplitude: "E",
    nodes: "", // cadena vacía en lugar de 1
    E0: "",
  });

  const [harmonics, setHarmonics] = useState([]);

  // Calcular constantes dinámicas para cada nodo
  const calculateHarmonics = () => {
    const { L, v, nodes, E0 } = inputs;
    const newHarmonics = [];

    for (let n = 1; n <= nodes; n++) {
      // Calcular el valor de k, w y lambda según la condición de frontera
      switch (boundaryCondition) {
        case "cerrada-cerrada":
        case "abierta-abierta":
          k = (Math.PI * n) / L;
          break;
        case "abierta-cerrada":
          k = ((2 * n - 1) * Math.PI) / (2 * L);
          break;
        default:
          k = 0;
      }

      w = k * v;
      lambda = (2 * L) / n;

      // Suponemos que E0 y B0 son valores relacionados con la amplitud
      // Usamos una aproximación para E0 y B0
      // Amplitud para E (puede ajustarse según el input)
      B0 = E0 / v; // Relación simple para B0, que podría cambiar dependiendo del modelo

      newHarmonics.push({ n, k, w, lambda, E0, B0 });
    }

    setHarmonics(newHarmonics);
  };

  // Recalcular armonías cuando cambien inputs o frontera
  useEffect(() => {
    calculateHarmonics();
  }, [inputs, boundaryCondition]);

  // Manejo de cambios en inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Si el valor es una cadena vacía, dejamos el campo vacío
    setInputs({
      ...inputs,
      [name]: value === "" ? "" : Number(value),
    });
  };

  // Manejo de cambio de condiciones de frontera
  const handleBoundaryChange = (e) => {
    setBoundaryCondition(e.target.value);
  };

  // Función para renderizar ecuaciones usando KaTeX
  const renderEquation = (equation) => {
    return katex.renderToString(equation, {
      throwOnError: false,
    });
  };

  const [graphData, setGraphData] = useState({
    E: "cola",
    B: "bola",
  });

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <Graph3d
          formulas={{
            electric: graphData.E,
            magnetic: graphData.B,
          }}
          cavityLenght={inputs.L}
          harmonicNumber={inputs.nodes}
          closedData={boundaryCondition}
        />
        <h3 className="text-lg font-semibold mb-2">Parámetros Iniciales</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="E0" className="block font-semibold w-1/3">
              Amplitud (
              <span className="italic">
                E<sub>0</sub>
              </span>
              ):
            </label>
            <input
              type="number"
              name="E0"
              onChange={handleInputChange}
              className="border rounded px-2 py-1 w-2/3 text-sm"
            />
            <span className="ml-2">V/m</span>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="L" className="block font-semibold w-1/3">
              Longitud de la Cavidad:
            </label>
            <input
              type="number"
              name="L"
              value={inputs.L}
              onChange={handleInputChange}
              className="border rounded px-2 py-1 w-2/3 text-sm"
            />
            <span className="ml-2">m</span>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="v" className="block font-semibold w-1/3">
              Velocidad:
            </label>
            <input
              type="number"
              name="v"
              value={inputs.v}
              onChange={handleInputChange}
              className="border rounded px-2 py-1 w-2/3 text-sm"
            />
            <span className="ml-2">m/s</span>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="nodes" className="block font-semibold w-1/3">
              Armonicos a calcular:
            </label>
            <input
              type="number"
              name="nodes"
              value={inputs.nodes}
              onChange={handleInputChange}
              className="border rounded px-2 py-1 w-2/3 text-sm"
            />
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">
            Condiciones de Frontera
          </h3>
          <div className="flex items-center gap-4">
            <label>
              <input
                type="radio"
                name="boundary"
                value="cerrada-cerrada"
                checked={boundaryCondition === "cerrada-cerrada"}
                onChange={handleBoundaryChange}
              />
              Cerrada-Cerrada
            </label>
            <label>
              <input
                type="radio"
                name="boundary"
                value="abierta-abierta"
                checked={boundaryCondition === "abierta-abierta"}
                onChange={handleBoundaryChange}
              />
              Abierta-Abierta
            </label>
            <label>
              <input
                type="radio"
                name="boundary"
                value="abierta-cerrada"
                checked={boundaryCondition === "abierta-cerrada"}
                onChange={handleBoundaryChange}
              />
              Abierta-Cerrada
            </label>
          </div>
        </div>
        <button>Actualizar Gráfica</button>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Datos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {harmonics.map(({ n, k, w, lambda, E0, B0 }) => (
              <div
                key={n}
                className="text-sm font-mono bg-gray-50 p-4 rounded-lg shadow-sm"
              >
                <p>n = {n}</p>
                <p>λ = {lambda.toFixed(2)}m</p>
                <p
                  dangerouslySetInnerHTML={{
                    __html: renderEquation(
                      equations[boundaryCondition].E(k, w, E0)
                    ),
                  }}
                />
                <p
                  dangerouslySetInnerHTML={{
                    __html: renderEquation(
                      equations[boundaryCondition].B(k, w, B0)
                    ),
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaveControls;
*/

const WaveControls = () => {
  let k, w, lambda, E0, B0;
  const [boundaryCondition, setBoundaryCondition] = useState("cerrada-cerrada");

  const equations = {
    "cerrada-cerrada": {
      factor: 2, // Factor multiplicativo para esta condición
      E: (k, w, E0) =>
        `E(x,t) = ${2 * E0} · Sin(${k.toFixed(2)} · x) · Cos(${w.toFixed(
          2
        )} · t)`,
      B: (k, w, B0) =>
        `B(x,t) = ${2 * B0} · Sin(${w.toFixed(2)} · t) · Cos(${k.toFixed(
          2
        )} · x)`,
    },
    "abierta-abierta": {
      factor: 2, // Factor multiplicativo para esta condición
      E: (k, w, E0) =>
        `E(x,t) = ${2 * E0} · Cos(${k.toFixed(2)} · x) · Cos(${w.toFixed(
          2
        )} · t)`,
      B: (k, w, B0) =>
        `B(x,t) = ${2 * B0} · Sin(${k.toFixed(2)} · x) · Sin(${w.toFixed(
          2
        )} · t)`,
    },
    "abierta-cerrada": {
      factor: 1, // Sin multiplicador adicional
      E: (k, w, E0) =>
        `E(x,t) = ${E0} · Cos(${k.toFixed(2)} · x) · Cos(${w.toFixed(2)} · t)`,
      B: (k, w, B0) =>
        `B(x,t) = ${B0} · Sin(${k.toFixed(2)} · x) · Cos(${w.toFixed(2)} · t)`,
    },
  };

  const [inputs, setInputs] = useState({
    L: "10", // cadena vacía en lugar de 1
    v: "300000000", // cadena vacía en lugar de 1
    amplitude: "",
    nodes: "1", // cadena vacía en lugar de 1
    E0: "",
  });

  const getEvaluableFormulas = (boundaryCondition, k, w, E0, B0) => {
    const condition = equations[boundaryCondition];

    // Extraer las fórmulas
    const electricFormula = condition
      .E(k, w, E0)
      .replace(/E\(x,t\) = /, "")
      .replace(/Sin/g, "sin")
      .replace(/Cos/g, "cos")
      .replace(/·/g, "*");
    const magneticFormula = condition
      .B(k, w, B0)
      .replace(/B\(x,t\) = /, "")
      .replace(/Sin/g, "sin")
      .replace(/Cos/g, "cos")
      .replace(/·/g, "*");

    return { electric: electricFormula, magnetic: magneticFormula };
  };

  const [harmonics, setHarmonics] = useState([]);

  // Calcular constantes dinámicas para cada nodo
  const calculateHarmonics = () => {
    const { L, v, nodes, E0 } = inputs;
    const newHarmonics = [];
    let electricFormula = "";
    let magneticFormula = "";

    for (let n = 1; n <= nodes; n++) {
      switch (boundaryCondition) {
        case "cerrada-cerrada":
        case "abierta-abierta":
          k = (Math.PI * n) / L;
          break;
        case "abierta-cerrada":
          k = ((2 * n - 1) * Math.PI) / (2 * L);
          break;
        default:
          k = 0;
      }

      w = k * v;
      lambda = (2 * L) / n;
      B0 = E0 / v;

      // Obtener las fórmulas evaluables
      const formulas = getEvaluableFormulas(boundaryCondition, k, w, E0, B0);

      // Actualizar fórmulas para graficar
      if (n === nodes) {
        electricFormula = formulas.electric;
        magneticFormula = formulas.magnetic;
      }

      newHarmonics.push({ n, k, w, lambda, E0, B0 });
    }

    setGraphData({ E: electricFormula, B: magneticFormula });
    setHarmonics(newHarmonics);
  };

  // Recalcular armonías cuando cambien inputs o frontera
  useEffect(() => {
    calculateHarmonics();
  }, [inputs, boundaryCondition]);

  // Manejo de cambios en inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Si el valor es una cadena vacía, dejamos el campo vacío
    setInputs({
      ...inputs,
      [name]: value === "" ? "" : Number(value),
    });
  };

  // Manejo de cambio de condiciones de frontera
  const handleBoundaryChange = (e) => {
    setBoundaryCondition(e.target.value);
  };

  // Función para renderizar ecuaciones usando KaTeX
  const renderEquation = (equation) => {
    return katex.renderToString(equation, {
      throwOnError: false,
    });
  };

  const [graphData, setGraphData] = useState({
    E: "cola",
    B: "bola",
  });

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <Graph3d
          formulas={{
            electric: graphData.E,
            magnetic: graphData.B,
          }}
          cavityLenght={inputs.L}
          harmonicNumber={inputs.nodes}
          closedData={boundaryCondition}
        />
        <h3 className="text-lg font-semibold mb-2">Parámetros Iniciales</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="E0" className="block font-semibold w-1/3">
              Amplitud (
              <span className="italic">
                E<sub>0</sub>
              </span>
              ):
            </label>
            <input
              type="number"
              name="E0"
              onChange={handleInputChange}
              className="border rounded px-2 py-1 w-2/3 text-sm"
            />
            <span className="ml-2">V/m</span>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="L" className="block font-semibold w-1/3">
              Longitud de la Cavidad:
            </label>
            <input
              type="number"
              name="L"
              value={inputs.L}
              onChange={handleInputChange}
              className="border rounded px-2 py-1 w-2/3 text-sm"
            />
            <span className="ml-2">m</span>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="v" className="block font-semibold w-1/3">
              Velocidad:
            </label>
            <input
              type="number"
              name="v"
              value={inputs.v}
              onChange={handleInputChange}
              className="border rounded px-2 py-1 w-2/3 text-sm"
            />
            <span className="ml-2">m/s</span>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="nodes" className="block font-semibold w-1/3">
              Armonicos a calcular:
            </label>
            <input
              type="number"
              name="nodes"
              value={inputs.nodes}
              onChange={handleInputChange}
              className="border rounded px-2 py-1 w-2/3 text-sm"
            />
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">
            Condiciones de Frontera
          </h3>
          <div className="flex items-center gap-4">
            <label>
              <input
                type="radio"
                name="boundary"
                value="cerrada-cerrada"
                checked={boundaryCondition === "cerrada-cerrada"}
                onChange={handleBoundaryChange}
              />
              Cerrada-Cerrada
            </label>
            <label>
              <input
                type="radio"
                name="boundary"
                value="abierta-abierta"
                checked={boundaryCondition === "abierta-abierta"}
                onChange={handleBoundaryChange}
              />
              Abierta-Abierta
            </label>
            <label>
              <input
                type="radio"
                name="boundary"
                value="abierta-cerrada"
                checked={boundaryCondition === "abierta-cerrada"}
                onChange={handleBoundaryChange}
              />
              Abierta-Cerrada
            </label>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Datos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {harmonics.map(({ n, k, w, lambda, E0, B0 }) => (
              <div
                key={n}
                className="text-sm font-mono bg-gray-50 p-4 rounded-lg shadow-sm"
              >
                <p>n = {n}</p>
                <p>λ = {lambda.toFixed(2)}m</p>
                <p
                  dangerouslySetInnerHTML={{
                    __html: renderEquation(
                      equations[boundaryCondition].E(k, w, E0)
                    ),
                  }}
                />
                <p
                  dangerouslySetInnerHTML={{
                    __html: renderEquation(
                      equations[boundaryCondition].B(k, w, B0)
                    ),
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaveControls;
