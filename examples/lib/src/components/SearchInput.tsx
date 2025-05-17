import type React from "react";
import { type ChangeEvent, useEffect, useRef, useState } from "react";

export const SearchInput = ({
  onSearch,
  defaultValue,
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
  useEffect(() => {
    if (!isComposing && ref.current && ref.current.value !== defaultValue) {
      ref.current.value = typeof defaultValue === "string" ? defaultValue : "";
    }
  }, [defaultValue, isComposing]);
  return (
    <input
      {...props}
      defaultValue={defaultValue}
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
