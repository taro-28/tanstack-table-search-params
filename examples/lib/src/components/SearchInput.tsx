import type React from "react";
import { type ChangeEvent, useRef, useState } from "react";

export const SearchInput = ({
  onSearch,
  ...props
}: Omit<React.JSX.IntrinsicElements["input"], "onChange"> & {
  onSearch: (value: string) => void;
}) => {
  const ref = useRef<HTMLInputElement>(null);
  const [isComposing, setIsComposing] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (isComposing) return;
    onSearch(e.target.value);
  };
  const handleCompositionStart = () => setIsComposing(true);
  const handleCompositionEnd = () => {
    setIsComposing(false);
    onSearch(ref.current?.value ?? "");
  };
  return (
    <input
      {...props}
      ref={ref}
      type="text"
      className={`border rounded-md px-2 ${props.className ?? ""}`}
      placeholder="Search..."
      onChange={handleChange}
      onCompositionStart={handleCompositionStart}
      onCompositionEnd={handleCompositionEnd}
    />
  );
};
