import { Layout, Flex, Spin } from "antd";
import { observer } from "mobx-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";

import "./app-layout.css";
import styles from "./app-layout.module.css";
import { Logo } from "./components/logo";
import { MainMenu } from "./components/main-menu";
import { MenuFooter } from "./components/menu-footer";
import { ParcelDrawer } from "./components/parcel-drawer";
import { SettingsDrawer } from "./components/settings-drawer";
import { SettingsMenuBar } from "./components/settings-menu-bar";
import { SiderCollapseToggle } from "./components/sider-collapse-toggle";
import { SubmenuDrawer } from "./components/submenu-drawer";
import { SIDER_COLLAPSED_WIDTH, SIDER_WIDTH } from "./shared/config/sider";
import { useSiderCollapsed } from "./shared/lib/use-sider-collapsed";
import { ModuleAccessError } from "./shared/ui/module-access-error/module-access-error";

const { Sider, Content } = Layout;

interface AppLayoutProps {
  authStore: any;
  menuStore: any;
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
  const [isSettingsDrawerOpen, setIsSettingsDrawerOpen] = useState(false);
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

  const closeSettingsDrawer = useCallback(() => {
    setIsSettingsDrawerOpen(false);
  }, []);

  const closeAllDrawers = useCallback(() => {
    closeParcelDrawer();
    closeSubmenuDrawer();
    closeSettingsDrawer();
  }, [closeParcelDrawer, closeSubmenuDrawer, closeSettingsDrawer]);

  const toggleParcelDrawer = useCallback(
    (content: any, menuKey: string) => {
      if (parcelDrawerContent && activeParcelKey === menuKey) {
        closeParcelDrawer();
        return;
      }

      closeSettingsDrawer();
      closeSubmenuDrawer();
      setParcelDrawerContent(content);
      setActiveParcelKey(menuKey);
    },
    [
      parcelDrawerContent,
      activeParcelKey,
      closeParcelDrawer,
      closeSettingsDrawer,
      closeSubmenuDrawer,
    ]
  );

  const toggleSubmenuDrawer = useCallback(
    (submenu: any[], menuKey: string) => {
      if (isSubmenuDrawerOpen && activeSubmenuKey === menuKey) {
        closeSubmenuDrawer();
        return;
      }

      closeSettingsDrawer();
      closeParcelDrawer();
      setSubmenuDrawerContent(submenu);
      setActiveSubmenuKey(menuKey);
      setIsSubmenuDrawerOpen(true);
    },
    [
      isSubmenuDrawerOpen,
      activeSubmenuKey,
      closeSubmenuDrawer,
      closeSettingsDrawer,
      closeParcelDrawer,
    ]
  );

  const handleSubmenuDrawerAfterOpenChange = (open: boolean) => {
    if (!open) {
      setSubmenuDrawerContent(null);
      setActiveSubmenuKey(null);
    }
  };

  const toggleSettingsDrawer = useCallback(() => {
    if (isSettingsDrawerOpen) {
      closeSettingsDrawer();
      return;
    }

    closeParcelDrawer();
    closeSubmenuDrawer();
    setIsSettingsDrawerOpen(true);
  }, [isSettingsDrawerOpen, closeSettingsDrawer, closeParcelDrawer, closeSubmenuDrawer]);

  const isModulesLoading = menuStore.isModulesLoading ?? false;
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

            <MainMenu
              menu={menuStore.sortedMenu}
              toggleParcelDrawer={toggleParcelDrawer}
              toggleSubmenuDrawer={toggleSubmenuDrawer}
              closeAllDrawers={closeAllDrawers}
              locale={localeStore.currentLocale}
              activeDrawerKey={activeSubmenuKey || activeParcelKey}
              isCollapsed={isCollapsed}
            />

            <SettingsMenuBar
              settingsMenu={menuStore.sortedSettingsMenu}
              isSettingsDrawerOpen={isSettingsDrawerOpen}
              toggleSettingsDrawer={toggleSettingsDrawer}
            />

            <MenuFooter
              authStore={authStore}
              localeStore={localeStore}
              closeAllDrawers={closeAllDrawers}
            />

            <SiderCollapseToggle isCollapsed={isCollapsed} onToggle={toggleCollapsed} />
          </Flex>
        </Sider>
        <Layout className={styles.mainLayoutContentWrapper}>
          <SettingsDrawer
            isOpen={isSettingsDrawerOpen}
            onClose={closeSettingsDrawer}
            settingsMenu={menuStore.sortedSettingsMenu}
            locale={localeStore.currentLocale}
          />

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
            locale={localeStore.currentLocale}
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
            {shouldShowLoading ? (
              <Flex align="center" justify="center" style={{ width: "100%", height: "100%" }}>
                <Spin size="large" />
              </Flex>
            ) : null}
            {shouldShowModuleError ? <ModuleAccessError /> : null}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
});
