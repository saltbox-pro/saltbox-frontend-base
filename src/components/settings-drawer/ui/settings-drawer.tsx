import { useMemo } from "react";
import { useLocation } from "react-router";

import { getActiveMenuKeys } from "../../../shared/lib/get-active-menu-keys";
import { BaseDrawer } from "../../../shared/ui/base-drawer/base-drawer";
import { BaseMenu } from "../../../shared/ui/base-menu/base-menu";
import { generateSettingsMenuItems } from "../lib/generate-settings-menu-items";

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  afterOpenChange?: (open: boolean) => void;
  settingsMenu: any[];
  locale: string;
}

export function SettingsDrawer({
  isOpen,
  onClose,
  afterOpenChange,
  settingsMenu,
  locale,
}: SettingsDrawerProps) {
  const location = useLocation();

  const { selectedKeys, openKeys } = useMemo(
    () => getActiveMenuKeys(location.pathname, settingsMenu),
    [location.pathname, settingsMenu]
  );

  const items = useMemo(
    () => generateSettingsMenuItems(settingsMenu, onClose, locale),
    [settingsMenu, onClose, locale]
  );

  return (
    <BaseDrawer isOpen={isOpen} onClose={onClose} afterOpenChange={afterOpenChange}>
      <BaseMenu selectedKeys={selectedKeys} openKeys={openKeys} items={items} />
    </BaseDrawer>
  );
}
