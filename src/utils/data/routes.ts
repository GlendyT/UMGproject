import { routetype, slugstype } from "@/types/index";

export const LinkRoutes: routetype[] = [
  {
    id: 1,
    name: "Algoritmos",
    href: "/algoritmos",
    bgColor: "bg-amber-200",
  },
  {
    id: 2,
    name: "Precalculo",
    href: "/precalculo",
    bgColor: "bg-teal-200",
  },
  {
    id: 3,
    name: "Algebra Lineal",
    href: "/algebralineal",
    bgColor: "bg-red-200",
  },
  {
    id: 4,
    name: "Contabilidad II",
    href: "/contabilidad",
    bgColor: "bg-blue-200",
  },
  {
    id: 5,
    name: "Matematica Discreta",
    href: "/matematicadiscreta",
    bgColor: "bg-purple-200",
  },
];

export const MatematicaDiscretaSlugs: slugstype[] = [
  {
    id: 1,
    name: "Conversion de binario",
    href: "/matematicadiscreta/conversion-binario",
  },
  {
    id: 2,
    name: "Compuertas logicas",
    href: "/matematicadiscreta/compuertas-logicas",
  },
];

export const AlgebraLinealSlugs: slugstype[] = [
  {
    id: 1,
    name: "Metodo de Gauss",
    href: "/algebralineal/metodo-gauss",
  },
];

export const PrecalculoSlugs: slugstype[] = [
  {
    id: 1,
    name: "Ecuaciones",
    href: "/precalculo/ecuaciones",
  },
  {
    id: 2,
    name: "Geometraia Analitica",
    href: "/precalculo/geometria-analitica",
  },
  {
    id: 3,
    name: "Polinomios",
    href: "/precalculo/polinomios",
  },
  {
    id: 4,
    name: "Graficas de polinomios",
    href: "/precalculo/graficaspolionmios",
  }
];
