import type React from "react";
import { type ChangeEvent, useRef, useState } from "react";

export const SearchInput = (
  props: Omit<React.JSX.IntrinsicElements["input"], "onChange"> & {
    onSearch: (value: string) => void;
  },
) => {
  const ref = useRef<HTMLInputElement>(null);
  const [isComposing, setIsComposing] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (isComposing) return;
    props.onSearch(e.target.value);
  };
  const handleCompositionStart = () => setIsComposing(true);
  const handleCompositionEnd = () => {
    setIsComposing(false);
    props.onSearch(ref.current?.value ?? "");
  };
  return (
    <input
      {...props}
      ref={ref}
      type="text"
      className={`border ${props.className ?? ""}`}
      placeholder="Search..."
      onChange={handleChange}
      onCompositionStart={handleCompositionStart}
      onCompositionEnd={handleCompositionEnd}
    />
  );
};
