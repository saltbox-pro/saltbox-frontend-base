import type { CSSProperties } from "react";

import { MenuSkeletonRow } from "../../../shared/ui/menu-skeleton/menu-skeleton-row";
import {
  SIDER_MENU_COLLAPSED_ICON_SIZE,
  SIDER_MENU_COLLAPSED_ITEM_PADDING,
  SIDER_MENU_ICON_SIZE,
  SIDER_MENU_ITEM_HEIGHT,
  SIDER_MENU_ITEM_MARGIN,
  SIDER_MENU_ITEM_PADDING,
} from "../../../shared/ui/sider-menu/constants";

import styles from "./main-menu.module.css";

const SKELETON_ITEMS_COUNT = 5;

interface MainMenuSkeletonProps {
  isCollapsed: boolean;
}

export function MainMenuSkeleton({ isCollapsed }: MainMenuSkeletonProps) {
  const style = {
    "--skeleton-item-height": `${SIDER_MENU_ITEM_HEIGHT}px`,
    "--skeleton-item-margin": `${SIDER_MENU_ITEM_MARGIN}px`,
    "--skeleton-item-padding": `${isCollapsed ? SIDER_MENU_COLLAPSED_ITEM_PADDING : SIDER_MENU_ITEM_PADDING}px`,
  } as CSSProperties;
  const iconSize = isCollapsed ? SIDER_MENU_COLLAPSED_ICON_SIZE : SIDER_MENU_ICON_SIZE;

  return (
    <ul className={styles.skeleton} style={style} aria-busy="true">
      {Array.from({ length: SKELETON_ITEMS_COUNT }, (_, index) => (
        <MenuSkeletonRow
          key={index}
          className={styles.skeletonItem}
          iconSize={iconSize}
          hasLabel={!isCollapsed}
        />
      ))}
    </ul>
  );
}
