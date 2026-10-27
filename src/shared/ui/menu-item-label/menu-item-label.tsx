import { Flex } from "antd";

import { type MenuIcon, renderMenuIcon } from "../menu-item-icon/menu-item-icon";

import styles from "./menu-item-label.module.css";

interface MenuItemLabelProps {
  label: string;
  icon?: MenuIcon;
}

export function MenuItemLabel({ label, icon }: MenuItemLabelProps) {
  return (
    <Flex gap="small" align="center">
      {!!icon && <span className={styles.icon}>{renderMenuIcon(icon)}</span>}
      {label}
    </Flex>
  );
}
