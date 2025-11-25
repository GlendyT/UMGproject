import { SemesterType } from "@/types/index";

export const SemesterRoutes: SemesterType[] = [
  {
    id: 1,
    name: "Primer Semestre",
    mainroute: "/primersemestre",
    routes: [],
    image: "/1.webp",
    bgColor: "#75fad7",
  },
  {
    id: 2,
    name: "Segundo Semestre",
    mainroute: "/segundosemestre",
    routes: [
      {
        id: 1,
        name: "Algoritmos",
        href: "/segundosemestre/algoritmos",
        bgColor: "bg-blue-300",
        image: "/Algoritmos.webp",
        subroutes: [
          {
            id: 1,
            name: "Videos Algoritmos",
            href: "/segundosemestre/algoritmos/videos-algoritmos",
            videos: [
              {
                id: 1,
                title: "Algoritmo de Proyecto",
                url: "wvfRwmIksms",
              },
            ],
          },
          {
            id: 2,
            name: "Archivos de Drive",
            href: `/segundosemestre/algoritmos/archivos-drive`,
            file: "https://drive.google.com/drive/folders/1cqIH25UKQGlKZg4XZs_w1Npq9NEVcnMo?usp=drive_link",
          },
        ],
      },
      {
        id: 2,
        name: "Precálculo",
        href: "/segundosemestre/precalculo",
        bgColor: "bg-teal-300",
        image: "/precalculo.webp",
        subroutes: [
          {
            id: 1,
            name: "Ecuaciones",
            href: "/segundosemestre/precalculo/ecuaciones",
          },
          {
            id: 2,
            name: "Geometraía Analítica",
            href: "/segundosemestre/precalculo/geometria-analitica",
          },
          {
            id: 3,
            name: "Polinomios",
            href: "/segundosemestre/precalculo/polinomios",
          },
          {
            id: 4,
            name: "Gráficas de polinomios",
            href: "/segundosemestre/precalculo/graficaspolionmios",
          },
          {
            id: 5,
            name: "División de polinomios",
            href: "/segundosemestre/precalculo/division-de-polinomios",
          },
          {
            id: 6,
            name: "Descarte de Signos",
            href: "/segundosemestre/precalculo/descarte-de-signos",
          },
          {
            id: 7,
            name: "Límites Superiores e Inferiores",
            href: "/segundosemestre/precalculo/limites-superiores-e-inferiores",
          },
          {
            id: 8,
            name: "Números Complejos",
            href: "/segundosemestre/precalculo/numeros-complejos",
          },
          {
            id: 9,
            name: "Identidades Fundamentales",
            href: "/segundosemestre/precalculo/identidades-fundamentales",
          },
          {
            id: 10,
            name: "Curvas Seno y Coseno",
            href: "/segundosemestre/precalculo/curvas-seno-y-coseno",
          },
          {
            id: 11,
            name: "Curvas Seno y Coseno Desplazadas",
            href: "/segundosemestre/precalculo/curvas-seno-y-coseno-desplazadas",
          },
          {
            id: 12,
            name: "Movimiento Armonico Simple",
            href: "/segundosemestre/precalculo/movimiento-armonico-simple",
          },
          {
            id: 13,
            name: "Movimiento Armonico Amortiguado",
            href: "/segundosemestre/precalculo/movimiento-armonico-amortiguado",
          },
          {
            id: 14,
            name: "Videos Precálculo",
            href: "/segundosemestre/precalculo/videos-precalculo",
            videos: [
              {
                id: 1,
                title: "Gráfica de Polinomios",
                url: "Xcme71OEznY",
              },
              {
                id: 2,
                title: "Teorema del Cociente y del Residuo",
                url: "TYftscAUHLA",
              },
              {
                id: 3,
                title: "Movimiento Armonico Amortiguado",
                url: "0Tgh8qOwWMs",
              },
              {
                id: 4,
                title: "Movimiento Armonico Simple",
                url: "iJsDYNX3Th4",
              },
              {
                id: 5,
                title: "Movimiento Armonico Simple Pt.2",
                url: "-NiA91stnoU",
              },
              {
                id: 6,
                title: "Curvas Seno y Coseno Desplazadas",
                url: "yYQ4qUAfCrM",
              },
              {
                id: 7,
                title: "Curvas Seno y Coseno",
                url: "LHE1k3W5S1s",
              },
              {
                id: 8,
                title: "Angulos Dobles",
                url: "bRK9v4QvLS4",
              },
            ],
          },
          {
            id: 15,
            name: "Archivos de Drive",
            href: `/segundosemestre/precalculo/archivos-drive`,
            file: "https://drive.google.com/drive/folders/1bLDdLOgMvMl6kUpS4_i80M0N4nzpDzCr?usp=sharing",
          },
        ],
      },
      {
        id: 3,
        name: "Algebra Lineal",
        href: "/segundosemestre/algebralineal",
        bgColor: "bg-green-300",
        image: "/algebra.webp",
        subroutes: [
          {
            id: 1,
            name: "Método de Gauss",
            href: "/segundosemestre/algebralineal/metodo-gauss",
          },
          {
            id: 2,
            name: "Método de Saruss",
            href: "/segundosemestre/algebralineal/metodo-de-saruss",
          },
          {
            id: 3,
            name: "Método de Laplace",
            href: "/segundosemestre/algebralineal/metodo-de-laplace",
          },
          {
            id: 4,
            name: "Método de Crammer",
            href: "/segundosemestre/algebralineal/metodo-de-cramer",
          },
          {
            id: 5,
            name: "Vectores 2D",
            href: "/segundosemestre/algebralineal/vectores2D",
          },
          {
            id: 6,
            name: "Vectores 3D",
            href: "/segundosemestre/algebralineal/vectores3D",
          },
          {
            id: 7,
            name: "Videos Álgebra Lineal",
            href: "/segundosemestre/algebralineal/videos-algebra-lineal",
            videos: [
              {
                id: 1,
                title: "Matrices en Excel",
                url: "Xocu_g5fBpo",
              },
              {
                id: 2,
                title: "Matrices en Excel Pt.2",
                url: "aMx3IG6JU5w",
              },
              {
                id: 3,
                title: "Proyecto de aplicacion para algebra Lineal",
                url: "jD5WrXq2aQE",
              },
              {
                id: 4,
                title: "Matrices Inversas",
                url: "kbV12K2-DMQ",
              },
              {
                id: 5,
                title: "Vectores",
                url: "J-52F8K6O_4",
              },
            ],
          },
          {
            id: 8,
            name: "Archivos de Drive",
            href: `/segundosemestre/algebralineal/archivos-drive`,
            file: "https://drive.google.com/drive/folders/1IC-IWt4Hz-70pWdKSjurKT8nNe1mVDD9?usp=sharing",
          },
        ],
      },
      {
        id: 4,
        name: "Contabilidad II",
        href: "/segundosemestre/contabilidad",
        bgColor: "bg-green-100",
        image: "/contabilidad.webp",
        subroutes: [
          {
            id: 1,
            name: "Videos Contabilidad II",
            href: "/segundosemestre/contabilidad/videos-contabilidad-ii",
            videos: [
              //   {
              //     id: 1,
              //     title: "Promedio Simple",
              //     url: "it3fEkdHEPE",
              //   },
              {
                id: 2,
                title: "Promedio Simple y Ponderado",
                url: "yfp1GMfEWxM",
              },
              {
                id: 3,
                title: "PEPS",
                url: "VgfpQHdJy7o",
              },
              {
                id: 4,
                title: "UEPS",
                url: "LmVKazcj5-Q",
              },
              {
                id: 5,
                title: "Costeo de Materia Prima",
                url: "gJYITeDoImc",
              },
              {
                id: 6,
                title: "Costeo de Producción",
                url: "LUtor-8h3AQ",
              },
              {
                id: 7,
                title: "Costeo de Producción y Costeo por Órdenes",
                url: "UX1EG9dbG6Y",
              },
              {
                id: 8,
                title: "Punto de Equilibrio",
                url: "SfVuqtduS8A",
              },
              {
                id: 9,
                title: "Punto de Equilibrio Pt.2",
                url: "EZCEzEBXfXE",
              },
              {
                id: 10,
                title: "Flujo de Efectivo",
                url: "Ez384mscsHY",
              },
              {
                id: 11,
                title: " Flujo de Efectivo Pt.2",
                url: "MP3oISirBMY",
              },
              {
                id: 12,
                title: "Flujo de Efectivo Pt.3",
                url: "rc9nznrddvA",
              },
              {
                id: 13,
                title: "Flujo de Efectivo Pt.4",
                url: "hEQVpPRls7w",
              },
              {
                id: 14,
                title: "Flujo de Efectivo Pt.5",
                url: "wqajaZ06tys",
              },
              {
                id: 15,
                title: "Flujo de Efectivo Pt.6",
                url: "jQF60H_SEU8",
              },
            ],
          },
          {
            id: 2,
            name: "Archivos de Drive",
            href: `/segundosemestre/contabilidad/archivos-drive`,
            file: "https://drive.google.com/drive/folders/1l4PZvpoxFMO85cL-exJRuBvyuTCH39RI?usp=sharing",
          },
        ],
      },
      {
        id: 5,
        name: "Matemática Discreta",
        href: "/segundosemestre/matematicadiscreta",
        bgColor: "bg-amber-300",
        image: "/matematicadiscreta1.webp",
        subroutes: [
          {
            id: 1,
            name: "Conversión de binario",
            href: "/segundosemestre/matematicadiscreta/conversion-binario",
          },
          {
            id: 2,
            name: "Compuertas lógicas",
            href: "/segundosemestre/matematicadiscreta/compuertas-logicas",
          },
          {
            id: 3,
            name: "Videos Matemática Discreta",
            href: "/segundosemestre/matematicadiscreta/videos-matematica-discreta",
            videos: [
              {
                id: 1,
                title: "Circuitos",
                url: "YxVevv6J0UU",
              },
              {
                id: 2,
                title: "Circuitos Pt.2",
                url: "oHjHNasHjx8",
              },
              {
                id: 3,
                title: "Circuitos Pt.3",
                url: "gk-c2YuS3_M",
              },
              {
                id: 4,
                title: "Circuitos Pt.4",
                url: "CMaS9FSuHfE",
              },
              {
                id: 5,
                title: "Circuitos Pt.5",
                url: "tkRwfjoUHHk",
              },
              {
                id: 6,
                title: "Circuitos Pt.6",
                url: "lXP1JtJwXFM",
              },
              {
                id: 7,
                title: "Resta de BINARIO por el metodo de complemento a 2",
                url: "7YmF3qon9-M",
              },
              {
                id: 8,
                title: "Comparador de 2 bits",
                url: "hj5V2GYLe6Y",
              },
              {
                id: 9,
                title: "Comparador de 8 bits PT.1",
                url: "EZMn0apBVsU",
              },
              {
                id: 10,
                title: "Comparador de 8 bits PT.2",
                url: "K26Toc-rEzA",
              },
            ],
          },
          {
            id: 4,
            name: "Archivos de Drive",
            href: `/segundosemestre/matematicadiscreta/archivos-drive`,
            file: "https://drive.google.com/drive/folders/1LkQZL204S-4ic5xAeRCdVmra3UF5hhjM?usp=sharing",
          },
        ],
      },
    ],
    image: "/2.webp",
    bgColor: "#facc15",
  },
  {
    id: 3,
    name: "Tercer Semestre",
    mainroute: "/tercersemestre",
    routes: [],
    image: "/3.webp",
    bgColor: "#fca5a5",
  },
];

export const cursos =
  SemesterRoutes.find((route) => route.id === 2)?.routes || [];

// Función para obtener las rutas de un curso específico por su ID
export const getTemasByCursoId = (cursoId: number) => {
  return (
    SemesterRoutes.find((route) => route.id === 2)?.routes.find(
      (r) => r.id === cursoId
    )?.subroutes || []
  );
};

// Exportaciones específicas para cada curso
export const AlgoritmoSlugs = getTemasByCursoId(1); // ID 3 = Algebra Lineal
export const PrecalculoSlugs = getTemasByCursoId(2); // ID 3 = Algebra Lineal
export const AlgebraLinealSlugs = getTemasByCursoId(3); // ID 3 = Algebra Lineal
export const ContabilidadSlugs = getTemasByCursoId(4); // ID 4 = Contabilidad II
export const MatematicaDiscretaSlugs = getTemasByCursoId(5); // ID 5 = Matemática Discreta

// Exportar todos los videos de Algoritmos
export const videoAlgoritmo = AlgoritmoSlugs.flatMap(
  (item) => item.videos || []
);
export const videoPrecalculo = PrecalculoSlugs.flatMap(
  (item) => item.videos || []
);
export const videoAlgebraLineal = AlgebraLinealSlugs.flatMap(
  (item) => item.videos || []
);
export const videoContabilidad = ContabilidadSlugs.flatMap(
  (item) => item.videos || []
);
export const videoMatematicaDiscreta = MatematicaDiscretaSlugs.flatMap(
  (item) => item.videos || []
);

// Exportar todos los archivos de Drive de cada curso
export const driveAlgoritmo =
  AlgoritmoSlugs.find((item) => item.file)?.file || "";
export const drivePrecalculo =
  PrecalculoSlugs.find((item) => item.file)?.file || "";
export const driveAlgebraLineal =
  AlgebraLinealSlugs.find((item) => item.file)?.file || "";
export const driveContabilidad =
  ContabilidadSlugs.find((item) => item.file)?.file || "";
export const driveMatematicaDiscreta =
  MatematicaDiscretaSlugs.find((item) => item.file)?.file || "";
