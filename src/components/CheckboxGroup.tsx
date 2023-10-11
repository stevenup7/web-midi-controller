import { ChangeEvent } from "react";

interface CheckboxItemData {
  id: string;
  text: string;
}

interface Props {
  items: CheckboxItemData[];
  onSelectItem: (text: string, id: string, state: boolean) => void;
}

function CheckboxGroup(props: Props) {
  const handleChange = (
    e: ChangeEvent<HTMLInputElement>,
    item: CheckboxItemData
  ) => {
    props.onSelectItem(item.text, item.id, e.target.checked);
  };
  return (
    <>
      {props.items.map((item, i) => {
        return (
          <div className="form-check form-switch" key={i}>
            <input
              className="form-check-input"
              type="checkbox"
              id={item.id}
              onChange={(e) => {
                handleChange(e, item);
              }}
            />
            <label className="form-check-label" htmlFor={item.id}>
              {item.text}
            </label>
          </div>
        );
      })}
    </>
  );
}
export type { CheckboxItemData as CheckboxItemData };
export default CheckboxGroup;
