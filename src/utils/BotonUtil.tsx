import { BotonUtilProps } from "../types";

const BotonUtil = ({
  className,
  label,
  onClick,
  disabled,
  icon,
}: BotonUtilProps) => {
  return (
    <button
      className={`${className} transition-all duration-500 cursor-pointer px-2 py-2 font-extrabold text-xl rounded-lg hover:opacity-80 `}
      onClick={onClick}
      disabled={disabled}
    >
      {label} {icon}
    </button>
  );
};

export default BotonUtil;
