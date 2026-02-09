import { useMemo } from "react";
import { Link, useLocation } from "react-router";

import { BaseDrawer } from "../../../shared/ui/base-drawer/base-drawer";
import { BaseMenu } from "../../../shared/ui/base-menu/base-menu";
import { MenuItemLabel } from "../../../shared/ui/menu-item-label/menu-item-label";
import { getActiveSubmenuKeys } from "../../../shared/lib/get-active-menu-keys";

interface SubmenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  afterOpenChange: (open: boolean) => void;
  submenuItems: any[] | null;
  locale: string;
  onItemClick: () => void;
}

export function SubmenuDrawer({
  isOpen,
  onClose,
  afterOpenChange,
  submenuItems,
  locale,
  onItemClick,
}: SubmenuDrawerProps) {
  const location = useLocation();

  const items = useMemo(
    () =>
      submenuItems?.map((sub: any) => {
        const subLabel = typeof sub.label === "object" ? sub.label[locale] : sub.label;
        return {
          key: sub.key,
          label: (
            <Link to={sub.path} onClick={onItemClick}>
              <MenuItemLabel icon={sub.icon} label={subLabel} />
            </Link>
          ),
        };
      }),
    [submenuItems, locale, onItemClick]
  );

  const activeKeys = useMemo(
    () => (submenuItems ? getActiveSubmenuKeys(location.pathname, submenuItems) : []),
    [location.pathname, submenuItems]
  );

  return (
    <BaseDrawer isOpen={isOpen} onClose={onClose} afterOpenChange={afterOpenChange}>
      <BaseMenu items={items || []} selectedKeys={activeKeys} />
    </BaseDrawer>
  );
}
