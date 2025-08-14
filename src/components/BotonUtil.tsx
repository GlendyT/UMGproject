import { BotonUtilProps } from "@/types";

const BotonUtil = ({ className, label, onClick, disabled }: BotonUtilProps) => {
  return (
    <button
      className={`${className} cursor-pointer px-2 py-2 font-extrabold text-xl rounded-xl hover:opacity-80 `}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default BotonUtil;
