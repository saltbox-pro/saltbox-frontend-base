import { useEffect, useState } from "react";

const SIDER_COLLAPSED_STORAGE_KEY = "saltbox:sider-collapsed";

const getDefaultStorage = (): Storage | undefined => {
  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
};

const readSiderCollapsed = (storage: Storage | undefined): boolean => {
  try {
    return storage?.getItem(SIDER_COLLAPSED_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
};

const writeSiderCollapsed = (storage: Storage | undefined, isCollapsed: boolean): void => {
  try {
    storage?.setItem(SIDER_COLLAPSED_STORAGE_KEY, String(isCollapsed));
  } catch {}
};

export const useSiderCollapsed = (storage: Storage | undefined = getDefaultStorage()) => {
  const [isCollapsed, setIsCollapsed] = useState(() => readSiderCollapsed(storage));

  useEffect(() => {
    writeSiderCollapsed(storage, isCollapsed);
  }, [storage, isCollapsed]);

  const toggleCollapsed = () => {
    setIsCollapsed((prev) => !prev);
  };

  return { isCollapsed, toggleCollapsed };
};
