import { ReactNode, JSX } from "react";
import Fraction from "fraction.js";

export interface ProviderProps {
  children: ReactNode;
}

export interface AlgebraContextType {
  size: number;
  matrix: string[][];
  steps: string[];
  solution: Fraction[] | null;
  setSize: (n: number) => void;
  setMatrix: (m: string[][]) => void;
  setSteps: (s: string[]) => void;
  setSolution: (s: Fraction[] | null) => void;
  handleChange: (row: number, col: number, value: string) => void;
  handleSizeChange: (n: number) => void;
  solve: () => void;
  formatNumber: (val: Fraction) => string;
  printMatrix: (m: FractionMatrix) => string;
  nuevo: () => void;
}

export type FractionMatrix = Fraction[][];

export interface BotonUtilProps {
  className: string;
  label?: string;
  onClick: () => void;
  disabled?: boolean;
  icon?: ReactNode;
}

export type Mode = "bin2dec" | "dec2bin";

export type BinTerm = {
  bit: 0 | 1;
  exp: number; // exponente
  power: bigint; // 2^exp
  product: bigint; // bit * power
};

export type DivRow = {
  dividend: bigint;
  quotient: bigint;
  remainder: 0n | 1n;
};

export interface MatematicaDiscretaContextType {
  //TODO: CONVERSOR DE BINARIO A DECIMAL
  mode: Mode;
  setMode: (m: Mode) => void;
  isBinary: (s: string) => boolean;
  isDecimal: (s: string) => boolean;
  binaryToDecimalSteps: (binary: string) => {
    terms: BinTerm[];
    total: bigint;
  };
  decimalToBinarySteps: (decimal: string) => {
    rows: DivRow[];
    binary: string;
  };
  binInput: string;
  setBinInput: (s: string) => void;
  binValid: boolean;
  binResult: ReturnType<
    MatematicaDiscretaContextType["binaryToDecimalSteps"]
  > | null;
  decInput: string;
  setDecInput: (s: string) => void;
  decValid: boolean;
  decResult: ReturnType<
    MatematicaDiscretaContextType["decimalToBinarySteps"]
  > | null;

  //TODO: CONVERSOR DE COMPUERTAS LOGICAS
  gatesLogic: Record<GateType, (a: number, b?: number) => number>;
  evaluateExpression: (expr: string, values: Record<string, number>) => number;
  getVariablesFromExpression: (expr: string) => string[];
  generateTruthTableFromExpression: (
    expr: string,
    vars: string[]
  ) => { table: Record<string, number>[]; vars: string[] };
  GateSymbol: React.FC<{
    gate: GateType;
    a: number;
    b?: number;
  }>;
  gate: GateType;
  setGate: (g: GateType) => void;
  expr: string;
  setExpr: (e: string) => void;
  vars: string[];
  table: Record<string, number>[];
}

export type GateType = "AND" | "OR" | "NOT" | "XOR" | "NAND" | "NOR" | "XNOR";

export interface routetype {
  id: number;
  name: string;
  href: string;
  bgColor?: string;
}

export interface slugstype {
  id: number;
  name: string;
  href: string;
}

export interface PrecalculoContextType {
  //TODO: ECUACIONES
  equation: string;
  setEquation: (e: string) => void;
  steps: JSX.Element | null;

  //TODO: GEOMETRIA ANALITICA
  setPuntoP: (p: { x: number; y: number }) => void;
  puntoP: { x: number; y: number };
  round2: (v: number) => number;
  x1: number;
  y1: number;
  puntoQ: { x: number; y: number };
  setPuntoQ: (q: { x: number; y: number }) => void;
  x2: number;
  y2: number;
  distancia: number;
  puntoMedio: { x: number; y: number };
  pendiente: number;
  ecuacionPasos: string[];

  //TODO: POLIONOMIOS
  a: number;
  b: number;
  c: number;
  setA: (a: number) => void;
  setB: (b: number) => void;
  setC: (c: number) => void;
  useFractions: boolean;
  setUseFractions: (f: boolean) => void;
  paso1: string;
  paso2: string;
  paso3: string;
  paso4: string;
  paso5: string;
  extremo: "mínimo" | "máximo";
  h: number;
  k: number;
  formatNumber: (value: number) => string;
  data: { x: number; y: number }[];

  //TODO: GRAFICOS DE POLINOMIOS
  gLatex: string;
  polynomialExpr: string;
  handlePolynomialChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  factorization: {
    expandedForm: string;
    factorsForm: string;
    equationForm: string;
    rootsForm: string;
    hasMultipleRoots: boolean;
    multipleRootValue?: number;
  };
  roots: { x: number; y: number }[];
  criticalPoints: {
    x: number;
    y: number;
    type: "max" | "min" | "inflection";
    label?: string;
  }[];
  data2: { x: number; y: number }[];
  xMin: number;
  xMax: number;
}

export type StepsPrecalculoProps = {
  a: number;
  b: number;
  c: number;
  b2: number;
  fourac: number;
  disc: number;
  sqrtDiscR: number;
  twoA: number;
  x1R: number;
  x2R: number;
  w1R: number;
  w2R: number;
  x3R: number;
  round2: (value: number) => number;
};

export type Steps2PrecalculoProps = Omit<
  StepsPrecalculoProps,
  "w1R" | "x3R" | "w2R"
>;
