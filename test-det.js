// Función simple para calcular determinante
function calculateDet(m) {
  const n = m.length;
  if (n === 1) return m[0][0];
  if (n === 2) return m[0][0] * m[1][1] - m[0][1] * m[1][0];
  
  let det = 0;
  for (let j = 0; j < n; j++) {
    const sign = j % 2 === 0 ? 1 : -1;
    const minor = m.slice(1).map(row => row.filter((_, c) => c !== j));
    det += sign * m[0][j] * calculateDet(minor);
  }
  return det;
}

// Matriz de prueba
const matrix = [
  [4, -1, 6, -2],
  [7, 3, -4, 9],
  [5, 1, -1, -3],
  [2, -5, 1, 7]
];

console.log("Determinante:", calculateDet(matrix));