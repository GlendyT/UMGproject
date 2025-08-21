import { routetype, slugstype } from "@/types/index";

export const LinkRoutes: routetype[] = [
  {
    id: 1,
    name: "Algoritmos",
    href: "/algoritmos",
    bgColor: "bg-blue-300",
    image: "/Algoritmos.webp",
  },
  {
    id: 2,
    name: "Precalculo",
    href: "/precalculo",
    bgColor: "bg-teal-300",
    image: "/precalculo.webp",
  },
  {
    id: 3,
    name: "Algebra Lineal",
    href: "/algebralineal",
    bgColor: "bg-green-300",
    image: "/algebra.webp",
  },
  {
    id: 4,
    name: "Contabilidad II",
    href: "/contabilidad",
    bgColor: "bg-green-100",
    image: "/contabilidad.webp",
  },
  {
    id: 5,
    name: "Matematica Discreta",
    href: "/matematicadiscreta",
    bgColor: "bg-amber-300",
    image: "/matematicadiscreta1.webp",
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
    name: "Geometraia Analítica",
    href: "/precalculo/geometria-analitica",
  },
  {
    id: 3,
    name: "Polinomios",
    href: "/precalculo/polinomios",
  },
  {
    id: 4,
    name: "Gráficas de polinomios",
    href: "/precalculo/graficaspolionmios",
  },
];
