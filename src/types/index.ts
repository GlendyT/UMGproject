import { ReactNode } from "react";
import Fraction from "fraction.js";

export interface AlgebraProps {
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
  label: string;
  onClick: () => void;
  disabled?: boolean;
}