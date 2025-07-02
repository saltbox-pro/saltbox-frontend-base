import { Layout, Menu, MenuProps, Dropdown, Button } from "antd";
import { Link } from "react-router";
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { observer } from "mobx-react";
import { useEffect, useRef } from "react";

const { Header, Sider, Content } = Layout;

import styles from "./app-layout.module.css";
import logo from "./logo.svg";
import { AuthStore } from "saltbox-root-config/store";
import { MenuItem, MenuStore } from "saltbox-root-config/store/menu-store";

export const generateMenuItems = (config: MenuItem[]): MenuProps["items"] => {
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
  authStore: AuthStore;
  menuStore: MenuStore;
}

export const AppLayout = observer(
  ({ authStore, menuStore }: AppLayoutProps) => {
    const containerRef = useRef<HTMLDivElement>(null);

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
          <Dropdown
            menu={{
              items: [
                {
                  key: "logout",
                  icon: <LogoutOutlined />,
                  label: "Logout",
                  onClick: handleLogout,
                },
              ],
            }}
          >
            <Button
              type="text"
              icon={<UserOutlined />}
              iconPosition="end"
              size="large"
            >
              {userDisplayName}
            </Button>
          </Dropdown>
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
