import { SettingOutlined } from "@ant-design/icons";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";

import { getActiveMenuKeys } from "../../../shared/lib/get-active-menu-keys";
import { SIDER_MENU_ITEM_OVERLAY_OPEN_CLASS } from "../../../shared/ui/sider-menu/constants";
import { SiderMenu } from "../../../shared/ui/sider-menu/sider-menu";

import styles from "./settings-menu-bar.module.css";

interface SettingsMenuBarProps {
  settingsMenu: any[];
  toggleSettingsDrawer: () => void;
  isSettingsDrawerOpen: boolean;
}

export function SettingsMenuBar({
  settingsMenu,
  toggleSettingsDrawer,
  isSettingsDrawerOpen,
}: SettingsMenuBarProps) {
  const { t } = useTranslation();
  const location = useLocation();

  const { selectedKeys } = useMemo(
    () => getActiveMenuKeys(location.pathname, settingsMenu),
    [location.pathname, settingsMenu]
  );
  const isSettingsActive = selectedKeys.length > 0;

  const items = useMemo(
    () => [
      {
        key: "settings",
        icon: <SettingOutlined />,
        label: t("mainmenu.settings-button"),
        onClick: toggleSettingsDrawer,
        className: isSettingsDrawerOpen ? SIDER_MENU_ITEM_OVERLAY_OPEN_CLASS : undefined,
      },
    ],
    [t, toggleSettingsDrawer, isSettingsDrawerOpen]
  );

  return (
    <div className={styles.container}>
      <SiderMenu selectedKeys={isSettingsActive ? ["settings"] : []} items={items} />
    </div>
  );
}
