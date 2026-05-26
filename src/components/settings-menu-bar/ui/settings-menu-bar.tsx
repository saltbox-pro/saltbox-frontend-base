import { SettingOutlined } from "@ant-design/icons";
import { Flex } from "antd";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";

import { getActiveMenuKeys } from "../../../shared/lib/get-active-menu-keys";
import { BaseMenu } from "../../../shared/ui/base-menu/base-menu";

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
        className: isSettingsDrawerOpen ? "drawer-active" : undefined,
      },
    ],
    [t, toggleSettingsDrawer, isSettingsDrawerOpen]
  );

  return (
    <Flex className={styles.container} gap="small" align="center">
      <BaseMenu
        className={styles.menu}
        selectedKeys={isSettingsActive ? ["settings"] : []}
        items={items}
      />
    </Flex>
  );
}
