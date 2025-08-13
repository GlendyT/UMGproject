"use client";
import useAlgoritmos from "@/hooks/useAlgoritmos";
import React from "react";

const GaussianEliminationFractions = () => {
  const {
    size,
    handleSizeChange,
    matrix,
    handleChange,
    steps,
    solution,
    solve,
    formatNumber,
  } = useAlgoritmos();

  return (
    <div style={{ fontFamily: "Arial", padding: "20px" }}>
      <h2>Método de Gauss con Fracciones (Dinámico)</h2>

      <label>
        Tamaño:
        <input
          type="number"
          min={2}
          max={6}
          value={size}
          onChange={(e) => handleSizeChange(Number(e.target.value))}
          style={{ width: "50px", marginLeft: "5px" }}
        />
      </label>

      <h3>Ingrese la matriz aumentada:</h3>
      <table border={1} cellPadding={5} style={{ borderCollapse: "collapse" }}>
        <tbody>
          {matrix.map((row, rIdx) => (
            <tr key={rIdx}>
              {row.map((val, cIdx) => (
                <td key={cIdx}>
                  <input
                    type="text"
                    value={val}
                    onChange={(e) => handleChange(rIdx, cIdx, e.target.value)}
                    style={{ width: "60px" }}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={solve}
        style={{
          marginTop: "10px",
          padding: "5px 10px",
          cursor: "pointer",
        }}
      >
        Resolver
      </button>

      {steps.length > 0 && (
        <>
          <h3>Pasos:</h3>
          <pre
            style={{
              background: "#f0f0f0",
              padding: "10px",
              whiteSpace: "pre-wrap",
            }}
          >
            {steps.join("\n\n")}
          </pre>
        </>
      )}

      {solution && (
        <>
          <h3>Solución:</h3>
          <p>
            {solution.map((val, i) => (
              <span key={i}>
                {`x${i + 1} = ${formatNumber(val)}`}
                {i < solution.length - 1 ? ", " : ""}
              </span>
            ))}
          </p>
        </>
      )}
    </div>
  );
};

export default GaussianEliminationFractions;
