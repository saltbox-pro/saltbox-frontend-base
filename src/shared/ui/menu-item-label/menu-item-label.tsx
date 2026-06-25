import { MatIcon } from "@saltbox/saltbox-frontend-common";
import { Flex } from "antd";
import type { ComponentProps, ReactNode } from "react";

interface MenuItemLabelProps {
  label: string;
  icon?: string | (() => ReactNode) | ReactNode;
}

export function MenuItemLabel({ label, icon }: MenuItemLabelProps) {
  const renderedIcon =
    typeof icon === "function" ? (
      icon()
    ) : typeof icon === "string" ? (
      <MatIcon icon={icon as ComponentProps<typeof MatIcon>["icon"]} size="small" />
    ) : (
      icon
    );

  return (
    <Flex gap="small" align="center">
      {renderedIcon}
      {label}
    </Flex>
  );
}
