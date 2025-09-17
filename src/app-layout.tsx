import {
  Layout,
  Menu,
  MenuProps,
  Dropdown,
  Button,
  Descriptions,
  Flex,
  Popover,
  Drawer,
} from "antd";
import { Link } from "react-router";
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { observer } from "mobx-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const { Sider, Content } = Layout;

import logo from "./logo.svg";
import Parcel from "single-spa-react/parcel";

import styles from "./app-layout.module.css";
import "./app-layout.css";
import { MatIcon, MatIconProps } from "./mat-icon";

const MenuItemLabel = ({
  label,
  icon,
}: {
  label: string;
  icon: MatIconProps["icon"];
}) => {
  return (
    <Flex gap="small" align="center">
      <MatIcon icon={icon} size="small" />
      {label}
    </Flex>
  );
};

export const generateMainMenuItems = (
  config: any[],
  showDrawer: (content: any) => void,
  closeAllDrawers: () => void,
  locale: string
): MenuProps["items"] => {
  const items: MenuProps["items"] = [];
  config.forEach((item) => {
    if (item.children) {
      items.push({
        type: "group",
        key: item.key,
        label: item.label,
      });

      item.children.forEach((child) => {
        const elementLabel = child.label[locale];
        items.push({
          key: child.key,
          label:
            child.path && !child.drawer ? (
              <Link to={child.path}>
                <MenuItemLabel icon={child.icon} label={elementLabel} />
              </Link>
            ) : (
              <MenuItemLabel icon={child.icon} label={elementLabel} />
            ),
          onClick: child.drawer
            ? () => showDrawer(child.drawer)
            : closeAllDrawers,
        });
      });
    } else {
      items.push({
        key: item.key,
        label: item.path ? (
          <Link to={item.path}>
            <MenuItemLabel icon={item.icon} label={item.label} />
          </Link>
        ) : (
          <MenuItemLabel icon={item.icon} label={item.label} />
        ),
      });
    }
  });

  return items;
};

export const generateSettingsMenuItems = (
  config: any[],
  closeDrawer: () => void,
  locale: string
): MenuProps["items"] => {
  const items: MenuProps["items"] = [];

  config.forEach((item) => {
    if (item.children) {
      items.push({
        type: "group",
        key: item.key,
        label: item.label,
      });

      item.children.forEach((child) => {
        const elementLabel = child.label[locale];
        items.push({
          key: child.key,
          label: (
            <Link to={child.path} onClick={() => closeDrawer()}>
              <MenuItemLabel icon={child.icon} label={elementLabel} />
            </Link>
          ),
        });
      });
    }
  });

  return items;
};

interface AppLayoutProps {
  authStore: any;
  menuStore: any;
  localeStore: any;
}

export const AppLayout = observer(
  ({ authStore, menuStore, localeStore }: AppLayoutProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { t } = useTranslation();

    const [parcelDrawerContent, setParcelDrawerContent] = useState<any>();
    const [isSettingsDrawerOpen, setIsSettingsDrawerOpen] = useState(false);

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

    const showParcelDrawer = (content: any) => {
      closeSettingsDrawer();
      setParcelDrawerContent(content);
    };

    const closeParcelDrawer = () => {
      setParcelDrawerContent(undefined);
    };

    const showSettingsDrawer = () => {
      closeParcelDrawer();
      setIsSettingsDrawerOpen(true);
    };

    const closeSettingsDrawer = () => {
      setIsSettingsDrawerOpen(false);
    };

    const closeAllDrawers = () => {
      closeParcelDrawer();
      closeSettingsDrawer();
    };

    const handleLogout = () => {
      if (authStore) {
        authStore.signOut(window.location.href);
      }
    };

    const userDisplayName =
      authStore?.user?.profile?.name ||
      authStore?.user?.profile?.preferred_username ||
      "User";

    const monitoringMenuItem: MenuProps["items"] = [
      //TODO rework monitoring menu
      {
        type: "group",
        key: "monitoring",
        label: "Monitoring",
      },
      {
        key: "dashboard",
        label: (
          <a href={"/grafana"}>
            <MenuItemLabel
              icon={undefined as any}
              label={
                localeStore.currentLocale === "ru" ? "Дашборд" : "Dashboard"
              }
            />
          </a>
        ),
      },
      {
        key: "logs",
        label: (
          <a href={"/grafana/a/grafana-lokiexplore-app"}>
            <MenuItemLabel
              icon={undefined as any}
              label={localeStore.currentLocale === "ru" ? "Логи" : "Logs"}
            />
          </a>
        ),
      },
    ];
    return (
      <Layout className={styles.layout}>
        <Layout className={styles.mainLayout}>
          <Sider
            width={250}
            style={{ background: "white" }}
            className={styles.sider}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                justifyContent: "space-between",
              }}
            >
              <Link
                to="/core/minions"
                className={styles.logoContainer}
                onClick={closeAllDrawers}
              >
                <img src={logo} alt="SALT.BOX" className={styles.logo} />
              </Link>
              <Menu
                selectedKeys={[]}
                mode="vertical"
                style={{ borderRight: 0, flex: 1, overflow: "auto" }}
                items={generateMainMenuItems(
                  menuStore.sortedMenu,
                  showParcelDrawer,
                  closeAllDrawers,
                  localeStore.currentLocale
                )}
              />
              <div className={styles.menuButtons}>
                <Button
                  type="text"
                  icon={<SettingOutlined />}
                  style={{ width: "100%" }}
                  size="large"
                  onClick={showSettingsDrawer}
                >
                  {t("mainmenu.settings-button")}
                </Button>
                <Popover
                  placement="rightBottom"
                  trigger="click"
                  content={
                    <div className={styles.popoverContent}>
                      <Descriptions
                        column={1}
                        items={[
                          {
                            label: t("mainmenu.popover-user-info-username"),
                            children:
                              authStore.user?.profile.preferred_username,
                          },
                          {
                            label: t("mainmenu.popover-user-info-email"),
                            children: authStore.user?.profile.email,
                          },
                          {
                            label: t("mainmenu.popover-user-info-first-name"),
                            children: authStore.user?.profile.given_name,
                          },
                          {
                            label: t("mainmenu.popover-user-info-last-name"),
                            children: authStore.user?.profile.family_name,
                          },
                        ]}
                      />
                      <Flex justify="flex-end" gap="small">
                        <Dropdown
                          menu={{
                            items: localeStore.supportedLocales.map(
                              (locale) => {
                                return {
                                  key: locale,
                                  label: locale.toUpperCase(),
                                };
                              }
                            ),
                            onClick: ({ key }) => localeStore.setLocale(key),
                          }}
                        >
                          <Button color="primary" variant="text">
                            {localeStore.currentLocale.toUpperCase()}
                          </Button>
                        </Dropdown>
                        <Button
                          color="primary"
                          variant="text"
                          icon={<LogoutOutlined />}
                          onClick={handleLogout}
                        >
                          {t("mainmenu.popover-user-logout-button")}
                        </Button>
                      </Flex>
                    </div>
                  }
                >
                  <Button
                    type="text"
                    icon={<UserOutlined />}
                    size="large"
                    style={{ width: "100%" }}
                    onClick={closeAllDrawers}
                  >
                    {userDisplayName}
                  </Button>
                </Popover>
              </div>
            </div>
          </Sider>
          <Layout className={styles.mainLayoutContentWrapper}>
            <Drawer
              onClose={closeSettingsDrawer}
              open={isSettingsDrawerOpen}
              placement="left"
              getContainer={false}
            >
              <Menu
                selectedKeys={[]}
                mode="vertical"
                style={{ borderRight: 0, flex: 1 }}
                items={[
                  ...generateSettingsMenuItems(
                    menuStore.sortedSettingsMenu,
                    closeSettingsDrawer,
                    localeStore.currentLocale
                  ),
                  ...monitoringMenuItem,
                ]}
              />
            </Drawer>
            <Drawer
              onClose={closeParcelDrawer}
              open={parcelDrawerContent}
              placement="left"
              getContainer={false}
            >
              <Parcel
                config={parcelDrawerContent}
                wrapWith="div"
                onClose={closeParcelDrawer}
              />
            </Drawer>
            <Content className={styles.mainLayoutContent}>
              <div
                ref={containerRef}
                id="app-container"
                className={styles.appContainer}
              ></div>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    );
  }
);
