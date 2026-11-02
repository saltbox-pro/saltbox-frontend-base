import { Layout, Flex, Spin } from "antd";
import { observer } from "mobx-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";

import "./app-layout.css";
import styles from "./app-layout.module.css";
import { Logo } from "./components/logo";
import { MainMenu, MainMenuSkeleton } from "./components/main-menu";
import { MenuFooter } from "./components/menu-footer";
import { MenuSettingsModal } from "./components/menu-settings-modal";
import { MoreDrawer } from "./components/more-drawer";
import { ParcelDrawer } from "./components/parcel-drawer";
import { SidebarActions } from "./components/sidebar-actions";
import { SubmenuDrawer } from "./components/submenu-drawer";
import { SIDER_COLLAPSED_WIDTH, SIDER_WIDTH } from "./shared/config/sider";
import { useLayoutDrawers } from "./shared/lib/use-layout-drawers";
import { useSiderAutoCollapse } from "./shared/lib/use-sider-auto-collapse";
import { useSiderCollapsed } from "./shared/lib/use-sider-collapsed";
import type { AppMenuStore } from "./shared/model/menu";
import { getSidebarMenus } from "./shared/model/sidebar-menus";
import { ModuleAccessError } from "./shared/ui/module-access-error/module-access-error";

const { Sider, Content } = Layout;

interface AppLayoutProps {
  authStore: any;
  menuStore: AppMenuStore;
  localeStore: any;
}

export const AppLayout = observer(({ authStore, menuStore, localeStore }: AppLayoutProps) => {
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);

  const [isMenuSettingsOpen, setIsMenuSettingsOpen] = useState(false);
  const siderCollapsedByUser = useSiderCollapsed();
  const { isCollapsed, toggleCollapsed, autoCollapse, releaseAutoCollapse } =
    useSiderAutoCollapse(siderCollapsedByUser);
  const { activeDrawerKey, closeAllDrawers, parcelDrawer, submenuDrawer, moreDrawer } =
    useLayoutDrawers({
      autoCollapseSider: autoCollapse,
      releaseSiderAutoCollapse: releaseAutoCollapse,
    });

  useEffect(() => {
    if (containerRef.current) {
      const event = new CustomEvent("app-container-ready", {
        detail: {
          container: containerRef.current,
          containerId: "app-container",
          action: "mount",
        },
      });
      window.dispatchEvent(event);
    }

    return () => {
      const event = new CustomEvent("app-container-ready", {
        detail: {
          container: containerRef.current,
          containerId: "app-container",
          action: "unmount",
        },
      });
      window.dispatchEvent(event);
    };
  }, []);

  const openMenuSettings = useCallback(() => {
    closeAllDrawers();
    setIsMenuSettingsOpen(true);
  }, [closeAllDrawers]);

  const handleCloseMenuSettings = () => {
    setIsMenuSettingsOpen(false);
  };

  const locale = localeStore.currentLocale;
  const { layoutStore, mainMenu, moreMenu, hasMoreMenu, isModulesLoading, isLayoutResolved } =
    getSidebarMenus(menuStore);
  const isAvailableModulePath = menuStore.isAvailableModulePath?.(location.pathname) ?? true;
  const isFullBleed = menuStore.isFullBleedModulePath?.(location.pathname) ?? false;
  const shouldShowLoading = location.pathname !== "/" && isModulesLoading;
  const shouldShowModuleError =
    location.pathname !== "/" && !isModulesLoading && !isAvailableModulePath;

  return (
    <Layout className={styles.layout}>
      <Layout className={styles.mainLayout}>
        <Sider
          className={styles.sider}
          width={SIDER_WIDTH}
          collapsedWidth={SIDER_COLLAPSED_WIDTH}
          collapsed={isCollapsed}
          trigger={null}
        >
          <Flex className={styles.siderContent} vertical>
            <Logo onClick={closeAllDrawers} isCollapsed={isCollapsed} />

            {isLayoutResolved ? (
              <MainMenu
                menu={mainMenu}
                more={
                  hasMoreMenu
                    ? {
                        entries: moreMenu,
                        isOpen: moreDrawer.isOpen,
                        onToggle: moreDrawer.toggle,
                      }
                    : null
                }
                toggleParcelDrawer={parcelDrawer.toggle}
                toggleSubmenuDrawer={submenuDrawer.toggle}
                closeAllDrawers={closeAllDrawers}
                locale={locale}
                activeDrawerKey={activeDrawerKey}
                isCollapsed={isCollapsed}
              />
            ) : (
              <MainMenuSkeleton isCollapsed={isCollapsed} />
            )}

            <MenuFooter
              authStore={authStore}
              localeStore={localeStore}
              closeAllDrawers={closeAllDrawers}
              onOpenMenuSettings={layoutStore ? openMenuSettings : undefined}
            />

            <SidebarActions isCollapsed={isCollapsed} onToggleCollapsed={toggleCollapsed} />
          </Flex>
        </Sider>
        <Layout className={styles.mainLayoutContentWrapper}>
          <ParcelDrawer
            isOpen={parcelDrawer.isOpen}
            request={parcelDrawer.request}
            pinnedWidth={parcelDrawer.pinnedWidth}
            panelRef={parcelDrawer.panelRef}
            onClose={parcelDrawer.close}
            onTogglePin={parcelDrawer.togglePin}
            afterOpenChange={parcelDrawer.handleAfterOpenChange}
          />

          <MoreDrawer
            isOpen={moreDrawer.isOpen}
            onClose={moreDrawer.close}
            moreMenu={moreMenu}
            isLoading={isModulesLoading}
            locale={locale}
            toggleParcelDrawer={parcelDrawer.toggle}
          />

          {layoutStore && (
            <MenuSettingsModal
              isOpen={isMenuSettingsOpen}
              onClose={handleCloseMenuSettings}
              menuStore={layoutStore}
              locale={locale}
            />
          )}

          <SubmenuDrawer
            isOpen={submenuDrawer.isOpen}
            onClose={submenuDrawer.close}
            afterOpenChange={submenuDrawer.handleAfterOpenChange}
            submenuItems={submenuDrawer.items}
            locale={locale}
            onItemClick={closeAllDrawers}
          />

          <div className={styles.mainLayoutBody}>
            <div
              className={styles.pinnedDrawerSpacer}
              style={{ width: parcelDrawer.pinnedWidth ?? 0 }}
            />

            <Content
              className={`${styles.mainLayoutContent}${isFullBleed ? ` ${styles.mainLayoutContentFullBleed}` : ""}`}
            >
              <div
                ref={containerRef}
                id="app-container"
                className={styles.appContainer}
                style={shouldShowLoading || shouldShowModuleError ? { display: "none" } : undefined}
              ></div>
              {shouldShowLoading && (
                <Flex align="center" justify="center" style={{ width: "100%", height: "100%" }}>
                  <Spin size="large" />
                </Flex>
              )}
              {shouldShowModuleError && <ModuleAccessError />}
            </Content>
          </div>
        </Layout>
      </Layout>
    </Layout>
  );
});
