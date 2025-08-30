// Verificación paso a paso del determinante 4x4
const matrix = [
  [4, -1, 6, -2],
  [7, 3, -4, 9],
  [5, 1, -1, -3],
  [2, -5, 1, 7]
];

function calculateDet(m) {
  const n = m.length;
  if (n === 1) return m[0][0];
  if (n === 2) return m[0][0] * m[1][1] - m[0][1] * m[1][0];
  
  let det = 0;
  console.log(`Calculando determinante ${n}x${n}:`);
  
  for (let j = 0; j < n; j++) {
    const sign = j % 2 === 0 ? 1 : -1;
    const element = m[0][j];
    const minor = m.slice(1).map(row => row.filter((_, c) => c !== j));
    const minorDet = calculateDet(minor);
    const term = sign * element * minorDet;
    
    console.log(`${sign > 0 ? '+' : '-'}(${element}) × det(minor) = ${sign > 0 ? '+' : '-'}(${element}) × (${minorDet}) = ${term}`);
    det += term;
  }
  
  console.log(`Total: ${det}\n`);
  return det;
}

console.log("Expandiendo por primera fila:");
const result = calculateDet(matrix);
console.log("Resultado final:", result);