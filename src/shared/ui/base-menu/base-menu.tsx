import { Menu, MenuProps } from "antd";
import type { CSSProperties } from "react";

import styles from "./base-menu.module.css";

interface BaseMenuProps {
  items: MenuProps["items"];
  selectedKeys?: string[];
  openKeys?: string[];
  className?: string;
  style?: CSSProperties;
  mode?: MenuProps["mode"];
  inlineIndent?: number;
}

export function BaseMenu({
  items,
  selectedKeys = [],
  openKeys,
  className,
  style,
  mode = "vertical",
  inlineIndent,
}: BaseMenuProps) {
  return (
    <Menu
      className={className || styles.menu}
      selectedKeys={selectedKeys}
      openKeys={openKeys}
      mode={mode}
      inlineIndent={inlineIndent}
      style={{ borderInlineEnd: "none", ...style }}
      items={items}
    />
  );
}
