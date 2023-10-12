import { ReactNode } from "react";

interface Props {
  onClick: () => void;
  children: ReactNode;
}

const Button = ({ onClick, children }: Props) => {
  const clickHandler = () => {
    onClick();
  };
  return <button onClick={clickHandler}>{children}</button>;
};

export default Button;
