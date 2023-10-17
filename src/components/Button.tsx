import { ReactNode } from "react";

interface Props {
  onClick: (data: string) => void;
  onUp?: (data: string) => void;
  onDown?: (data: string) => void;
  data?: string;
  children: ReactNode;
}

const Button = ({ onClick, onUp, onDown, data, children }: Props) => {
  return (
    <button
      type="button"
      className="btn btn-primary"
      onMouseUp={() => {
        if (typeof onUp !== "undefined") {
          onUp(data || "");
        }
      }}
      onMouseDown={() => {
        if (typeof onDown !== "undefined") {
          onDown(data || "");
        }
      }}
      onClick={() => {
        onClick(data || "");
      }}
    >
      {children}
    </button>
  );
};

export default Button;
