import useAlgoritmos from "@/hooks/useAlgebra";

const Pasos = () => {
  const { steps } = useAlgoritmos();
  return (
    <div className="w-full  h-full bg-amber-50 rounded-lg shadow-md">
      <div className="p-4 bg-amber-100 rounded-t-lg border-b border-amber-200">
        <h3 className="text-xl font-bold">Pasos:</h3>
      </div>
      <div className="p-4 h-[calc(100%-60px)] overflow-y-auto ">
        {steps.length > 0 ? (
          <pre className="whitespace-pre-wrap font-mono text-sm ">
            {steps.join("\n\n")}
          </pre>
        ) : (
          <p className="text-gray-500 italic">
            Los pasos del proceso se mostrarán aquí...
          </p>
        )}
      </div>
    </div>
  );
};

export default Pasos;
