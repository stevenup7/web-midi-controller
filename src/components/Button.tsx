import { ReactNode } from "react";

interface Props {
  onClick: (data: string) => void;
  data: string;
  children: ReactNode;
}

const Button = ({ onClick, data, children }: Props) => {
  return (
    <button
      onClick={() => {
        onClick(data);
      }}
    >
      {children}
    </button>
  );
};

export default Button;
