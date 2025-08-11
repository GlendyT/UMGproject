import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-red-500">
      <Link href="/algoritmos" className="text-white">
        Ir a Algoritmos
      </Link>
      <Link href="/precalculo" className="text-white">
        Ir a Precalculo
      </Link>
      <Link href="/algebralineal" className="text-white">
        Ir a Algebralineal
      </Link>
      <Link href="/contabilidad" className="text-white">
        Ir a contabilidad
      </Link>
      <Link href="/matematicadiscreta" className="text-white">
        Ir a MatematicaDiscreta
      </Link>
    </div>
  );
}
