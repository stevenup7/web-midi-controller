import { useState } from "react";
import ListItem from "./ListItem";

interface ListItemData {
  id: string;
  text: string;
}

interface Props {
  items: ListItemData[];
  heading: string;
  onSelectItem: (item: string, index: string) => void;
}

function ListGroup(props: Props) {
  const [selectedIndex, setSelectedIndex] = useState(-1);

  return (
    <>
      <h4>{props.heading}</h4>{" "}
      <ul className="list-group">
        {props.items.map((item, i) => {
          return (
            <ListItem
              key={item.id}
              active={selectedIndex == i}
              onClick={() => {
                setSelectedIndex(i);
                props.onSelectItem(item.text, item.id);
              }}
            >
              {item.text}
            </ListItem>
          );
        })}
      </ul>
    </>
  );
}
export type { ListItemData as ListItemData };
export default ListGroup;
