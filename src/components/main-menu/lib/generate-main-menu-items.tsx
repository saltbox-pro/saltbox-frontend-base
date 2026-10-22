import type { MenuProps } from "antd";
import type { ReactNode } from "react";
import { Link } from "react-router";

import { resolveMenuLabel } from "../../../shared/lib/resolve-menu-label";
import { type MenuIcon, MenuItemIcon } from "../../../shared/ui/menu-item-icon/menu-item-icon";
import { SIDER_MENU_ITEM_OVERLAY_OPEN_CLASS } from "../../../shared/ui/sider-menu/constants";

interface GenerateMainMenuItemsParams {
  config: any[];
  locale: string;
  activeDrawerKey: string | null;
  isCollapsed: boolean;
  toggleParcelDrawer: (content: any, menuKey: string) => void;
  toggleSubmenuDrawer: (submenu: any[], menuKey: string) => void;
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

  config.forEach((item) => {
    if (!item.children) {
      const label = resolveMenuLabel(item.label, locale);

      items.push({
        key: item.key,
        icon: getMenuItemIcon(item.icon, label, isCollapsed),
        label: item.path ? <Link to={item.path}>{label}</Link> : label,
      });
      return;
    }

    if (item.children.length > 0 && items.length > 0) {
      items.push({ type: "divider", key: `${item.key}-divider` });
    }

    item.children.forEach((child: any) => {
      const label = resolveMenuLabel(child.label, locale);
      const icon = getMenuItemIcon(child.icon, label, isCollapsed);

      if (child.submenu) {
        items.push({
          key: child.key,
          icon,
          label,
          onClick: () => toggleSubmenuDrawer(child.submenu, child.key),
          className: getOverlayClassName(child.key),
        });
        return;
      }

      items.push({
        key: child.key,
        icon,
        label: child.path && !child.drawer ? <Link to={child.path}>{label}</Link> : label,
        onClick: child.drawer ? () => toggleParcelDrawer(child.drawer, child.key) : closeAllDrawers,
        className: getOverlayClassName(child.key),
      });
    });
  });

  return items;
};
