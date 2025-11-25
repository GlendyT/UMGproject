"use client";
import BotonUtil from "@/utils/BotonUtil";
import Tabla from "@/components/Tabla";
import Solucion from "@/components/Solucion";
import Pasos from "@/components/Pasos";
import useAlgebra from "@/hooks/useAlgebra";
import TitleCourse from "@/components/TitleCourse";

const MetodoGauss = () => {
  const { size, handleSizeChange, solve, nuevo } = useAlgebra();
  return (
    <div className="min-h-screen p-4 w-full flex flex-col gap-2">
      <TitleCourse course="Metodo de Gauss" />
      <div className="flex flex-row items-start justify-between gap-4 max-sm:flex-col px-4 ">
        <div className="flex flex-col gap-4 ">
          <div className="flex flex-row gap-4 max-sm:flex-col max-sm:items-center ">
            <div className="flex flex-col">
              <span className="mb-1">Tamaño de matriz:</span>
              <div className="flex flex-row items-center gap-2">
                <input
                  type="number"
                  min={2}
                  max={6}
                  value={size}
                  onChange={(e) => handleSizeChange(Number(e.target.value))}
                  className=" text-2xl w-12 text-center rounded-2xl flex items-center justify-center"
                  readOnly
                />
                <div className="flex flex-row gap-1 items-center justify-center">
                  <BotonUtil
                    label="-"
                    onClick={() =>
                      size > 2 ? handleSizeChange(size - 1) : null
                    }
                    className=" bg-gray-300 px-3  "
                    disabled={size <= 2}
                  />

                  <BotonUtil
                    onClick={() =>
                      size < 6 ? handleSizeChange(size + 1) : null
                    }
                    className=" bg-gray-300 px-3"
                    disabled={size >= 6}
                    label="+"
                  />
                </div>
              </div>
            </div>
            <Tabla />
          </div>
          <BotonUtil
            onClick={solve}
            className=" bg-black text-white"
            label={"Resolver"}
          />
          <BotonUtil
            className={"bg-black text-white"}
            label={"Nuevo"}
            onClick={nuevo}
          />
          <Solucion />
        </div>
        <Pasos />
      </div>
    </div>
  );
};

export default MetodoGauss;
