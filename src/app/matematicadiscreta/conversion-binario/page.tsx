"use client";

import useMatematicaDiscreta from "@/hooks/useMatematicaDiscreta";

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
    <div className="min-h-screen w-full bg-gray-50 text-gray-900 flex items-start justify-center p-6">
      <div className="w-full max-w-4xl">
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Conversor Binario ⇄ Decimal
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            TSX • Cálculo paso a paso con BigInt
          </p>
        </header>

        {/* Controles de modo */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <button
            onClick={() => setMode("bin2dec")}
            className={`px-4 py-2 rounded-2xl shadow-sm border transition ${
              mode === "bin2dec"
                ? "bg-gray-900 text-white"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            Binario → Decimal
          </button>
          <button
            onClick={() => setMode("dec2bin")}
            className={`px-4 py-2 rounded-2xl shadow-sm border transition ${
              mode === "dec2bin"
                ? "bg-gray-900 text-white"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            Decimal → Binario
          </button>
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
              <div className="mt-6">
                <h2 className="text-lg font-semibold mb-3">
                  Suma de potencias de 2
                </h2>
                <div className="overflow-x-auto">
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

                {/* Expresión compacta */}
                <div className="mt-4 text-sm">
                  <p className="mb-1 font-medium">Expresión:</p>
                  <p className="font-mono break-words">
                    {binResult.terms
                      .map((t) => `${t.bit}×2^${t.exp}`)
                      .join(" + ")}
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
            )}
          </section>
        ) : (
          <section className="bg-white border rounded-2xl p-4 md:p-6 shadow-sm mb-6">
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
          </section>
        )}

        {/* Notas */}
        <div className="text-xs text-gray-600">
          <p>
            Consejo: Puedes pegar números muy grandes; se usan cálculos con{" "}
            <span className="font-mono">BigInt</span> para evitar errores de
            precisión. Para binario, se ignoran espacios y no se aceptan
            caracteres distintos de 0 y 1.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Binario;
