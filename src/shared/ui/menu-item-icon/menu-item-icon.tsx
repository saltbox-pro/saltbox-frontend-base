import { MatIcon } from "@saltbox/saltbox-frontend-common";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "../../lib/cn";

import styles from "./menu-item-icon.module.css";

export type MenuIcon = string | (() => ReactNode) | ReactNode;

type MatIconSize = ComponentProps<typeof MatIcon>["size"];

export const renderMenuIcon = (icon: MenuIcon, size: MatIconSize = "small"): ReactNode => {
  if (typeof icon === "function") {
    return icon();
  }

  if (typeof icon === "string") {
    return <MatIcon icon={icon as ComponentProps<typeof MatIcon>["icon"]} size={size} />;
  }

  return icon;
};

interface MenuItemIconProps {
  icon: MenuIcon;
  className?: string;
}

export function MenuItemIcon({ icon, className }: MenuItemIconProps) {
  const isMaterialIcon = typeof icon === "string";

  return (
    <span className={cn(className, styles.icon, isMaterialIcon && styles.materialIcon)}>
      {renderMenuIcon(icon, "inherit")}
    </span>
  );
}
