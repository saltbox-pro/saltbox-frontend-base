import { useMemo } from "react";
import { useLocation } from "react-router";

import { getActiveMenuKeys } from "../../../shared/lib/get-active-menu-keys";
import type { MenuEntry } from "../../../shared/model/menu";
import { BaseDrawer } from "../../../shared/ui/base-drawer/base-drawer";
import { BaseMenu } from "../../../shared/ui/base-menu/base-menu";
import { generateMoreMenuItems } from "../lib/generate-more-menu-items";

import { MoreDrawerSkeleton } from "./more-drawer-skeleton";

interface MoreDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  afterOpenChange?: (open: boolean) => void;
  moreMenu: MenuEntry[];
  isLoading: boolean;
  locale: string;
  toggleParcelDrawer: (content: unknown, menuKey: string) => void;
}

export function MoreDrawer({
  isOpen,
  onClose,
  afterOpenChange,
  moreMenu,
  isLoading,
  locale,
  toggleParcelDrawer,
}: MoreDrawerProps) {
  const location = useLocation();

  const { selectedKeys, openKeys } = useMemo(
    () => getActiveMenuKeys(location.pathname, moreMenu),
    [location.pathname, moreMenu]
  );

  const items = useMemo(
    () =>
      generateMoreMenuItems({ config: moreMenu, locale, closeDrawer: onClose, toggleParcelDrawer }),
    [moreMenu, locale, onClose, toggleParcelDrawer]
  );

  return (
    <BaseDrawer isOpen={isOpen} onClose={onClose} afterOpenChange={afterOpenChange}>
      {isLoading ? (
        <MoreDrawerSkeleton />
      ) : (
        <BaseMenu selectedKeys={selectedKeys} openKeys={openKeys} items={items} />
      )}
    </BaseDrawer>
  );
}
