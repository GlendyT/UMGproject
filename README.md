# UMG Programs - Plataforma Educativa Matemática

Plataforma web interactiva para el aprendizaje de matemáticas universitarias, incluyendo herramientas de cálculo, visualización y resolución paso a paso de problemas matemáticos.

## 🚀 Stack Tecnológico

### Frontend

| **Technology**   | **Version** | **Description**                   |
| ---------------- | ----------- | --------------------------------- |
| **Next.js**      | 15.4.6      | Framework React con App Router    |
| **React**        | 19.1.0      | Biblioteca de interfaz de usuario |
| **TypeScript**   | 5           | Tipado estático                   |
| **Tailwind CSS** | 4.1.11      | Framework de estilos utilitarios  |

### Librerías Matemáticas

| **Technology**  | **Version** | **Description**                     |
| --------------- | ----------- | ----------------------------------- |
| **MathJS**      | 14.6.0      | Motor de cálculo matemático         |
| **Nerdamer**    | 1.1.13      | Álgebra simbólica                   |
| **Fraction.js** | 5.2.2       | Aritmética de fracciones            |
| **KaTeX**       | 0.16.22     | Renderizado de fórmulas matemáticas |
| **React-KaTeX** | 3.1.0       | Integración de KaTeX con React      |

### Visualización

| **Technology**  | **Version** | **Description**            |
| --------------- | ----------- | -------------------------- |
| **Recharts**    | 3.1.2       | Gráficos y visualizaciones |
| **React Icons** | 5.5.0       | Iconografía                |

### Herramientas de Desarrollo

| **Technology** | **Version** | **Description**              |
| -------------- | ----------- | ---------------------------- |
| **ESLint**     | 9           | Linter de código             |
| **PostCSS**    | 8.5.6       | Procesador de CSS            |
| **Turbopack**  |             | Bundler de desarrollo rápido |

## 📦 Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd UMGprograms

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

## 🏗️ Estructura del Proyecto

```
src/
├── app/                    # App Router de Next.js
│   ├── algebralineal/      # Módulo de Álgebra Lineal
│   ├── algoritmos/         # Módulo de Algoritmos
│   ├── contabilidad/       # Módulo de Contabilidad II
│   ├── matematicadiscreta/ # Módulo de Matemática Discreta
│   ├── precalculo/         # Módulo de Precálculo
│   └── page.tsx           # Página principal
├── components/            # Componentes reutilizables
│   ├── BiquadraticSolver.tsx
│   ├── QuadraticSolver.tsx
│   ├── Tabla.tsx
│   └── ...
├── context/              # Context API para estado global
│   ├── AlgebraProvider.tsx
│   ├── MatematicaDiscretaProvider.tsx
│   └── PrecalculoProvider.tsx
├── hooks/               # Custom hooks
│   ├── useAlgebra.tsx
│   ├── useMatematicaDiscreta.tsx
│   └── usePrecalculo.tsx
├── types/              # Definiciones de tipos TypeScript
│   └── index.ts
└── utils/             # Utilidades y datos
    ├── data/
    ├── BotonBack.tsx
    └── BotonUtil.tsx
```

## 🎯 Funcionalidades

### Álgebra Lineal
- Método de Gauss
- Método de Saruss
- Método de Laplace
- Método de Cramer
- Resolución de sistemas de ecuaciones

### Precálculo
- Resolución de ecuaciones cuadráticas y bicuadráticas
- Geometría analítica
- Operaciones con polinomios
- Gráficas de funciones
- División de polinomios
- Números complejos
- Límites superiores e inferiores

### Matemática Discreta

- Conversión binario-decimal
- Compuertas lógicas
- Tablas de verdad

## 🏛️ Principios SOLID Aplicados

### Single Responsibility Principle (SRP)

- **[QuadraticSolver.tsx](src/components/QuadraticSolver.tsx)**: Componente dedicado únicamente a resolver ecuaciones cuadráticas
- **[BotonUtil.tsx](src/utils/BotonUtil.tsx)**: Componente reutilizable solo para botones con funcionalidad específica
- **[usePrecalculo.tsx](src/hooks/usePrecalculo.tsx)**: Hook personalizado que abstrae únicamente la lógica del contexto de precálculo
- Separación clara entre lógica de negocio (contextos) y presentación (componentes)

### Open/Closed Principle (OCP)

- **[BotonUtilProps](src/types/index.ts)**: Interface extensible que permite nuevas propiedades sin modificar el componente base
- **[PrecalculoContextType](src/types/index.ts)**: Interface que permite agregar nuevas funcionalidades matemáticas sin romper implementaciones existentes
- Estructura modular en `/app` que permite agregar nuevos módulos matemáticos sin modificar código existente

### Liskov Substitution Principle (LSP)

- **[QuadraticSolverProps & BiquadraticSolverProps](src/types/index.ts)**: Interfaces consistentes que garantizan intercambiabilidad entre solucionadores
- **[routetype & slugstype](src/types/index.ts)**: Tipos que mantienen contratos consistentes para navegación
- Componentes de resolución matemática intercambiables que respetan las mismas interfaces

### Interface Segregation Principle (ISP)

- **[AlgebraContextType](src/types/index.ts)**: Interface específica solo para operaciones de álgebra lineal
- **[MatematicaDiscretaContextType](src/types/index.ts)**: Interface segregada para matemática discreta
- **[PrecalculoContextType](src/types/index.ts)**: Interface específica para precálculo, sin dependencias innecesarias
- Separación de contextos por módulo evitando interfaces monolíticas

### Dependency Inversion Principle (DIP)

- **[PrecalculoProvider.tsx](src/context/PrecalculoProvider.tsx)**: Implementación concreta que depende de abstracciones (interfaces)
- **[usePrecalculo.tsx](src/hooks/usePrecalculo.tsx)**: Hook que abstrae la dependencia del contexto específico
- **[QuadraticSolver.tsx](src/components/QuadraticSolver.tsx)**: Componente que recibe funciones como props en lugar de depender de implementaciones concretas
- Context API como capa de abstracción que invierte las dependencias entre componentes y lógica de negocio

## 🛠️ Scripts Disponibles

```bash
# Desarrollo con Turbopack
npm run dev

# Construcción para producción
npm run build

# Iniciar servidor de producción
npm start

# Linting
npm run lint
```

## 📁 Configuración

### TypeScript

- Target: ES2020
- Strict mode habilitado
- Path mapping configurado para imports absolutos
- Resolución de módulos optimizada

### Tailwind CSS

- Configuración PostCSS integrada
- Clases utilitarias para diseño responsivo
- Optimización automática de CSS no utilizado

### Next.js

- App Router habilitado
- Optimización de imágenes automática
- Soporte para TypeScript nativo

## 🚀 Despliegue

El proyecto está optimizado para despliegue en Vercel:

```bash
# Construcción optimizada
npm run build

# Verificar construcción localmente
npm start
```

## 📚 Recursos Adicionales

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [KaTeX Documentation](https://katex.org/docs/api.html)
