import { type AppMenuStore, type MenuEntry, type MenuLayoutStore, isMenuLayoutStore } from "./menu";

export interface SidebarMenus {
  layoutStore: MenuLayoutStore | null;
  mainMenu: MenuEntry[];
  moreMenu: MenuEntry[];
  hasMoreMenu: boolean;
  isModulesLoading: boolean;
  isLayoutResolved: boolean;
}

export function getSidebarMenus(menuStore: AppMenuStore): SidebarMenus {
  const layoutStore = isMenuLayoutStore(menuStore) ? menuStore : null;
  const isModulesLoading = menuStore.isModulesLoading ?? false;
  const moreMenu = layoutStore?.hiddenMenu ?? menuStore.sortedSettingsMenu;

  return {
    layoutStore,
    mainMenu: layoutStore?.visibleMenu ?? menuStore.sortedMenu,
    moreMenu,
    hasMoreMenu: isModulesLoading || moreMenu.length > 0,
    isModulesLoading,
    isLayoutResolved: layoutStore ? layoutStore.layoutStatus !== "pending" : true,
  };
}
