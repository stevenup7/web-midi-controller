import { ReactNode } from "react";

interface Props {
  id: string;
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  children: ReactNode;
}

const Slider = ({ id, min, max, value, onChange, children }: Props) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(parseInt(newValue, 10));
  };

  return (
    <>
      <label htmlFor={id} className="form-label">
        {children}
      </label>
      <input
        type="range"
        className="form-range"
        onChange={handleChange}
        step={1}
        min={min}
        max={max}
        defaultValue={value}
        id={id}
      ></input>
    </>
  );
};

export default Slider;
