import useAlgebra from "@/hooks/useAlgebra";

const Solucion = () => {
  const { solution, formatNumber } = useAlgebra();
  return (
    <div className="">
      {solution && (
        <>
          <h3>Solución:</h3>
          <p>
            {solution.map((val, i) => (
              <span key={i} className="flex flex-col">
                {`x${i + 1} = ${formatNumber(val)}`}
                {i < solution.length - 1 ? "" : ""}
              </span>
            ))}
          </p>
        </>
      )}
    </div>
  );
};

export default Solucion;
