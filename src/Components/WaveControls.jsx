import React, { useState, useEffect } from "react";
import katex from "katex";
import "katex/dist/katex.min.css"; // Importa los estilos de KaTeX

const WaveControls = () => {
  const [boundaryCondition, setBoundaryCondition] = useState("cerrada-cerrada");
  const [constants, setConstants] = useState({
    E0: "",
    B0: "",
  });

  const equations = {
    "cerrada-cerrada": {
      factor: 2, // Factor multiplicativo para esta condición
      E: (k, w) =>
        `E(x,t) = ${2 * constants.E0} · Sin(${k.toFixed(2)}x) · Cos(${w.toFixed(2)}t)`,
      B: (k, w) =>
        `B(x,t) = ${2 * constants.B0} · Sin(${w.toFixed(2)}t) · Cos(${k.toFixed(2)}x)`,
    },
    "abierta-abierta": {
      factor: 2, // Factor multiplicativo para esta condición
      E: (k, w) =>
        `E(x,t) = ${2 * constants.E0} · Cos(${k.toFixed(2)}x) · Cos(${w.toFixed(2)}t)`,
      B: (k, w) =>
        `B(x,t) = ${2 * constants.B0} · Sin(${k.toFixed(2)}x) · Sin(${w.toFixed(2)}t)`,
    },
    "abierta-cerrada": {
      factor: 1, // Sin multiplicador adicional
      E: (k, w) =>
        `E(x,t) = ${constants.E0} · Cos(${k.toFixed(2)}x) · Cos(${w.toFixed(2)}t)`,
      B: (k, w) =>
        `B(x,t) = ${constants.B0} · Sin(${k.toFixed(2)}x) · Cos(${w.toFixed(2)}t)`,
    },
  };
  

  const [inputs, setInputs] = useState({
    L: "",   // cadena vacía en lugar de 1
    v: "",   // cadena vacía en lugar de 1
    amplitude: "E",
    nodes: "", // cadena vacía en lugar de 1
  });
  
  const [harmonics, setHarmonics] = useState([]);

  // Calcular constantes dinámicas para cada nodo
  const calculateHarmonics = () => {
    const { L, v, nodes } = inputs;
    const newHarmonics = [];

    for (let n = 1; n <= nodes; n++) {
      let k, w, lambda;

      switch (boundaryCondition) {
        case "cerrada-cerrada":
        case "abierta-abierta":
          k = (Math.PI * n) / L;
          break;
        case "abierta-cerrada":
          k = ((2 * n - 1) * Math.PI) / L;
          break;
        default:
          k = 0;
      }

      w = k * v;
      lambda = (2 * L) / n;

      newHarmonics.push({ n, k, w, lambda });
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

  return (
    <div>
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Parámetros Iniciales</h3>
        <div className="grid grid-cols-1 gap-4">
        <div className="flex items-center gap-2">
        <label htmlFor="E0" className="block font-semibold w-1/3">
  Amplitud (<span className="italic">E<sub>0</sub></span>):
</label>

  <input
    type="number"
    name="E0"
    value={constants.E0}
    onChange={(e) =>
      setConstants({ ...constants, E0: parseFloat(e.target.value) || 0 })
    }
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
              Armonicos:
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
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Condiciones de Frontera</h3>
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
        <div className="space-y-4">
          {harmonics.map(({ n, k, w, lambda }) => (
            <div key={n} className="text-sm font-mono">
              <p>n = {n}</p>
              <p>λ = {lambda.toFixed(2)}m</p>
              <p dangerouslySetInnerHTML={{
  __html: renderEquation(
    `k = ${k.toFixed(2)} \\text{ m}^{-1}`
  ),
}} />
              <p>w = {w.toFixed(2)}rad/s</p>
              <hr />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4">
  <h3 className="text-lg font-semibold mb-2">Ecuaciones de E y B</h3>
  <div className="space-y-4">
    {harmonics.map(({ n, k, w }) => (
      <div key={n} className="text-sm font-mono">
        {/* Título del modo y armónico */}
        <h4 className="font-semibold text-blue-600">
          Modo n = {n}. Armónico N° {n}
        </h4>
        {/* Ecuaciones de E y B */}
        <p
          dangerouslySetInnerHTML={{
            __html: renderEquation(equations[boundaryCondition].E(k, w)),
          }}
        />
        <p
          dangerouslySetInnerHTML={{
            __html: renderEquation(equations[boundaryCondition].B(k, w)),
          }}
        />
        <hr />
      </div>
    ))}
  </div>
</div>

    </div>
  );
};

export default WaveControls;
