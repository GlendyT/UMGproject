import { ReactNode, JSX } from "react";
import Fraction from "fraction.js";

export interface ProviderProps {
  children: ReactNode;
}

// ---------------- MÉTODO DE CRAMER ----------------

export type Matrix = (number | Fraction)[][];

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
  matrix2: Matrix3x3;
  handleChange2: (i: number, j: number, value: string) => void;
  setMatrix2: (m: Matrix3x3) => void;
  extended: Matrix3x3;
  expr: string;
  redLines: { i: number; j: number; text: number }[];
  blueLines: { i: number; j: number; text: number }[];
  cell: number;
  gap: number;
  rows: number;
  cols: number;
  W: number;
  H: number;
  cx: (j: number) => number;
  cy: (i: number) => number;
  size2: number;
  setSize2: (n: number) => void;
  matrix3: Matrix;
  setMatrix3: (m: Matrix) => void;
  result: { det: Fraction; detVars: Fraction[]; sols: Fraction[] } | null;
  showFraction: boolean;
  setShowFraction: (b: boolean) => void;
  setResult: (
    r: { det: Fraction; detVars: Fraction[]; sols: Fraction[] } | null
  ) => void;
  solve3: () => void;
  handleChange3: (
    e: React.ChangeEvent<HTMLInputElement>,
    row: number,
    col: number
  ) => void;
  handleSizeChange3: (n: number) => void;
  matrixToString: (m: Matrix) => string;
  determinantExpression: (m: Matrix) => string;
  size4: number;
  setSize4: (n: number) => void;
  matrix4: number[][];
  setMatrix4: (m: number[][]) => void;
  handleChange4: (
    e: React.ChangeEvent<HTMLInputElement>,
    row: number,
    col: number
  ) => void;
  handleSizeChange4: (n: number) => void;
  calculateDet: (
    m: number[][],
    showSteps?: boolean
  ) => number | { value: number; steps: string | MinorStep[] };
  mode: string;
  setMode: (m: string) => void;
  index: number;
  setIndex: (i: number) => void;
  signMatrix: string[][];
  laplaceDet: () => { det2: number; steps2: StepData[] };
  det2: number;
  steps2: StepData[];

  //TODO: VECTORES

  mode2: Mode2;
  setMode2: (m: Mode2) => void;
  mag: string;
  setMag: (s: string) => void;
  angleInput: string;
  setAngleInput: (s: string) => void;
  xComp: string;
  setXComp: (s: string) => void;
  yComp: string;
  setYComp: (s: string) => void;
  vectors: { mag?: string; angle?: string; x?: string; y?: string }[];
  setVectors: (
    v: { mag?: string; angle?: string; x?: string; y?: string }[]
  ) => void;
  scalar: string;
  setScalar: (s: string) => void;
  handleCompute: () => void;
  output: JSX.Element[];
  setOutput: (o: JSX.Element[]) => void;
  chartDataAndOptions: {
    labels: string[];
    datasets: {
      label: string;
      data: { x: number; y: number }[];
      drawArrow?: boolean;
      arrowColor?: string;
      borderColor?: string;
      borderWidth?: number;
      pointRadius?: number;
    }[];
    options: object;
  };

  //TODO: VECTORES EN 3D
  pointPx: string;
  setPointPx: (s: string) => void;
  pointPy: string;
  setPointPy: (s: string) => void;
  pointPz: string;
  setPointPz: (s: string) => void;
  parsedPointP: { x: number; y: number; z: number };
  px: number;
  py: number;
  pXAxisX: number;
  pXAxisY: number;
  pYAxisX: number;
  pYAxisY: number;
  pZAxisX: number;
  pZAxisY: number;
  shadowX: number;
  shadowY: number;
  pathX: number;
  pathY: number;
  pathXY: number;
  pathYX: number;
  originX: number;
  originY: number;
  axisLength: number;
  label: string;

  distP2x: string;
  setDistP2x: (s: string) => void;
  distP2y: string;
  setDistP2y: (s: string) => void;
  distP2z: string;
  setDistP2z: (s: string) => void;
  dotProduct: number;
  dotProductSteps: string[];
  mag1: number;
  mag1Steps: string[];
  mag2: number;
  mag2Steps: string[];
  distance: number;
  distanceSteps: string[];
  angleDeg: number;
  angleSteps: string[];
  magnitudeSteps: string[];
  angleSteps2: string[];
  calculatedMagnitude: number;
  oppositeDirection: boolean;
  setOppositeDirection: (b: boolean) => void;
  unitVectorSteps1: string[];
  calculatedUnitVector: { x: number; y: number; z: number } | null;
  mag3: number;

  verificationSteps: string[];
  magnitudeSteps1: string[];
  crossProductSteps: string[];
  crossProduct: { x: number; y: number; z: number };
  crossMagnitude: number;

  pointsSteps: string[];
  vectorSteps: string[];
  crossProductSteps1: string[];
  areaSteps: string[];
  triangleSteps: string[];
  rx: string;
  ry: string;
  rz: string;
  setRx: (s: string) => void;
  setRy: (s: string) => void;
  setRz: (s: string) => void;
  area: number;
  triangleArea: number;
}

export type Mode2 =
  | "polar-to-components"
  | "components-to-polar"
  | "sum-vectors"
  | "subtract-vectors"
  | "scalar-multiplication"
  | "angle-between"
  | "unit-vector";

export type FractionMatrix = Fraction[][];

export type Matrix3x3 = number[][];

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
  generateTruthTableWithSteps: (expr: string) => {
    vars: string[];
    exprToLatex: (expr: string) => string;
    terms: string[];
    table: Record<string, number>[];
  };
  exprToLatex: (expr: string) => string;
  expr: string;
  setExpr: (e: string) => void;
  vars: string[];
  terms: string[];
  table: Record<string, number>[];
}

export type GateType = "AND" | "OR" | "NOT" | "XOR" | "NAND" | "NOR" | "XNOR";

export type youtubeVideos = {
  id: number;
  title: string;
  url: string;
};

export type slugstype = {
  id: number;
  name: string;
  href: string;
  file?: string;
  videos?: youtubeVideos[];
};

export type routetype = {
  id: number;
  name: string;
  href: string;
  bgColor: string;
  image: string;
  subroutes?: slugstype[];
};

export type SemesterType = {
  id: number;
  name: string;
  mainroute: string;
  routes: routetype[];
  bgColor: string;
  image: string;
};

export type Quadrant = 1 | 2 | 3 | 4;

export interface PrecalculoContextType {
  //TODO: ECUACIONES
  equation: string;
  setEquation: (e: string) => void;
  steps: JSX.Element[];
  setSteps: (s: JSX.Element[]) => void;
  parseCoeff: (raw: string | undefined, defOne?: number) => number;
  fracSimplifyLatex: (num: number, den: number) => string;
  isPerfectSquare: (n: number) => boolean;
  factorSquare: (n: number) => [number, number]; // [outside, inside], n>=0
  sqrtDecompLatex: (n: number) => string;
  gcd3: (a: number, b: number, c: number) => number;
  solve: () => void;

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

  //TODO: LIMITES SUPERIORES E INFERIORES
  hornerEval: (coeffs: number[], x: number) => number;
  gcdArray: (arr: number[]) => number;
  toFracLatex: (value: number) => string;
  candidatesByRRT: (
    constant: number,
    leading: number
  ) => { p: number[]; q: number[]; list: number[] };
  syntheticDivision: (
    coeffs: number[],
    r: number
  ) => {
    divisor: number;
    top: number[];
    middle: number[];
    bottom: number[];
    remainder: number;
  };
  polyToLatex: (coeffs: number[]) => string;
  linFactorLatex: (root: number) => string;
  factorQuadraticInt: (
    a: number,
    b: number,
    c: number
  ) => [number, number] | null;
  abs: (value: number) => number;
  reduceFraction: (numerator: number, denominator: number) => [number, number];
  input: string;
  setInput: (s: string) => void;
  run: number;
  setRun: (r: number) => void;
  parsePolynomial2: (s: string) => number[];
  data3: {
    coeffs0: number[];
    p: number[];
    q: number[];
    list: number[];
    upperBoundNoteIndex: number | null;
    partials: string[];
    quadBox: { eqLine: string; factLine?: string } | null;
    finalLatex: string;
    synSteps: SynStep[];
  };

  //TODO: DIVISION DE POLINOMIOS
  parsePolynomialDescending: (s: string) => number[];
  coeffsToLatexDESC: (coeffs: number[]) => string;
  longDivisionDESC: (
    dividend: number[],
    divisor: number[]
  ) => {
    quotient: number[];
    remainder: number[];
    steps2: Step[];
  };
  subtractDESC: (a: number[], b: number[]) => number[];
  scaleDESC: (poly: number[], scalar: number) => number[];
  shiftDESC: (poly: number[], places: number) => number[];
  EPS: number;
  P: string;
  setP: (s: string) => void;
  D: string;
  setD: (s: string) => void;
  dividend: number[];
  divisor: number[];
  result: {
    quotient: number[];
    remainder: number[];
    steps2: Step[];
  } | null;
  quotientLatex: string;
  remainderLatex: string;
  error: string | null;
  VISIBLE_STEPS: number;

  //TODO: DESCARTE DE SIGNOS
  getCoeffsFromPolynomial: (s: string) => { coeffs: number[]; degree: number };
  posiblesCerosRacionales: (coeffs: number[]) => {
    latexListRaw: string;
    latexSimplified: string;
  };
  coloredLatexForTerms: (terms: Term[]) => string;
  buildSubstitutionLatex: (terms: Term[]) => string;
  buildReducedNegLatex: (terms: Term[]) => string;
  gcd2: (a: number, b: number) => number;
  signOf: (n: number) => 1 | -1 | 0;
  input2: string;
  setInput2: (s: string) => void;
  resultado: Resultado | null;
  handleResolver: () => void;
  setResultado: (r: Resultado | null) => void;

  //TODO: NUMEROS COMPLEJOS
  sgn: (n: number) => string;
  abs2: (n: number) => number;
  isInt: (x: number) => boolean;
  complexLatex: (z: Complex, parens?: boolean) => string;
  gcd4: (a: number, b: number) => number;
  gcd5: (a: number, b: number, c: number) => number;
  add: (a: Complex, b: Complex) => Complex;
  sub: (a: Complex, b: Complex) => Complex;
  mul: (a: Complex, b: Complex) => Complex;
  div: (a: Complex, b: Complex) => Complex;
  powerISteps: (n: number) => string[];
  stepsAdd: (a: Complex, b: Complex) => string[];
  stepsSub: (a: Complex, b: Complex) => string[];
  stepsMul: (a: Complex, b: Complex) => string[];
  stepsDiv: (a: Complex, b: Complex, showFraction: boolean) => string[];
  fracLatex: (num: number, den: number) => string;
  a2: Complex;
  setA2: (z: Complex) => void;
  b2: Complex;
  setB2: (z: Complex) => void;
  op: Op;
  setOp: (o: Op) => void;
  exp: number;
  setExp: (e: number) => void;
  showFraction: boolean;
  setShowFraction: (b: boolean) => void;
  prettyResult: string;
  steps2: string[];
  powSteps: string[];

  //TODO: IDENTIDADES FUNDAMENTALES
  simplifyFraction: (num: number, den: number) => [number, number];
  fracLatex2: (num: number, den: number) => string;
  sinNum: number;
  setSinNum: (n: number) => void;
  sinDen: number;
  setSinDen: (n: number) => void;
  quadrant: Quadrant;
  setQuadrant: (q: Quadrant) => void;
  sinFrac: [number, number];
  cosNumSq: number;
  cosDenSq: number;
  cosNum: number;
  cosDen: number;
  cosSimpleNumBase: number;
  cosSimpleDen: number;
  cosSimpleNum: number;
  cscNum: number;
  cscDen: number;
  secNum: number;
  secDen: number;
  tanNum: number;
  tanDen: number;
  cotNum: number;
  cotDen: number;

  //Todo Curvas Seno y Coseno
  generateData: (a: number, k: number) => { x: number; y: number }[];
  a3: number;
  setA3: (n: number) => void;
  k3: number;
  setK3: (n: number) => void;
  amplitude: number;
  periodo: number;
  data4: { x: number; y: number }[];

  //TODO CURVAS SENO Y COSENO DESPLAZADAS
  aStr: string;
  setAStr: (s: string) => void;
  kStr: string;
  setKStr: (s: string) => void;
  bStr: string;
  setBStr: (s: string) => void;
  type: "cos" | "sin";
  setType: (t: "cos" | "sin") => void;
  aNum: number;
  kNum: number;
  bNum: number;
  safeK: number;
  data5: { x: number; y: number }[];
  amplitude2: number;
  periodNumeric: number;
  desfaseNumeric: number;
  aTex: string;
  kTex: string;
  bTex: string;
  periodoPaso1: string;
  periodoPaso2: string;
  periodoEnPiTex: string;
  periodoDecimalTex: string;
  desfasePaso1: string;
  bOverKTex: string;
  funcTex: string;

  //TODO MOVIMIENTO ARMÓNICO SIMPLE
  amplitudeInput: string;
  setAmplitudeInput: (s: string) => void;
  omegaInput: string;
  setOmegaInput: (s: string) => void;
  mode: "sin" | "cos";
  setMode: (m: "sin" | "cos") => void;
  a4: number;
  omegaTex: string;
  periodTex: string;
  frequencyTex: string;
  periodNum: string;
  frequencyNum: string;
  data6: { t: number; y: number }[];

  //TODO MOVIMIENTO ARMÓNICO AMORTIGUADO
  k2: number;
  setK2: (n: number) => void;
  c2: number;
  setC2: (n: number) => void;
  f2: number;
  setF2: (n: number) => void;
  p: number;
  w: number;
  data7: { t: number; y: number; upper: number; lower: number }[];
}

export type SynStep = {
  divisor: number; // r
  top: number[]; // coeficientes de entrada
  middle: number[]; // productos acumulados
  bottom: number[]; // fila resultado (sin el residuo)
  remainder: number; // debe ser 0 si es raíz
};

export type Step = {
  subtrahend: number[]; // divisor*c, desplazado
  remainder: number[]; // resto tras la resta
};

export type Term = { exp: number; coef: number };

export type Resultado = {
  coeffs: number[];
  degree: number;
  terms: Term[];
  latexListRaw: string;
  latexSimplified: string;
  latexPx: string;
  latexPxColored: string;
  latexPminusRaw: string;
  latexPminusReduced: string;
  cambiosPos: number;
  cambiosNeg: number;
};

export type BiquadraticSolverProps = {
  equation: string;
  a: number;
  b: number;
  c: number;
  factorSquare: (n: number) => [number, number];
  sqrtDecompLatex: (n: number) => string;
  fracSimplifyLatex: (num: number, den: number) => string;
  isPerfectSquare: (n: number) => boolean;
  round2: (n: number) => number;
};

export type QuadraticSolverProps = Omit<BiquadraticSolverProps, "round2">;

// ---------------- MÉTODO DE LAPLACE ----------------//
export type MinorStep = {
  element: number;
  sign: number;
  minor: number[][];
  minorValue: number;
  minorSteps: string;
  term: number;
};

export type StepData = {
  element: number;
  sign: number;
  minor: number[][];
  minorValue: number;
  term: number;
  minorSteps: string | MinorStep[] | null;
};

//---- NUMEROS COMPLEJOS---//
export type Complex = { re: number; im: number };
export type Op = "add" | "sub" | "mul" | "div";

export interface Vector {
  x: number;
  y: number;
  z: number;
}

export type CalculatorType =
  | "graph"
  | "distance"
  | "magnitude"
  | "unitVector"
  | "crossProduct"
  | "parallelogramArea";

// --- NUEVOS Componentes de Gráficos ---

export interface ChartInstance {
  ctx: CanvasRenderingContext2D;
  data: {
    datasets: Array<{
      drawArrow?: boolean;
      arrowColor?: string;
      borderColor?: string;
      lineWidth?: number;
    }>;
  };
  getDatasetMeta: (index: number) => {
    data: Array<{
      getProps: (props: string[], final: boolean) => { x: number; y: number };
    }>;
  };
}
