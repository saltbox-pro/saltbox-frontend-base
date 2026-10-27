import type { MenuProps } from "antd";
import type { ReactNode } from "react";

import { resolveMenuLabel } from "../../../shared/lib/resolve-menu-label";
import type { MenuEntry } from "../../../shared/model/menu";
import { renderMenuEntryLink } from "../../../shared/ui/menu-entry-link/render-menu-entry-link";
import { type MenuIcon, MenuItemIcon } from "../../../shared/ui/menu-item-icon/menu-item-icon";
import { SIDER_MENU_ITEM_OVERLAY_OPEN_CLASS } from "../../../shared/ui/sider-menu/constants";

interface GenerateMainMenuItemsParams {
  config: MenuEntry[];
  locale: string;
  activeDrawerKey: string | null;
  isCollapsed: boolean;
  toggleParcelDrawer: (content: unknown, menuKey: string) => void;
  toggleSubmenuDrawer: (submenu: MenuEntry[], menuKey: string) => void;
  closeAllDrawers: () => void;
}

type MenuItems = NonNullable<MenuProps["items"]>;

const getMenuItemIcon = (
  icon: MenuIcon | undefined,
  label: string,
  isCollapsed: boolean
): ReactNode => {
  if (icon) {
    return <MenuItemIcon icon={icon} />;
  }

  return isCollapsed ? <span>{label.charAt(0)}</span> : undefined;
};

export const generateMainMenuItems = ({
  config,
  locale,
  activeDrawerKey,
  isCollapsed,
  toggleParcelDrawer,
  toggleSubmenuDrawer,
  closeAllDrawers,
}: GenerateMainMenuItemsParams): MenuItems => {
  const items: MenuItems = [];
  const getOverlayClassName = (key: string) =>
    activeDrawerKey === key ? SIDER_MENU_ITEM_OVERLAY_OPEN_CLASS : undefined;

  const toMenuItem = (entry: MenuEntry): MenuItems[number] => {
    const label = resolveMenuLabel(entry.label, locale);
    const icon = getMenuItemIcon(entry.icon, label, isCollapsed);
    const { submenu, drawer } = entry;

    if (submenu) {
      return {
        key: entry.key,
        icon,
        label,
        onClick: () => toggleSubmenuDrawer(submenu, entry.key),
        className: getOverlayClassName(entry.key),
      };
    }

    return {
      key: entry.key,
      icon,
      label: renderMenuEntryLink(entry, label),
      onClick: drawer ? () => toggleParcelDrawer(drawer, entry.key) : closeAllDrawers,
      className: getOverlayClassName(entry.key),
    };
  };

  config.forEach((item) => {
    if (!item.children) {
      items.push(toMenuItem(item));
      return;
    }

    if (item.children.length > 0 && items.length > 0) {
      items.push({ type: "divider", key: `${item.key}-divider` });
    }

    items.push(...item.children.map(toMenuItem));
  });

  return items;
};
