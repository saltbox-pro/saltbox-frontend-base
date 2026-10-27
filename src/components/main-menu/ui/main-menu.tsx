import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";

import { getActiveMenuKeys } from "../../../shared/lib/get-active-menu-keys";
import type { MenuEntry } from "../../../shared/model/menu";
import { MenuItemIcon } from "../../../shared/ui/menu-item-icon/menu-item-icon";
import { SIDER_MENU_ITEM_OVERLAY_OPEN_CLASS } from "../../../shared/ui/sider-menu/constants";
import { SiderMenu } from "../../../shared/ui/sider-menu/sider-menu";
import { generateMainMenuItems } from "../lib/generate-main-menu-items";

import styles from "./main-menu.module.css";

const MORE_MENU_KEY = "more-menu";

interface MoreMenuItem {
  entries: MenuEntry[];
  isOpen: boolean;
  onToggle: () => void;
}

interface MainMenuProps {
  menu: MenuEntry[];
  more: MoreMenuItem | null;
  toggleParcelDrawer: (content: unknown, menuKey: string) => void;
  toggleSubmenuDrawer: (submenu: MenuEntry[], menuKey: string) => void;
  closeAllDrawers: () => void;
  locale: string;
  activeDrawerKey: string | null;
  isCollapsed: boolean;
}

export function MainMenu({
  menu,
  more,
  toggleParcelDrawer,
  toggleSubmenuDrawer,
  closeAllDrawers,
  locale,
  activeDrawerKey,
  isCollapsed,
}: MainMenuProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const moreEntries = more?.entries;

  const { selectedKeys, openKeys } = useMemo(() => {
    const activeKeys = getActiveMenuKeys(location.pathname, menu);
    const isMoreActive =
      !!moreEntries && getActiveMenuKeys(location.pathname, moreEntries).selectedKeys.length > 0;

    return isMoreActive
      ? { ...activeKeys, selectedKeys: [...activeKeys.selectedKeys, MORE_MENU_KEY] }
      : activeKeys;
  }, [location.pathname, menu, moreEntries]);

  const menuItems = useMemo(
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
      locale,
      activeDrawerKey,
      isCollapsed,
      toggleParcelDrawer,
      toggleSubmenuDrawer,
      closeAllDrawers,
    ]
  );

  const items = more
    ? [
        ...menuItems,
        ...(menuItems.length > 0
          ? [{ type: "divider" as const, key: `${MORE_MENU_KEY}-divider` }]
          : []),
        {
          key: MORE_MENU_KEY,
          icon: <MenuItemIcon icon="dashboard_customize" />,
          label: t("mainmenu.more-button"),
          onClick: more.onToggle,
          className: more.isOpen ? SIDER_MENU_ITEM_OVERLAY_OPEN_CLASS : undefined,
        },
      ]
    : menuItems;

  return (
    <SiderMenu
      className={styles.menu}
      selectedKeys={selectedKeys}
      openKeys={openKeys}
      items={items}
    />
  );
}
