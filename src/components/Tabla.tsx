import useAlgebra from "@/hooks/useAlgebra";

const Tabla = () => {
  const { matrix, handleChange } = useAlgebra();
  return (
    <table className="table-auto border-collapse rounded-lg overflow-hidden">
      <thead className="bg-teal-800 border-collapse rounded-3xl text-white">
        <tr>
          <th>X</th>
          <th>Y</th>
          <th>Z</th>
        </tr>
      </thead>
      <tbody>
        {matrix.map((row, rIdx) => (
          <tr
            key={rIdx}
            className={rIdx % 2 === 0 ? "bg-teal-100" : "bg-white"}
          >
            {row.map((val, cIdx) => (
              <td key={cIdx} className="border border-teal-400 p-1">
                <input
                  type="text"
                  value={val}
                  onChange={(e) => handleChange(rIdx, cIdx, e.target.value)}
                  className="w-10 p-2 text-center focus:outline-none focus:ring-2 focus:ring-teal-500 rounded"
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Tabla;
