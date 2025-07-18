import {
  Layout,
  Menu,
  MenuProps,
  Dropdown,
  Button,
  Descriptions,
  Flex,
  Popover,
} from "antd";
import { Link } from "react-router";
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { observer } from "mobx-react";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

const { Header, Sider, Content } = Layout;

import styles from "./app-layout.module.css";
import logo from "./logo.svg";

export const generateMenuItems = (config: any[]): MenuProps["items"] => {
  const items: MenuProps["items"] = [];

  config.forEach((item) => {
    if (item.children) {
      items.push({
        type: "group",
        key: item.key,
        label: item.label,
      });

      item.children.forEach((child) => {
        items.push({
          key: child.key,
          label: child.path ? (
            <Link to={child.path}>{child.label}</Link>
          ) : (
            child.label
          ),
        });
      });
    } else {
      items.push({
        key: item.key,
        label: item.path ? (
          <Link to={item.path}>{item.label}</Link>
        ) : (
          item.label
        ),
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

    const handleLogout = () => {
      if (authStore) {
        authStore.signOut();
      }
    };

    const userDisplayName =
      authStore?.user?.profile?.name ||
      authStore?.user?.profile?.preferred_username ||
      "User";

    return (
      <Layout style={{ height: "100vh" }}>
        <Header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "white",
          }}
        >
          <Link to="/">
            <img src={logo} alt="SALT.BOX" width="180px" height="34px" />
          </Link>
          <Popover
            trigger="click"
            content={
              <div style={{ width: "400px" }}>
                <Descriptions
                  column={1}
                  items={[
                    {
                      label: t("mainmenu.popover-user-info-username"),
                      children: authStore.user?.profile.preferred_username,
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
                  <Button
                    color="primary"
                    variant="text"
                    icon={<LogoutOutlined />}
                    onClick={handleLogout}
                  />
                  <Dropdown
                    menu={{
                      items: localeStore.supportedLocales.map((locale) => {
                        return { key: locale, label: locale.toUpperCase() };
                      }),
                      onClick: ({ key }) => localeStore.setLocale(key),
                    }}
                  >
                    <Button color="primary" variant="text">
                      {localeStore.currentLocale.toUpperCase()}
                    </Button>
                  </Dropdown>
                </Flex>
              </div>
            }
          >
            <Button
              type="text"
              icon={<UserOutlined />}
              iconPosition="end"
              size="large"
            >
              {userDisplayName}
            </Button>
          </Popover>
        </Header>
        <Layout style={{ height: "calc(100vh - 64px)" }}>
          <Sider width={280} style={{ background: "white" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                justifyContent: "space-between",
              }}
            >
              <Menu
                mode="inline"
                defaultSelectedKeys={["1"]}
                defaultOpenKeys={["sub1"]}
                style={{ borderRight: 0, flex: 1 }}
                items={generateMenuItems(menuStore.menu)}
              />
              <div style={{ padding: 16 }}>
                <Button
                  type="text"
                  icon={<SettingOutlined />}
                  style={{ width: "100%" }}
                  size="large"
                >
                  Settings
                </Button>
              </div>
            </div>
          </Sider>
          <Layout>
            <Content
              style={{
                margin: 0,
                minHeight: 280,
                background: "white",
                overflow: "auto",
                height: "100%",
              }}
            >
              <div
                ref={containerRef}
                id="app-container"
                style={{ height: "100%" }}
              ></div>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    );
  }
);
