import type { SidebarLayout } from "@saltbox/saltbox-frontend-common";

import type { MenuLabel } from "../lib/resolve-menu-label";
import type { MenuIcon } from "../ui/menu-item-icon/menu-item-icon";

export interface MenuEntry {
  key: string;
  label: MenuLabel;
  priority?: number;
  icon?: MenuIcon;
  path?: string;
  href?: string;
  drawer?: unknown;
  submenu?: MenuEntry[];
  children?: MenuEntry[];
}

export type MenuLayout = SidebarLayout;

export type MenuLayoutStatus = "pending" | "retrying" | "loaded" | "failed" | "unavailable";

export interface AppMenuStore {
  sortedMenu: MenuEntry[];
  sortedSettingsMenu: MenuEntry[];
  isModulesLoading?: boolean;
  isAvailableModulePath?: (pathname: string) => boolean;
  isFullBleedModulePath?: (pathname: string) => boolean;
}

export interface MenuLayoutStore extends AppMenuStore {
  menuCatalog: MenuEntry[];
  orderedMenuCatalog: MenuEntry[];
  visibleMenu: MenuEntry[];
  hiddenMenu: MenuEntry[];
  defaultHiddenItems: string[];
  hiddenItems: string[];
  layout: MenuLayout | null;
  layoutStatus: MenuLayoutStatus;
  retryLayoutLoad: () => void;
  setLayout: (layout: MenuLayout) => Promise<void>;
  resetLayout: () => Promise<void>;
}

export type MenuSettingsState = "loading" | "failed" | "ready";

const MENU_SETTINGS_STATES: Record<MenuLayoutStatus, MenuSettingsState> = {
  pending: "loading",
  retrying: "loading",
  failed: "failed",
  loaded: "ready",
  unavailable: "ready",
};

export function getMenuSettingsState(store: MenuLayoutStore): MenuSettingsState {
  return store.isModulesLoading ? "loading" : MENU_SETTINGS_STATES[store.layoutStatus];
}

export const isMenuLayoutStore = (store: AppMenuStore): store is MenuLayoutStore =>
  typeof (store as Partial<MenuLayoutStore>).setLayout === "function";
