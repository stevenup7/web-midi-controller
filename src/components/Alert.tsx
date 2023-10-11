import { ReactNode } from "react";

interface Props {
  type?: string;
  children: ReactNode;
}

const Alert = ({ type = "alert-warning", children }: Props) => {
  return (
    <div className={"alert " + type} role="alert">
      {children}
    </div>
  );
};

export default Alert;
