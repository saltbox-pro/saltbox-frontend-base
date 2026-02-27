import type { MenuProps } from "antd";
import { useMemo } from "react";
import { useLocation } from "react-router";

import { getActiveMenuKeys } from "../../../shared/lib/get-active-menu-keys";
import { BaseDrawer } from "../../../shared/ui/base-drawer/base-drawer";
import { BaseMenu } from "../../../shared/ui/base-menu/base-menu";
import { MenuItemLabel } from "../../../shared/ui/menu-item-label/menu-item-label";
import { MONITORING_MENU_CONFIG } from "../constants/monitoring-menu-config";
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

  const monitoringMenuItem: MenuProps["items"] = useMemo(
    () => [
      {
        type: "group",
        key: MONITORING_MENU_CONFIG.key,
        label: MONITORING_MENU_CONFIG.label,
      },
      ...MONITORING_MENU_CONFIG.children.map((child) => {
        const label = typeof child.label === "object" ? child.label[locale] : child.label;
        return {
          key: child.key,
          label: (
            <a href={child.path}>
              <MenuItemLabel icon={child.icon} label={label} />
            </a>
          ),
        };
      }),
    ],
    [locale]
  );

  const { selectedKeys, openKeys } = useMemo(
    () => getActiveMenuKeys(location.pathname, [...settingsMenu, MONITORING_MENU_CONFIG]),
    [location.pathname, settingsMenu]
  );

  const items = useMemo(
    () => [...generateSettingsMenuItems(settingsMenu, onClose, locale), ...monitoringMenuItem],
    [settingsMenu, onClose, locale, monitoringMenuItem]
  );

  return (
    <BaseDrawer isOpen={isOpen} onClose={onClose} afterOpenChange={afterOpenChange}>
      <BaseMenu selectedKeys={selectedKeys} openKeys={openKeys} items={items} />
    </BaseDrawer>
  );
}
