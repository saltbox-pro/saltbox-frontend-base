import { ControlOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { useTranslation } from "react-i18next";

import { SiderMenu } from "../../../shared/ui/sider-menu/sider-menu";

import styles from "./sidebar-actions.module.css";

interface SidebarActionsProps {
  isCollapsed: boolean;
  onToggleCollapsed: () => void;
  onOpenMenuSettings?: () => void;
}

export function SidebarActions({
  isCollapsed,
  onToggleCollapsed,
  onOpenMenuSettings,
}: SidebarActionsProps) {
  const { t } = useTranslation();

  const ariaProps = { "aria-expanded": !isCollapsed };

  const menuSettingsItems: NonNullable<MenuProps["items"]> = onOpenMenuSettings
    ? [
        {
          key: "menu-settings",
          icon: <ControlOutlined />,
          label: t("mainmenu.menu-settings-button"),
          onClick: onOpenMenuSettings,
        },
      ]
    : [];

  const items: MenuProps["items"] = [
    ...menuSettingsItems,
    {
      key: "collapse",
      icon: isCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />,
      label: t(isCollapsed ? "mainmenu.expand-button" : "mainmenu.collapse-button"),
      onClick: onToggleCollapsed,
      ...ariaProps,
    },
  ];

  return (
    <div className={styles.container}>
      <SiderMenu items={items} />
    </div>
  );
}
