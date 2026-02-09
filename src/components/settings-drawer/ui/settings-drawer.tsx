import type { MenuProps } from "antd";
import { useMemo } from "react";
import { useLocation } from "react-router";

import { BaseDrawer } from "../../../shared/ui/base-drawer/base-drawer";
import { BaseMenu } from "../../../shared/ui/base-menu/base-menu";
import { MenuItemLabel } from "../../../shared/ui/menu-item-label/menu-item-label";
import { getActiveMenuKeys } from "../../../shared/lib/get-active-menu-keys";
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
      //TODO rework monitoring menu
      {
        type: "group",
        key: "monitoring",
        label: "Monitoring",
      },
      {
        key: "dashboard",
        label: (
          <a href={"/grafana"}>
            <MenuItemLabel
              icon={undefined as any}
              label={locale === "ru" ? "Дашборд" : "Dashboard"}
            />
          </a>
        ),
      },
      {
        key: "logs",
        label: (
          <a href={"/grafana/a/grafana-lokiexplore-app"}>
            <MenuItemLabel icon={undefined as any} label={locale === "ru" ? "Логи" : "Logs"} />
          </a>
        ),
      },
    ],
    [locale]
  );

  const { selectedKeys, openKeys } = useMemo(
    () => getActiveMenuKeys(location.pathname, settingsMenu),
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
