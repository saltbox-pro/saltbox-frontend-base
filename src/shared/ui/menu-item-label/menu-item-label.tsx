import { MatIcon } from "@saltbox/saltbox-frontend-common";
import { Flex } from "antd";
import type { ComponentProps } from "react";

interface MenuItemLabelProps {
  label: string;
  icon: ComponentProps<typeof MatIcon>["icon"];
}

export function MenuItemLabel({ label, icon }: MenuItemLabelProps) {
  return (
    <Flex gap="small" align="center">
      <MatIcon icon={icon} size="small" />
      {label}
    </Flex>
  );
}
