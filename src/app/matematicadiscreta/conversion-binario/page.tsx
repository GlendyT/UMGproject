"use client";
import useMatematicaDiscreta from "@/hooks/useMatematicaDiscreta";
import BotonUtil from "@/utils/BotonUtil";
import { InlineMath } from "react-katex";
import TitleCourse from "@/components/TitleCourse";

const Binario = () => {
  const {
    setMode,
    mode,
    binInput,
    setBinInput,
    binValid,
    binResult,
    decInput,
    setDecInput,
    decValid,
    decResult,
  } = useMatematicaDiscreta();

  return (
    <div className="flex flex-col  min-h-screen bg-gray-100 p-4">
      <TitleCourse course="Conversor Binario ⇄ Decimal" />

      {/* Controles de modo */}
      <div className="flex flex-row items-center justify-center gap-2 mb-6">
        <BotonUtil
          label="Binario → Decimal"
          onClick={() => setMode("bin2dec")}
          className={`px-4 py-2 rounded-2xl shadow-sm border transition max-sm:text-xs ${
            mode === "bin2dec"
              ? "bg-gray-900 text-white"
              : "bg-white hover:bg-gray-100"
          }`}
        />
        <BotonUtil
          label="Decimal → Binario"
          onClick={() => setMode("dec2bin")}
          className={`px-4 py-2 rounded-2xl shadow-sm border transition max-sm:text-xs ${
            mode === "dec2bin"
              ? "bg-gray-900 text-white"
              : "bg-white hover:bg-gray-100"
          }`}
        />
      </div>

      {/* Panel de entrada */}
      {mode === "bin2dec" ? (
        <section className="bg-white border rounded-2xl p-4 md:p-6 shadow-sm mb-6">
          <label className="block text-sm font-medium mb-2">
            Número binario
          </label>
          <input
            value={binInput}
            onChange={(e) => setBinInput(e.target.value.trim())}
            inputMode="numeric"
            placeholder="Ej. 1101011"
            className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-4 focus:ring-gray-200"
          />
          {!binValid && (
            <p className="text-sm text-red-600 mt-2">
              Ingresa solo 0 y 1 (al menos un dígito).
            </p>
          )}

          {binValid && binResult && (
            <div className="flex flex-row max-sm:flex-col gap-4 ">
              <div className="w-full">
                <h2 className="text-lg font-semibold mb-3">
                  Suma de potencias de 2
                </h2>

                {/* Expresión compacta */}
                <div className="mt-4 text-sm">
                  <p className="mb-1 font-medium">Expresión:</p>
                  <p className="font-mono  break-all">
                    <InlineMath
                      math={binResult.terms
                        .map((t) => `${t.bit}\\times 2^{${t.exp}}`)
                        .join(" + ")}
                    />
                  </p>
                </div>

                {/* Suma final */}
                <div className="mt-4 p-3 bg-gray-50 rounded-xl border">
                  <p className="text-sm">Resultado en decimal:</p>
                  <p className="text-xl font-bold font-mono">
                    {binResult.total.toString()}
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto w-full">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-600">
                      <th className="py-2 pr-4">Bit</th>
                      <th className="py-2 pr-4">Exponente</th>
                      <th className="py-2 pr-4">2^exp</th>
                      <th className="py-2 pr-4">Producto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {binResult.terms.map((t, idx) => (
                      <tr key={idx} className="border-t">
                        <td className="py-1 pr-4 font-mono">{t.bit}</td>
                        <td className="py-1 pr-4 font-mono">{t.exp}</td>
                        <td className="py-1 pr-4 font-mono">
                          {t.power.toString()}
                        </td>
                        <td className="py-1 pr-4 font-mono">
                          {t.product.toString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      ) : (
        <section className="bg-white border rounded-2xl p-4 md:p-6 shadow-sm mb-6">
          <div className="flex flex-row max-sm:flex-col gap-4">
            <div className="w-full flex flex-col">
              <label className="block text-sm font-medium mb-2">
                Número decimal
              </label>
              <input
                value={decInput}
                onChange={(e) => setDecInput(e.target.value.trim())}
                inputMode="numeric"
                placeholder="Ej. 107"
                className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-4 focus:ring-gray-200"
              />
              {!decValid && (
                <p className="text-sm text-red-600 mt-2">
                  Ingresa solo dígitos (0–9) (al menos un dígito).
                </p>
              )}
              {decValid && decResult && (
                <div className="mt-6">
                  {/* Lectura de restos */}
                  <div className="mt-4 text-sm">
                    <p className="mb-1 font-medium">
                      Leemos los restos de abajo hacia arriba:
                    </p>
                    <p className="font-mono break-words">
                      {decResult.rows
                        .map((r) => r.remainder.toString())
                        .reverse()
                        .join("")}
                    </p>
                  </div>

                  {/* Resultado final */}
                  <div className="mt-4 p-3 bg-gray-50 rounded-xl border">
                    <p className="text-sm">Resultado en binario:</p>
                    <p className="text-xl font-bold font-mono">
                      {decResult.binary}
                    </p>
                  </div>
                </div>
              )}
            </div>
            {decValid && decResult && (
              <div className="mt-6 w-full">
                <h2 className="text-lg font-semibold mb-3">
                  Divisiones sucesivas entre 2
                </h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-600">
                        <th className="py-2 pr-4">Dividendo</th>
                        <th className="py-2 pr-4">Cociente</th>
                        <th className="py-2 pr-4">Resto</th>
                      </tr>
                    </thead>
                    <tbody>
                      {decResult.rows.map((r, idx) => (
                        <tr key={idx} className="border-t">
                          <td className="py-1 pr-4 font-mono">
                            {r.dividend.toString()}
                          </td>
                          <td className="py-1 pr-4 font-mono">
                            {r.quotient.toString()}
                          </td>
                          <td className="py-1 pr-4 font-mono">
                            {r.remainder.toString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Notas */}
      <div className="text-xs text-gray-600 text-center">
        <p>
          Consejo: Puedes pegar números muy grandes; se usan cálculos con{" "}
          <span className="font-mono">BigInt</span> para evitar errores de
          precisión. Para binario, se ignoran espacios y no se aceptan
          caracteres distintos de 0 y 1.
        </p>
      </div>
    </div>
  );
};

export default Binario;
