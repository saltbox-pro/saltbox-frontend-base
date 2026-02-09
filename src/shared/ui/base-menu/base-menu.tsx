import { Menu, MenuProps } from "antd";

import styles from "./base-menu.module.css";

interface BaseMenuProps {
  items: MenuProps["items"];
  selectedKeys?: string[];
  openKeys?: string[];
  className?: string;
}

export function BaseMenu({ items, selectedKeys = [], openKeys, className }: BaseMenuProps) {
  return (
    <Menu
      className={className || styles.menu}
      selectedKeys={selectedKeys}
      openKeys={openKeys}
      mode="vertical"
      style={{ borderInlineEnd: "none" }}
      items={items}
    />
  );
}
