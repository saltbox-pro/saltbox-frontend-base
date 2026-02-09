import { useMemo } from "react";
import { useLocation } from "react-router";

import { getActiveMenuKeys } from "../../../shared/lib/get-active-menu-keys";
import { BaseMenu } from "../../../shared/ui/base-menu/base-menu";
import { generateMainMenuItems } from "../lib/generate-main-menu-items";

import styles from "./main-menu.module.css";

interface MainMenuProps {
  menu: any[];
  toggleParcelDrawer: (content: any, menuKey: string) => void;
  toggleSubmenuDrawer: (submenu: any[], menuKey: string) => void;
  closeAllDrawers: () => void;
  locale: string;
  activeDrawerKey: string | null;
}

export function MainMenu({
  menu,
  toggleParcelDrawer,
  toggleSubmenuDrawer,
  closeAllDrawers,
  locale,
  activeDrawerKey,
}: MainMenuProps) {
  const location = useLocation();
  const { selectedKeys, openKeys } = useMemo(
    () => getActiveMenuKeys(location.pathname, menu),
    [location.pathname, menu]
  );

  const items = useMemo(
    () =>
      generateMainMenuItems(
        menu,
        toggleParcelDrawer,
        toggleSubmenuDrawer,
        closeAllDrawers,
        locale,
        activeDrawerKey
      ),
    [menu, toggleParcelDrawer, toggleSubmenuDrawer, closeAllDrawers, locale, activeDrawerKey]
  );

  return (
    <BaseMenu
      className={styles.menu}
      selectedKeys={selectedKeys}
      openKeys={openKeys}
      items={items}
    />
  );
}
