import { ChangeEvent } from "react";

interface CheckboxItemData {
  id: string;
  text: string;
  checked: boolean;
}

interface Props {
  items: CheckboxItemData[];
  style?: string;
  onSelectItem: (text: string, id: string, state: boolean) => void;
}

function CheckboxGroup(props: Props) {
  let cbStyle = "switch";
  if (typeof props.style !== "undefined") {
    cbStyle = props.style;
  }
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
          <div
            className={
              props.style === "switch" ? "form-check form-switch" : "form-check"
            }
            key={i}
          >
            <input
              className="form-check-input"
              type="checkbox"
              id={item.id}
              onChange={(e) => {
                handleChange(e, item);
              }}
              defaultChecked={item.checked}
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
