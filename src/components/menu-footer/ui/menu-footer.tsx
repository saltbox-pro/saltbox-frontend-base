import {
  CheckCircleFilled,
  GlobalOutlined,
  LogoutOutlined,
  UserOutlined,
  WarningFilled,
} from "@ant-design/icons";
import { LocalizedLanguageSwitcher, Popover, notify } from "@saltbox/saltbox-frontend-common";
import { Button, Descriptions, Flex, type MenuProps, Typography } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { SIDER_MENU_ITEM_OVERLAY_OPEN_CLASS } from "../../../shared/ui/sider-menu/constants";
import { SiderMenu } from "../../../shared/ui/sider-menu/sider-menu";

import styles from "./menu-footer.module.css";

type MenuClickInfo = Parameters<NonNullable<MenuProps["onClick"]>>[0];

interface MenuFooterProps {
  authStore: any;
  localeStore: any;
  closeAllDrawers: () => void;
}

export function MenuFooter({ authStore, localeStore, closeAllDrawers }: MenuFooterProps) {
  const { t } = useTranslation();
  const [isUserPopoverOpen, setIsUserPopoverOpen] = useState(false);

  const handleLogout = () => {
    if (authStore) {
      authStore.signOut(window.location.href);
    }
  };

  const handleLocaleChange = (locale: string) => {
    localeStore.setLocale(locale).catch(() => {
      notify.error({
        title: t("common:user-settings.language-save-failed-title"),
        description: t("common:user-settings.language-save-failed-description"),
      });
    });
  };

  const profile = authStore?.user?.profile;
  const username = profile?.preferred_username;
  const fullName =
    profile?.name ||
    [profile?.given_name, profile?.family_name].filter(Boolean).join(" ") ||
    undefined;
  const email = profile?.email;
  const emailVerified = profile?.email_verified;

  const userDisplayName = fullName || username || t("mainmenu.popover-user-fallback-name");

  const descriptionItems = [
    fullName && {
      key: "fullName",
      label: t("mainmenu.popover-user-info-full-name"),
      children: fullName,
    },
    email && {
      key: "email",
      label: t("mainmenu.popover-user-info-email"),
      children: email,
    },
  ].filter(Boolean) as { key: string; label: string; children: string }[];

  const handleUserItemClick = ({ domEvent }: MenuClickInfo) => {
    closeAllDrawers();

    if (domEvent.type === "keydown") {
      setIsUserPopoverOpen((prev) => !prev);
    }
  };

  const userMenuItems: MenuProps["items"] = [
    {
      key: "user",
      icon: <UserOutlined />,
      label: userDisplayName,
      onClick: handleUserItemClick,
      className: isUserPopoverOpen ? SIDER_MENU_ITEM_OVERLAY_OPEN_CLASS : undefined,
    },
  ];

  return (
    <Popover
      placement="rightBottom"
      trigger="click"
      open={isUserPopoverOpen}
      onOpenChange={setIsUserPopoverOpen}
      content={
        <div className={styles.popoverContent}>
          <div className={styles.userHeader}>
            <Typography.Text type="secondary" className={styles.loggedInAs}>
              {t("mainmenu.popover-user-logged-in-as")}
            </Typography.Text>
            <Typography.Text strong className={styles.username}>
              {username || userDisplayName}
            </Typography.Text>
          </div>

          {descriptionItems.length > 0 && (
            <Descriptions column={1} items={descriptionItems} className={styles.descriptions} />
          )}

          {emailVerified !== undefined && (
            <Flex align="center" gap={6} className={styles.emailStatus}>
              {emailVerified ? (
                <>
                  <CheckCircleFilled className={styles.emailVerifiedIcon} />
                  <Typography.Text>{t("mainmenu.popover-user-email-verified")}</Typography.Text>
                </>
              ) : (
                <>
                  <WarningFilled className={styles.emailNotVerifiedIcon} />
                  <Typography.Text>{t("mainmenu.popover-user-email-not-verified")}</Typography.Text>
                </>
              )}
            </Flex>
          )}

          <Flex align="center" justify="space-between" className={styles.languageRow}>
            <Flex align="center" gap={8}>
              <GlobalOutlined className={styles.languageRowIcon} />
              <Typography.Text>{t("mainmenu.popover-user-language-select")}</Typography.Text>
            </Flex>
            <LocalizedLanguageSwitcher
              value={localeStore.currentLocale}
              languages={localeStore.supportedLocales}
              onChange={handleLocaleChange}
            />
          </Flex>

          <div className={styles.logoutRow}>
            <Button
              type="text"
              icon={<LogoutOutlined className={styles.logoutRowIcon} />}
              onClick={handleLogout}
              className={styles.logoutRowButton}
            >
              {t("mainmenu.popover-user-logout-button")}
            </Button>
          </div>
        </div>
      }
    >
      <div className={styles.container}>
        <SiderMenu items={userMenuItems} />
      </div>
    </Popover>
  );
}
