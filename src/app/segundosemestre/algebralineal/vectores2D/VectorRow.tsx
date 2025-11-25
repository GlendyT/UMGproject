import useAlgebra from "@/hooks/useAlgebra";
import React from "react";

const VectorRow = ({ idx }: { idx: number }) => {
  const { vectors, setVectors } = useAlgebra();
  const v = vectors[idx] || {};
  function update(partial: Partial<typeof v>) {
    const copy = vectors.slice();
    copy[idx] = { ...(copy[idx] || {}), ...partial };
    setVectors(copy);
  }
  return (
    <div className="flex flex-col items-center justify-center gap-2 p-1 border rounded-md">
      <div className="flex flex-wrap items-center justify-around gap-2">
        <div>
          <label className="block text-sm"> Magnitud</label>
          <input
            value={v.mag || ""}
            onChange={(e) => update({ mag: e.target.value })}
            className="w-20 p-2 border rounded"
            placeholder="ej. 10"
          />
        </div>
        <div>
          <label className="block text-sm">Angulo</label>
          <input
            value={v.angle || ""}
            onChange={(e) => update({ angle: e.target.value })}
            className="w-28 p-2 border rounded"
            placeholder='ej.30 o "N 60 O"'
          />
        </div>
      </div>
      <div className="flex flex-col  items-center justify-center gap-1">
        <h1 className="text-xs">O por componentes:</h1>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <div className="flex flex-col items-center justify-center">
            <label className=" text-xs"> x</label>
            <input
              value={v.x || ""}
              onChange={(e) => update({ x: e.target.value })}
              className="w-20 p-2 border rounded"
              placeholder="x"
            />
          </div>
          <div className="flex flex-col items-center justify-center">
            {" "}
            <label className=" text-xs"> y</label>
            <input
              value={v.y || ""}
              onChange={(e) => update({ y: e.target.value })}
              className="w-20 p-2 border rounded"
              placeholder="y"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VectorRow;
