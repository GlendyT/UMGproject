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
    name: "Precálculo",
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
    name: "Matemática Discreta",
    href: "/matematicadiscreta",
    bgColor: "bg-amber-300",
    image: "/matematicadiscreta1.webp",
  },
];

export const MatematicaDiscretaSlugs: slugstype[] = [
  {
    id: 1,
    name: "Conversión de binario",
    href: "/matematicadiscreta/conversion-binario",
  },
  {
    id: 2,
    name: "Compuertas lógicas",
    href: "/matematicadiscreta/compuertas-logicas",
  },
];

export const AlgebraLinealSlugs: slugstype[] = [
  {
    id: 1,
    name: "Método de Gauss",
    href: "/algebralineal/metodo-gauss",
  },
  {
    id: 2,
    name: "Método de Saruss",
    href: "/algebralineal/metodo-de-saruss",
  },
  {
    id: 3,
    name: "Método de Laplace",
    href: "/algebralineal/metodo-de-laplace",
  } /*
  {
    id: 4,
    name: "Vectores",
    href: "/algebralineal/vectores",
  },*/,
];

export const PrecalculoSlugs: slugstype[] = [
  {
    id: 1,
    name: "Ecuaciones",
    href: "/precalculo/ecuaciones",
  },
  {
    id: 2,
    name: "Geometraía Analítica",
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
  {
    id: 5,
    name: "División de polinomios",
    href: "/precalculo/division-de-polinomios",
  },
  {
    id: 6,
    name: "Descarte de Signos",
    href: "/precalculo/descarte-de-signos",
  },
  {
    id: 7,
    name: "Límites Superiores e Inferiores",
    href: "/precalculo/limites-superiores-e-inferiores",
  },
  {
    id: 8,
    name: "Números Complejos",
    href: "/precalculo/numeros-complejos",
  },
  {
    id: 9,
    name: "Trigonometría",
    href: "/precalculo/trigonometria",
  },
];
