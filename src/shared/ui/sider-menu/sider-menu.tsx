import { ConfigProvider, type MenuProps, theme, type ThemeConfig } from "antd";
import type { CSSProperties } from "react";

import { SIDER_COLLAPSED_WIDTH } from "../../config/sider";
import { cn } from "../../lib/cn";
import { BaseMenu } from "../base-menu/base-menu";

import styles from "./sider-menu.module.css";

const ICON_SIZE = 16;
const COLLAPSED_ICON_SIZE = 20;
const ITEM_MARGIN = 4;

const ITEM_PADDING = (SIDER_COLLAPSED_WIDTH - 2 * ITEM_MARGIN - ICON_SIZE) / 2;
const COLLAPSED_ITEM_PADDING = (SIDER_COLLAPSED_WIDTH - 2 * ITEM_MARGIN - COLLAPSED_ICON_SIZE) / 2;

const SIDER_MENU_THEME: ThemeConfig = {
  components: {
    Menu: {
      iconSize: ICON_SIZE,
      collapsedIconSize: COLLAPSED_ICON_SIZE,
      itemMarginInline: ITEM_MARGIN,
      itemPaddingInline: ITEM_PADDING,
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
    "--sider-menu-collapsed-item-padding": `${COLLAPSED_ITEM_PADDING}px`,
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
        inlineIndent={ITEM_PADDING}
      />
    </ConfigProvider>
  );
}
