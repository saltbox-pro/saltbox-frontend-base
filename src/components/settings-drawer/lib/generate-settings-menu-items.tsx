import type { MenuProps } from "antd";
import { Link } from "react-router";

import { MenuItemLabel } from "../../../shared/ui/menu-item-label/menu-item-label";

const externalHrefProps = { target: "_blank", rel: "noopener noreferrer" } as const;

const resolveLabel = (label: string | Record<string, string>, locale: string): string =>
  typeof label === "object" ? label[locale] : label;

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
        label: resolveLabel(item.label, locale),
      });

      item.children.forEach((child) => {
        const elementLabel = resolveLabel(child.label, locale);

        if (child.submenu) {
          items.push({
            key: child.key,
            label: <MenuItemLabel icon={child.icon} label={elementLabel} />,
            children: child.submenu.map((sub: any) => {
              const subLabel = resolveLabel(sub.label, locale);
              const subLink = sub.href ? (
                <a href={sub.href} {...externalHrefProps} onClick={() => closeDrawer()}>
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
            <a href={child.href} {...externalHrefProps} onClick={() => closeDrawer()}>
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
