import { useState } from "react";

export const useLastOpenValue = <T>(value: T, isOpen: boolean): T => {
  const [lastOpenValue, setLastOpenValue] = useState(value);

  if (isOpen && !Object.is(lastOpenValue, value)) {
    setLastOpenValue(value);
  }

  return isOpen ? value : lastOpenValue;
};
