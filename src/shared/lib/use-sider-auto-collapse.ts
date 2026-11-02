import { useCallback, useState } from "react";

interface SiderCollapsedState {
  isCollapsed: boolean;
  toggleCollapsed: () => void;
}

export const useSiderAutoCollapse = ({
  isCollapsed: isCollapsedByUser,
  toggleCollapsed: toggleCollapsedByUser,
}: SiderCollapsedState) => {
  const [isAutoCollapsed, setIsAutoCollapsed] = useState(false);

  const autoCollapse = useCallback(() => {
    if (!isCollapsedByUser) setIsAutoCollapsed(true);
  }, [isCollapsedByUser]);

  const releaseAutoCollapse = useCallback(() => {
    setIsAutoCollapsed(false);
  }, []);

  const toggleCollapsed = useCallback(() => {
    if (isAutoCollapsed) {
      setIsAutoCollapsed(false);
      return;
    }

    toggleCollapsedByUser();
  }, [isAutoCollapsed, toggleCollapsedByUser]);

  return {
    isCollapsed: isCollapsedByUser || isAutoCollapsed,
    toggleCollapsed,
    autoCollapse,
    releaseAutoCollapse,
  };
};
