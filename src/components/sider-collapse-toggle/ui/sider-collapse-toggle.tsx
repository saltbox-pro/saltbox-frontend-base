import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { useTranslation } from "react-i18next";

import { SiderMenu } from "../../../shared/ui/sider-menu/sider-menu";

import styles from "./sider-collapse-toggle.module.css";

interface SiderCollapseToggleProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function SiderCollapseToggle({ isCollapsed, onToggle }: SiderCollapseToggleProps) {
  const { t } = useTranslation();

  const ariaProps = { "aria-expanded": !isCollapsed };

  const items: MenuProps["items"] = [
    {
      key: "collapse",
      icon: isCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />,
      label: t(isCollapsed ? "mainmenu.expand-button" : "mainmenu.collapse-button"),
      onClick: onToggle,
      ...ariaProps,
    },
  ];

  return (
    <div className={styles.container}>
      <SiderMenu items={items} />
    </div>
  );
}
