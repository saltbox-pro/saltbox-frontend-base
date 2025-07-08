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
import { MatIcon } from "./mat-icon";

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
}

export const AppLayout = observer(
  ({ authStore, menuStore }: AppLayoutProps) => {
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
          <Button.Group style={{ width: "100%" }}>
            <Popover
              content={
                <>
                  <Descriptions
                    column={1}
                    className={styles.popoverDescription}
                  >
                    <Descriptions.Item
                      label={t("mainmenu.popover-user-info-username")}
                    >
                      {authStore.user?.profile.preferred_username}
                    </Descriptions.Item>
                    <Descriptions.Item
                      label={t("mainmenu.popover-user-info-email")}
                    >
                      {authStore.user?.profile.email}
                    </Descriptions.Item>
                    <Descriptions.Item
                      label={t("mainmenu.popover-user-info-first-name")}
                    >
                      {authStore.user?.profile.given_name}
                    </Descriptions.Item>
                    <Descriptions.Item
                      label={t("mainmenu.popover-user-info-last-name")}
                    >
                      {authStore.user?.profile.family_name}
                    </Descriptions.Item>
                  </Descriptions>
                </>
              }
              title={t("mainmenu.popover-user-info")}
            >
              <Button
                style={{ flex: "1" }}
                color="primary"
                variant="text"
                className={styles.mainMenuUserButton}
                icon={<UserOutlined />}
                size={"large"}
                title={t("mainmenu.popover-user-info-title")}
                onClick={() => {
                  //window.location.href = `${envStore.env?.openIdAuthority}/account`;
                }}
              >
                {authStore.user?.profile.preferred_username}
              </Button>
            </Popover>
            {/* TODO */}
            {/*<Popover*/}
            {/*  title={t("mainmenu.popover-language-title")}*/}
            {/*  content={*/}
            {/*    <Flex vertical gap={8}>*/}
            {/*      {i18nStore.supportedLanguages.map((language) => (*/}
            {/*        <Button*/}
            {/*          key={language}*/}
            {/*          onClick={() => {*/}
            {/*            i18nStore.currentLanguage = language;*/}
            {/*          }}*/}
            {/*        >*/}
            {/*          {i18nStore.getLanguageLabel(language)}*/}
            {/*        </Button>*/}
            {/*      ))}*/}
            {/*    </Flex>*/}
            {/*  }*/}
            {/*>*/}
            {/*  <Flex*/}
            {/*    className={styles.mainMenuUserButton}*/}
            {/*    align="center"*/}
            {/*    justify="center"*/}
            {/*  >*/}
            {/*    {i18nStore.currentLanguageLabel}*/}
            {/*  </Flex>*/}
            {/*</Popover>*/}

            <Popover
              title={t("mainmenu.popover-support-help-center")}
              content={
                <Descriptions column={1} className={styles.popoverDescription}>
                  <Descriptions.Item
                    label={t("mainmenu.popover-support-help-center-version")}
                  >
                    0.0.0
                    {/* {__SALTBOX_VERSION__} */}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={t(
                      "mainmenu.popover-support-help-center-saltbox-home"
                    )}
                  >
                    <a href="https://saltbox.pro/" target="_blank">
                      saltbox.pro
                    </a>
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={t(
                      "mainmenu.popover-support-help-center-saltbox-documentation"
                    )}
                  >
                    <a href="https://saltbox.pro/docs/intro" target="_blank">
                      saltbox.pro/docs/intro
                    </a>
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={t(
                      "mainmenu.popover-support-help-center-saltbox-git"
                    )}
                  >
                    <a href="https://dev.saltbox.pro/explore" target="_blank">
                      dev.saltbox.pro{" "}
                    </a>
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={t("mainmenu.popover-support-help-center-email")}
                  >
                    <a href="mailto:info@saltbox.pro">info@saltbox.pro</a>
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={t(
                      "mainmenu.popover-support-help-center-saltbox-community-in-telegram"
                    )}
                  >
                    <a href="https://t.me/salt_box" target="_blank">
                      @salt_box
                    </a>
                  </Descriptions.Item>
                </Descriptions>
              }
            >
              <Button
                className={styles.mainMenuUserButton}
                icon={<MatIcon icon="help"></MatIcon>}
                color="primary"
                variant="text"
                size={"large"}
                title={t("mainmenu.popover-support-help-center")}
              />
            </Popover>

            <Button
              color="primary"
              variant="text"
              className={styles.mainMenuUserButton}
              icon={<MatIcon icon="logout"></MatIcon>}
              size={"large"}
              title={t("mainmenu.logout")}
              onClick={() => {
                //authStore.signOut(href);
              }}
            />
          </Button.Group>
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
