import React, { useState, useEffect } from "react";

const WaveControls = () => {
  // Estado para las fronteras
  const [boundaryCondition, setBoundaryCondition] = useState("cerrada-cerrada");

  // Constantes
  const [constants, setConstants] = useState({
    E0: 0.5,
    B0: 0.3,
    k: 0, // Inicializar k, w, lambda
    w: 0,
    lambda: 0,
  });

  // Estado para parámetros de entrada
  const [inputs, setInputs] = useState({
    L: 1, // Longitud de la cavidad
    v: 1, // Velocidad
    amplitude: "E", // Amplitud seleccionada
    nodes: 1, // Número de nodos
  });

  // Calcular las constantes dinámicamente según la frontera seleccionada
  const calculateConstants = () => {
    const { L, v, nodes } = inputs;

    let k, w, lambda;

    // Cálculos según la condición de frontera seleccionada
    switch (boundaryCondition) {
      case "cerrada-cerrada":
        k = (Math.PI * nodes) / L;
        w = k * v;
        lambda = (2 * Math.PI) / k;
        break;
      case "abierta-abierta":
        k =  (Math.PI * nodes) / L;
        w = k * v;
        lambda = (2 * Math.PI) / k;
        break;
      case "abierta-cerrada":
        k = (2 * nodes - 1) * Math.PI / L;
        w = k * v;
        lambda = (2 * Math.PI) / k;
        break;
      default:
        k = 0;
        w = 0;
        lambda = 0;
    }

    // Actualizar las constantes en el estado
    setConstants({
      ...constants,
      k: k,
      w: w,
      lambda: lambda,
    });

    return { k, w, lambda };
  };

  // Efecto para recalcular las constantes cuando cambien los inputs o la frontera
  useEffect(() => {
    calculateConstants();
  }, [inputs, boundaryCondition]);

  // Ecuaciones dinámicas según la condición seleccionada
  const equations = {
    "cerrada-cerrada": {
      E: `E(x,t) = ${constants.E0}·Sin(${constants.k.toFixed(2)}x)·Cos(${constants.w.toFixed(2)}t)`,
      B: `B(x,t) = ${constants.B0}·Sin(${constants.w.toFixed(2)}t)·Cos(${constants.k.toFixed(2)}x)`,
    },
    "abierta-abierta": {
      E: `E(x,t) = ${constants.E0}·Cos(${constants.k}x)·Cos(${constants.w}t)`,
      B: `B(x,t) = ${constants.B0}·Sin(${constants.k}x)·Sin(${constants.w}t)`,
    },
    "abierta-cerrada": {
      E: `E(x,t) = ${constants.E0   }·Cos(${constants.k}x)·Cos(${constants.w}t)`,
      B: `B(x,t) = ${constants.B0}·Sin(${constants.k}x)·Cos(${constants.w}t)`,
    },
  };

  // Parámetros calculados
  const parameters = [
    `λ = ${(constants.lambda).toFixed(2)} m`,
    `k = ${constants.k.toFixed(2)} rad/m`,
    `ω = ${constants.w.toFixed(2)} rad/s`,
  ];

  // Manejo de cambios en inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  // Manejo de cambio de condiciones de frontera
  const handleBoundaryChange = (e) => {
    setBoundaryCondition(e.target.value);
  };

  return (
    <div>
      {/* Entrada de Parámetros */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Parámetros Iniciales</h3>
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="amplitude" className="block font-semibold w-1/3">
              Amplitud (E o B):
            </label>
            <select
              name="amplitude"
              value={inputs.amplitude}
              onChange={handleInputChange}
              className="border rounded px-2 py-1 w-2/3 text-sm"
            >
              <option value="E">E</option>
              <option value="B">B</option>
            </select>
            <span className="ml-2">{inputs.amplitude === "E" ? "V/m" : "T"}</span>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="L" className="block font-semibold w-1/3">
              Longitud de la Cavidad (L):
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
              Velocidad (v):
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
              Número de Nodos (n):
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

      {/* Controles de Frontera */}
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

      {/* Mostrar ecuaciones dinámicas */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Ecuaciones de E y B</h3>
        <div className="space-y-2">
          {Object.keys(equations[boundaryCondition]).map((key) => (
            <p key={key} className="text-sm font-mono">
              {key}: {equations[boundaryCondition][key]}
            </p>
          ))}
        </div>
      </div>

      {/* Mostrar parámetros calculados */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Parámetros Calculados</h3>
        <div className="space-y-1">
          {parameters.map((param, index) => (
            <p key={index} className="text-sm font-mono">
              {param}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WaveControls;
