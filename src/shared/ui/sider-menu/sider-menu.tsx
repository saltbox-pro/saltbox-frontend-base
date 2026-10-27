import { ConfigProvider, type MenuProps, theme, type ThemeConfig } from "antd";
import type { CSSProperties } from "react";

import { cn } from "../../lib/cn";
import { BaseMenu } from "../base-menu/base-menu";

import {
  SIDER_MENU_COLLAPSED_ICON_SIZE,
  SIDER_MENU_COLLAPSED_ITEM_PADDING,
  SIDER_MENU_ICON_SIZE,
  SIDER_MENU_ITEM_HEIGHT,
  SIDER_MENU_ITEM_MARGIN,
  SIDER_MENU_ITEM_PADDING,
} from "./constants";
import styles from "./sider-menu.module.css";

const SIDER_MENU_THEME: ThemeConfig = {
  components: {
    Menu: {
      iconSize: SIDER_MENU_ICON_SIZE,
      collapsedIconSize: SIDER_MENU_COLLAPSED_ICON_SIZE,
      itemMarginInline: SIDER_MENU_ITEM_MARGIN,
      itemPaddingInline: SIDER_MENU_ITEM_PADDING,
      itemHeight: SIDER_MENU_ITEM_HEIGHT,
    },
  },
};

interface SiderMenuProps {
  items: MenuProps["items"];
  selectedKeys?: string[];
  openKeys?: string[];
  className?: string;
}

export function SiderMenu({ items, selectedKeys, openKeys, className }: SiderMenuProps) {
  const { token } = theme.useToken();

  const style = {
    "--sider-menu-collapsed-item-padding": `${SIDER_MENU_COLLAPSED_ITEM_PADDING}px`,
    "--sider-menu-item-transition": [
      `border-color ${token.motionDurationSlow}`,
      `background ${token.motionDurationSlow}`,
      `padding ${token.motionDurationMid} ${token.motionEaseOut}`,
    ].join(", "),
  } as CSSProperties;

  return (
    <ConfigProvider theme={SIDER_MENU_THEME}>
      <BaseMenu
        className={cn(styles.menu, className)}
        style={style}
        selectedKeys={selectedKeys}
        openKeys={openKeys}
        items={items}
        mode="inline"
        inlineIndent={SIDER_MENU_ITEM_PADDING}
      />
    </ConfigProvider>
  );
}
