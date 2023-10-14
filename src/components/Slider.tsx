import { ReactNode, useState } from "react";

interface Props {
  id: string;
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  children: ReactNode;
}

const Slider = ({ id, min, max, value, onChange, children }: Props) => {
  const [currVal, updateCurrVal] = useState(value);
  const defualtVal = value;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    updateCurrVal(newValue);
    onChange(newValue);
  };

  const handleDoubleClick = () => {
    updateCurrVal(defualtVal);
    onChange(defualtVal);
  };

  return (
    <>
      oo<i className="bi bi-play"></i>pp
      <label htmlFor={id} className="form-label">
        {children}&nbsp;{currVal}
      </label>
      <input
        type="range"
        className="form-range"
        onChange={handleChange}
        onDoubleClick={handleDoubleClick}
        step={1}
        min={min}
        max={max}
        value={currVal}
        id={id}
      ></input>
    </>
  );
};

export default Slider;
