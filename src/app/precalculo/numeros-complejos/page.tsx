"use client";

import React, { useMemo, useState } from "react";
import "katex/dist/katex.min.css";
import { BlockMath, InlineMath } from "react-katex";
import BotonBack from "@/utils/BotonBack";
import BotonUtil from "@/utils/BotonUtil";

type Complex = { re: number; im: number };
type Op = "add" | "sub" | "mul" | "div";

// ------- utilidades -------
const sgn = (n: number) => (n >= 0 ? "+" : "-");
const abs = (n: number) => Math.abs(n);
const isInt = (x: number) => Number.isInteger(x);

const complexLatex = (z: Complex, parens = true) => {
  const s = `${z.re} ${sgn(z.im)} ${abs(z.im)}i`;
  return parens ? `\\left(${s}\\right)` : s;
};

const gcd2 = (a: number, b: number): number => {
  a = Math.trunc(Math.abs(a));
  b = Math.trunc(Math.abs(b));
  while (b) [a, b] = [b, a % b];
  return a || 1;
};
const gcd3 = (a: number, b: number, c: number) => gcd2(gcd2(a, b), c);

// entero, fracción simplificada, o decimal si hace falta
const fracLatex = (num: number, den: number) => {
  if (den === 0) return "\\text{indefinido}";
  if (isInt(num) && isInt(den)) {
    const g = gcd2(num, den);
    const n = num / g,
      d = den / g;
    return d === 1 ? `${n}` : `\\dfrac{${n}}{${d}}`;
  }
  return `${(num / den).toFixed(3)}`;
};

// ------- operaciones -------
const add = (a: Complex, b: Complex): Complex => ({
  re: a.re + b.re,
  im: a.im + b.im,
});
const sub = (a: Complex, b: Complex): Complex => ({
  re: a.re - b.re,
  im: a.im - b.im,
});
const mul = (a: Complex, b: Complex): Complex => ({
  re: a.re * b.re - a.im * b.im,
  im: a.re * b.im + a.im * b.re,
});
const div = (a: Complex, b: Complex): Complex => {
  const den = b.re * b.re + b.im * b.im;
  return {
    re: (a.re * b.re + a.im * b.im) / den,
    im: (a.im * b.re - a.re * b.im) / den,
  };
};

// ------- pasos LaTeX -------
function stepsAdd(a: Complex, b: Complex) {
  const r = add(a, b);
  return [
    `${complexLatex(a)} + ${complexLatex(b)}`,
    `= \\left(${a.re} + ${b.re}\\right) + \\left(${a.im} + ${b.im}\\right)i`,
    `= ${r.re} ${sgn(r.im)} ${abs(r.im)}i`,
  ];
}
function stepsSub(a: Complex, b: Complex) {
  const r = sub(a, b);
  return [
    `${complexLatex(a)} - ${complexLatex(b)}`,
    `= \\left(${a.re} - ${b.re}\\right) + \\left(${a.im} - ${b.im}\\right)i`,
    `= ${r.re} ${sgn(r.im)} ${abs(r.im)}i`,
  ];
}
function stepsMul(a: Complex, b: Complex) {
  const r = mul(a, b);
  const ac = a.re * b.re,
    ad = a.re * b.im,
    bc = a.im * b.re,
    bd = a.im * b.im;
  return [
    `${complexLatex(a)}\\,${complexLatex(b)}`,
    `= (${a.re}+${a.im}i)(${b.re}+${b.im}i)`,
    `= ${ac} + ${ad}i + ${bc}i + ${bd}i^{2}`,
    `= ${ac - bd} ${sgn(ad + bc)} ${abs(
      ad + bc
    )}i\\quad\\text{(porque }i^{2}=-1\\text{)}`,
    `= ${r.re} ${sgn(r.im)} ${abs(r.im)}i`,
  ];
}
function stepsDiv(a: Complex, b: Complex, showFraction: boolean) {
  const den = b.re * b.re + b.im * b.im;
  const ac = a.re * b.re,
    bd = a.im * b.im,
    bc = a.im * b.re,
    ad = a.re * b.im;

  const reNum = ac + bd; // numerador parte real
  const imNum = bc - ad; // numerador parte imaginaria
  const gAll = gcd3(reNum, imNum, den);

  const reS = reNum / gAll,
    imS = imNum / gAll,
    denS = den / gAll;

  if (showFraction) {
    return [
      `\\dfrac{${complexLatex(a, false)}}{${complexLatex(b, false)}}`,
      `= \\dfrac{${complexLatex(a, false)}\\,(${b.re}-${b.im}i)}{${complexLatex(
        b,
        false
      )}\\,(${b.re}-${b.im}i)}\\quad\\text{(conjugado)}`,
      `= \\dfrac{(${a.re}+${a.im}i)(${b.re}-${b.im}i)}{(${b.re})^{2}+(${b.im})^{2}}`,
      `= \\dfrac{${reNum} ${sgn(imNum)} ${abs(imNum)}i}{${den}}`,
      gAll > 1
        ? `= \\dfrac{${reS} ${sgn(imS)} ${abs(
            imS
          )}i}{${denS}}\\quad\\text{(simplificando por }${gAll}\\text{)}`
        : "",
      `= ${fracLatex(reNum, den)} ${sgn(imNum)} ${fracLatex(abs(imNum), den)}i`,
    ].filter(Boolean);
  } else {
    return [
      `\\dfrac{${complexLatex(a, false)}}{${complexLatex(b, false)}}`,
      `= ${(reNum / den).toFixed(3)} ${sgn(imNum)} ${(
        Math.abs(imNum) / den
      ).toFixed(3)}i`,
    ];
  }
}

// ------- potencias de i -------
function powerISteps(n: number) {
  if (!Number.isInteger(n)) return ["\\text{Usa un exponente entero.}"];
  if (n === 0) return ["i^{0} = 1"];
  const sign = n < 0 ? "-" : "";
  const m = Math.abs(n);
  const q = Math.floor(m / 4);
  const r = m % 4;

  const base = ["1", "i", "-1", "-i"][r]; // r = 0,1,2,3
  const final =
    n < 0 ? (r === 0 ? "1" : r === 1 ? "-i" : r === 2 ? "-1" : "i") : base;

  const lines: string[] = [];
  lines.push(`i^{${n}} = i^{${sign}${m}}`);
  if (n < 0) lines.push(`= \\dfrac{1}{i^{${m}}}`);
  lines.push(`= i^{4\\cdot ${q} + ${r}}`);
  lines.push(`= (i^{4})^{${q}}\\, i^{${r}}`);
  lines.push(`= ${final}`);
  return lines;
}

// ------- componente principal -------
export default function ComplexSteps() {
  const [a, setA] = useState<Complex>({ re: 3, im: 5 });
  const [b, setB] = useState<Complex>({ re: 4, im: 2 });
  const [op, setOp] = useState<Op>("add");
  const [exp, setExp] = useState<number>(23);
  const [showFraction, setShowFraction] = useState(true);

  const steps = useMemo(() => {
    if (op === "add") return stepsAdd(a, b);
    if (op === "sub") return stepsSub(a, b);
    if (op === "mul") return stepsMul(a, b);
    if (b.re === 0 && b.im === 0) return ["\\text{División por cero}"];
    return stepsDiv(a, b, showFraction);
  }, [a, b, op, showFraction]);

  const prettyResult = useMemo(() => {
    if (op !== "div") {
      const z = op === "add" ? add(a, b) : op === "sub" ? sub(a, b) : mul(a, b);
      return `${z.re} ${sgn(z.im)} ${abs(z.im)}i`;
    }
    const den = b.re * b.re + b.im * b.im;
    const reNum = a.re * b.re + a.im * b.im;
    const imNum = a.im * b.re - a.re * b.im;
    const gAll = gcd3(reNum, imNum, den);
    const reS = reNum / gAll,
      imS = imNum / gAll,
      denS = den / gAll;
    return showFraction
      ? `\\dfrac{${reS} ${sgn(imS)} ${abs(imS)}i}{${denS}}`
      : `${(reNum / den).toFixed(3)} ${sgn(imNum)} ${(
          Math.abs(imNum) / den
        ).toFixed(3)}i`;
  }, [a, b, op, showFraction]);

  const powSteps = useMemo(() => powerISteps(exp), [exp]);

  return (
    <div className="min-h-screen flex flex-col p-4 gap-4 items-center">
      <div className="flex flex-row w-full items-center gap-4">
        <BotonBack />
        <h1 className="text-2xl font-semibold text-center w-full">
          Operaciones con Números Complejos
        </h1>
      </div>
      <div className="flex flex-wrap gap-2 items-center justify-center">
        <div className="flex flex-row gap-2 border p-2 rounded-xl">
          {/* A */}
          <div className="flex flex-col items-center justify-center">
            <div className="text-sm font-medium mb-2">Número A</div>
            <div className="flex flex-row   gap-2 items-center justify-center">
              <input
                type="number"
                className=" rounded border p-2 w-10 "
                value={a.re}
                onChange={(e) => setA({ ...a, re: Number(e.target.value) })}
                placeholder="Parte real"
              />
              <input
                type="number"
                className=" rounded border p-2 w-10"
                value={a.im}
                onChange={(e) => setA({ ...a, im: Number(e.target.value) })}
                placeholder="Parte imaginaria"
              />
            </div>
          </div>

          {/* B */}
          <div className="flex flex-col items-center justify-center">
            <div className="text-sm font-medium mb-2">Número B</div>
            <div className="flex flex-row w-full gap-2 items-center justify-center">
              <input
                type="number"
                className=" rounded border p-2 w-10"
                value={b.re}
                onChange={(e) => setB({ ...b, re: Number(e.target.value) })}
                placeholder="Parte real"
              />
              <input
                type="number"
                className=" rounded border p-2 w-10"
                value={b.im}
                onChange={(e) => setB({ ...b, im: Number(e.target.value) })}
                placeholder="Parte imaginaria"
              />
            </div>
          </div>
        </div>
        {/* Operación */}
        <div className="p-4 rounded-xl border">
          <div className="flex flex-row items-center justify-between gap-2">
            <span className="font-medium">
              A:
              <InlineMath math={complexLatex(a, false)} />{" "}
            </span>{" "}
            <span className="font-medium">
              B:
              <InlineMath math={complexLatex(b, false)} />
            </span>
          </div>
          <select
            className="w-full rounded border p-2"
            value={op}
            onChange={(e) => setOp(e.target.value as Op)}
          >
            <option value="add">Suma (A + B)</option>
            <option value="sub">Resta (A − B)</option>
            <option value="mul">Multiplicación (A·B)</option>
            <option value="div">División (A / B)</option>
          </select>
        </div>
      </div>

      <div className="flex flex-row max-sm:flex-col w-full items-start justify-center gap-2">
        {/* Pasos */}
        <div className="border flex flex-col rounded-xl p-2 items-center justify-center">
          <h1 className="text-sm font-semibold">Procedimiento paso a paso</h1>
          <div className="flex flex-col">
            {steps.map((eq, i) => (
              <div key={i} className="rounded-lg bg-gray-50 ">
                <BlockMath math={eq} />
              </div>
            ))}
          </div>
          {/* Resultado principal */}
          <div className="flex flex-row gap-2 border shadow-2xl rounded-2xl p-2">
            <div className="flex justify-between items-center">
              <h1 className="text-sm font-medium">Resultado</h1>
            </div>
            <div className="text-lg">
              <InlineMath math={prettyResult} />
            </div>
          </div>
        </div>

        {/* Potencias de i */}
        <div className="p-2 flex flex-col rounded-xl border">
          <div className="flex items-center  gap-2">
            <h1 className="text-sm font-semibold">
              Potencias de <InlineMath math="i^n" />
            </h1>
            <div>
              <label className="text-xs block">n (entero)</label>
              <input
                type="number"
                className="rounded border p-1 w-14"
                value={exp}
                onChange={(e) => setExp(Number(e.target.value))}
              />
            </div>
          </div>

          {powSteps.map((eq, i) => (
            <div key={i} className="rounded-lg bg-gray-50 ">
              <BlockMath math={eq} />
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-500">
        En división se usa el conjugado para eliminar la parte imaginaria del
        denominador.
      </p>
    </div>
  );
}
