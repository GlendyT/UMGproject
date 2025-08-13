"use client";

import MatematicaDiscretaContext from "@/context/MatematicaDiscretaProvider";
import { useContext } from "react";

const useMatematicaDiscreta = () => {
  return useContext(MatematicaDiscretaContext);
};
export default useMatematicaDiscreta;
