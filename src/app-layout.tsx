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

  const [parcelDrawerContent, setParcelDrawerContent] = useState<any>();
  const [activeParcelKey, setActiveParcelKey] = useState<string | null>(null);
  const [submenuDrawerContent, setSubmenuDrawerContent] = useState<any[] | null>(null);
  const [activeSubmenuKey, setActiveSubmenuKey] = useState<string | null>(null);
  const [isSubmenuDrawerOpen, setIsSubmenuDrawerOpen] = useState(false);
  const [isMoreDrawerOpen, setIsMoreDrawerOpen] = useState(false);
  const [isMenuSettingsOpen, setIsMenuSettingsOpen] = useState(false);
  const { isCollapsed, toggleCollapsed } = useSiderCollapsed();

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

  const closeParcelDrawer = useCallback(() => {
    setParcelDrawerContent(undefined);
    setActiveParcelKey(null);
  }, []);

  const closeSubmenuDrawer = useCallback(() => {
    setIsSubmenuDrawerOpen(false);
  }, []);

  const closeMoreDrawer = useCallback(() => {
    setIsMoreDrawerOpen(false);
  }, []);

  const closeAllDrawers = useCallback(() => {
    closeParcelDrawer();
    closeSubmenuDrawer();
    closeMoreDrawer();
  }, [closeParcelDrawer, closeSubmenuDrawer, closeMoreDrawer]);

  const toggleParcelDrawer = useCallback(
    (content: any, menuKey: string) => {
      if (parcelDrawerContent && activeParcelKey === menuKey) {
        closeParcelDrawer();
        return;
      }

      closeMoreDrawer();
      closeSubmenuDrawer();
      setParcelDrawerContent(content);
      setActiveParcelKey(menuKey);
    },
    [parcelDrawerContent, activeParcelKey, closeParcelDrawer, closeMoreDrawer, closeSubmenuDrawer]
  );

  const toggleSubmenuDrawer = useCallback(
    (submenu: any[], menuKey: string) => {
      if (isSubmenuDrawerOpen && activeSubmenuKey === menuKey) {
        closeSubmenuDrawer();
        return;
      }

      closeMoreDrawer();
      closeParcelDrawer();
      setSubmenuDrawerContent(submenu);
      setActiveSubmenuKey(menuKey);
      setIsSubmenuDrawerOpen(true);
    },
    [isSubmenuDrawerOpen, activeSubmenuKey, closeSubmenuDrawer, closeMoreDrawer, closeParcelDrawer]
  );

  const handleSubmenuDrawerAfterOpenChange = (open: boolean) => {
    if (!open) {
      setSubmenuDrawerContent(null);
      setActiveSubmenuKey(null);
    }
  };

  const toggleMoreDrawer = useCallback(() => {
    if (isMoreDrawerOpen) {
      closeMoreDrawer();
      return;
    }

    closeParcelDrawer();
    closeSubmenuDrawer();
    setIsMoreDrawerOpen(true);
  }, [isMoreDrawerOpen, closeMoreDrawer, closeParcelDrawer, closeSubmenuDrawer]);

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
                        isOpen: isMoreDrawerOpen,
                        onToggle: toggleMoreDrawer,
                      }
                    : null
                }
                toggleParcelDrawer={toggleParcelDrawer}
                toggleSubmenuDrawer={toggleSubmenuDrawer}
                closeAllDrawers={closeAllDrawers}
                locale={locale}
                activeDrawerKey={activeSubmenuKey || activeParcelKey}
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
          <MoreDrawer
            isOpen={isMoreDrawerOpen}
            onClose={closeMoreDrawer}
            moreMenu={moreMenu}
            isLoading={isModulesLoading}
            locale={locale}
            toggleParcelDrawer={toggleParcelDrawer}
          />

          {layoutStore && (
            <MenuSettingsModal
              isOpen={isMenuSettingsOpen}
              onClose={handleCloseMenuSettings}
              menuStore={layoutStore}
              locale={locale}
            />
          )}

          <ParcelDrawer
            isOpen={!!parcelDrawerContent}
            onClose={closeParcelDrawer}
            parcelConfig={parcelDrawerContent}
          />

          <SubmenuDrawer
            isOpen={isSubmenuDrawerOpen}
            onClose={closeSubmenuDrawer}
            afterOpenChange={handleSubmenuDrawerAfterOpenChange}
            submenuItems={submenuDrawerContent}
            locale={locale}
            onItemClick={closeAllDrawers}
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
        </Layout>
      </Layout>
    </Layout>
  );
});
