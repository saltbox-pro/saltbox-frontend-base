import type { MenuProps } from "antd";
import { Link } from "react-router";

import { MenuItemLabel } from "../../../shared/ui/menu-item-label/menu-item-label";

export const generateSettingsMenuItems = (
  config: any[],
  closeDrawer: () => void,
  locale: string
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
            children: child.submenu.map((sub: any) => {
              const subLabel = typeof sub.label === "object" ? sub.label[locale] : sub.label;
              const subLink = sub.href ? (
                <a href={sub.href} onClick={() => closeDrawer()}>
                  <MenuItemLabel icon={sub.icon} label={subLabel} />
                </a>
              ) : (
                <Link to={sub.path} onClick={() => closeDrawer()}>
                  <MenuItemLabel icon={sub.icon} label={subLabel} />
                </Link>
              );
              return { key: sub.key, label: subLink };
            }),
          });
        } else {
          const link = child.href ? (
            <a href={child.href} onClick={() => closeDrawer()}>
              <MenuItemLabel icon={child.icon} label={elementLabel} />
            </a>
          ) : (
            <Link to={child.path} onClick={() => closeDrawer()}>
              <MenuItemLabel icon={child.icon} label={elementLabel} />
            </Link>
          );
          items.push({ key: child.key, label: link });
        }
      });
    }
  });

  return items;
};
