import { ReactNode } from "react";

interface Props {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}

function ListItem({ active = false, onClick, children }: Props) {
  return (
    <li
      className={active ? "list-group-item active" : "list-group-item"}
      onClick={onClick}
    >
      {children}
    </li>
  );
}

export default ListItem;
