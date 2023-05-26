import { useState } from "react";

export const useInput = (initState: string | number) => {
  const [value, setValue] = useState(initState);
  const onChange = (e: any) => {
    const { value } = e.target;
    setValue(value);
  };

  return { value, onChange };
};
