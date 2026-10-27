import type { MenuProps } from "antd";

import { resolveMenuLabel } from "../../../shared/lib/resolve-menu-label";
import type { MenuEntry } from "../../../shared/model/menu";
import { renderMenuEntryLink } from "../../../shared/ui/menu-entry-link/render-menu-entry-link";
import { MenuItemLabel } from "../../../shared/ui/menu-item-label/menu-item-label";

type MenuItems = NonNullable<MenuProps["items"]>;

interface GenerateMoreMenuItemsParams {
  config: MenuEntry[];
  locale: string;
  closeDrawer: () => void;
  toggleParcelDrawer: (content: unknown, menuKey: string) => void;
}

export const generateMoreMenuItems = ({
  config,
  locale,
  closeDrawer,
  toggleParcelDrawer,
}: GenerateMoreMenuItemsParams): MenuItems => {
  const renderLabel = (entry: MenuEntry) =>
    renderMenuEntryLink(
      entry,
      <MenuItemLabel icon={entry.icon} label={resolveMenuLabel(entry.label, locale)} />,
      closeDrawer
    );

  const toMenuItem = (entry: MenuEntry): MenuItems[number] => {
    if (entry.submenu) {
      return {
        key: entry.key,
        label: <MenuItemLabel icon={entry.icon} label={resolveMenuLabel(entry.label, locale)} />,
        children: entry.submenu.map((sub) => ({ key: sub.key, label: renderLabel(sub) })),
      };
    }

    return {
      key: entry.key,
      label: renderLabel(entry),
      onClick: entry.drawer ? () => toggleParcelDrawer(entry.drawer, entry.key) : undefined,
    };
  };

  return config.flatMap((item): MenuItems => {
    if (!item.children) return [toMenuItem(item)];

    return [
      { type: "group", key: item.key, label: resolveMenuLabel(item.label, locale) },
      ...item.children.map(toMenuItem),
    ];
  });
};
