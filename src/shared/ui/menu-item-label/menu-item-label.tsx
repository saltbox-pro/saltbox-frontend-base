import { Flex } from "antd";

import { type MenuIcon, renderMenuIcon } from "../menu-item-icon/menu-item-icon";

interface MenuItemLabelProps {
  label: string;
  icon?: MenuIcon;
}

export function MenuItemLabel({ label, icon }: MenuItemLabelProps) {
  return (
    <Flex gap="small" align="center">
      {renderMenuIcon(icon)}
      {label}
    </Flex>
  );
}
