import { useMemo } from "react";
import { useLocation } from "react-router";

import { getActiveMenuKeys } from "../../../shared/lib/get-active-menu-keys";
import { SiderMenu } from "../../../shared/ui/sider-menu/sider-menu";
import { generateMainMenuItems } from "../lib/generate-main-menu-items";

import styles from "./main-menu.module.css";

interface MainMenuProps {
  menu: any[];
  toggleParcelDrawer: (content: any, menuKey: string) => void;
  toggleSubmenuDrawer: (submenu: any[], menuKey: string) => void;
  closeAllDrawers: () => void;
  locale: string;
  activeDrawerKey: string | null;
  isCollapsed: boolean;
}

export function MainMenu({
  menu,
  toggleParcelDrawer,
  toggleSubmenuDrawer,
  closeAllDrawers,
  locale,
  activeDrawerKey,
  isCollapsed,
}: MainMenuProps) {
  const location = useLocation();
  const { selectedKeys, openKeys } = useMemo(
    () => getActiveMenuKeys(location.pathname, menu),
    [location.pathname, menu]
  );

  const items = useMemo(
    () =>
      generateMainMenuItems({
        config: menu,
        locale,
        activeDrawerKey,
        isCollapsed,
        toggleParcelDrawer,
        toggleSubmenuDrawer,
        closeAllDrawers,
      }),
    [
      menu,
      toggleParcelDrawer,
      toggleSubmenuDrawer,
      closeAllDrawers,
      locale,
      activeDrawerKey,
      isCollapsed,
    ]
  );

  return (
    <SiderMenu
      className={styles.menu}
      selectedKeys={selectedKeys}
      openKeys={openKeys}
      items={items}
    />
  );
}
