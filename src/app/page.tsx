import { LinkRoutes } from "@/utils/data/routes";
import Link from "next/link";

export default function Home() {
  return (
    <section className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        {LinkRoutes.map((route) => (
          <Link
            key={route.id}
            href={route.href}
            className="text-2xl hover:underline"
          >
            {route.name}
          </Link>
        ))}
      </div>
    </section>
  );
}
