import { MatematicaDiscretaSlugs } from "@/utils/data/routes";
import Link from "next/link";
import React from "react";

const MatematicaDiscreta = () => {
  return (
    <div>
      <div className="">
        {MatematicaDiscretaSlugs.map((slug) => (
          <div key={slug.id} className="mb-4">
            <Link
              href={slug.href}
              className="text-lg font-semibold text-blue-600 hover:underline"
            >
              {slug.name}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatematicaDiscreta;
