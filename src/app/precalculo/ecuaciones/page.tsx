"use client";

import usePrecalculo from "@/hooks/usePrecalculo";
import BotonBack from "@/utils/BotonBack";

export default function EquationSolverImagenStyle() {
  const { equation, setEquation, steps } = usePrecalculo();

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <header>
        <BotonBack />
        <h1 className="text-2xl font-bold">
          Resolutor (estilo de pasos de la imagen)
        </h1>
        <p className="text-sm text-gray-600">
          Escribe una ecuación y verás los 4 pasos con los mismos formatos y
          redondeos.
        </p>
      </header>
      <form className="space-y-4">
        <div>
          <label className="block font-semibold">Ecuación</label>
          <input
            type="text"
            value={equation}
            onChange={(e) => setEquation(e.target.value)}
            className="border p-2 w-full rounded-xl"
            placeholder="Ej.: x^4-8x^2+2=0 o 2x^2+3x-1=0"
          />
        </div>
      </form>
      {steps}
      <footer className="text-xs text-gray-500">
        * Todos los valores aproximados usan redondeo a 2 decimales para
        replicar el estilo del ejemplo.
      </footer>
    </div>
  );
}
