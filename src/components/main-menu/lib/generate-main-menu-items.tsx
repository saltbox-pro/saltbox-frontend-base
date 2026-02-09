import type { MenuProps } from "antd";
import { Link } from "react-router";

import { MenuItemLabel } from "../../../shared/ui/menu-item-label/menu-item-label";

export const generateMainMenuItems = (
  config: any[],
  toggleParcelDrawer: (content: any, menuKey: string) => void,
  toggleSubmenuDrawer: (submenu: any[], menuKey: string) => void,
  closeAllDrawers: () => void,
  locale: string,
  activeDrawerKey?: string | null
): MenuProps["items"] => {
  const items: MenuProps["items"] = [];
  config.forEach((item) => {
    if (item.children) {
      items.push({
        type: "group",
        key: item.key,
        label: item.label,
      });

      item.children.forEach((child) => {
        const elementLabel = typeof child.label === "object" ? child.label[locale] : child.label;

        if (child.submenu) {
          items.push({
            key: child.key,
            label: <MenuItemLabel icon={child.icon} label={elementLabel} />,
            onClick: () => toggleSubmenuDrawer(child.submenu, child.key),
            className: activeDrawerKey === child.key ? "drawer-active" : undefined,
          });
        } else {
          items.push({
            key: child.key,
            label:
              child.path && !child.drawer ? (
                <Link to={child.path}>
                  <MenuItemLabel icon={child.icon} label={elementLabel} />
                </Link>
              ) : (
                <MenuItemLabel icon={child.icon} label={elementLabel} />
              ),
            onClick: child.drawer
              ? () => toggleParcelDrawer(child.drawer, child.key)
              : closeAllDrawers,
            className: activeDrawerKey === child.key ? "drawer-active" : undefined,
          });
        }
      });
    } else {
      items.push({
        key: item.key,
        label: item.path ? (
          <Link to={item.path}>
            <MenuItemLabel icon={item.icon} label={item.label} />
          </Link>
        ) : (
          <MenuItemLabel icon={item.icon} label={item.label} />
        ),
      });
    }
  });

  return items;
};
