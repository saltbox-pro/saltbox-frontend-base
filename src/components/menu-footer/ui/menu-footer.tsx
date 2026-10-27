import {
  CheckCircleFilled,
  ControlOutlined,
  GlobalOutlined,
  LogoutOutlined,
  UserOutlined,
  WarningFilled,
} from "@ant-design/icons";
import { LocalizedLanguageSwitcher, Popover, notify } from "@saltbox/saltbox-frontend-common";
import { Button, Descriptions, Divider, Flex, type MenuProps, Typography } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { cn } from "../../../shared/lib/cn";
import { SIDER_MENU_ITEM_OVERLAY_OPEN_CLASS } from "../../../shared/ui/sider-menu/constants";
import { SiderMenu } from "../../../shared/ui/sider-menu/sider-menu";

import styles from "./menu-footer.module.css";

type MenuClickInfo = Parameters<NonNullable<MenuProps["onClick"]>>[0];

interface MenuFooterProps {
  authStore: any;
  localeStore: any;
  closeAllDrawers: () => void;
  onOpenMenuSettings?: () => void;
}

export function MenuFooter({
  authStore,
  localeStore,
  closeAllDrawers,
  onOpenMenuSettings,
}: MenuFooterProps) {
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

          <Divider className={styles.divider} />

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

          {(descriptionItems.length > 0 || emailVerified !== undefined) && (
            <Divider className={styles.divider} />
          )}

          <Flex align="center" justify="space-between" className={styles.actionRow}>
            <Flex align="center" gap={8}>
              <GlobalOutlined className={styles.actionRowIcon} />
              <Typography.Text>{t("mainmenu.popover-user-language-select")}</Typography.Text>
            </Flex>
            <LocalizedLanguageSwitcher
              value={localeStore.currentLocale}
              languages={localeStore.supportedLocales}
              onChange={handleLocaleChange}
            />
          </Flex>

          {!!onOpenMenuSettings && (
            <Button
              type="text"
              icon={<ControlOutlined className={styles.actionRowIcon} />}
              onClick={() => {
                setIsUserPopoverOpen(false);
                onOpenMenuSettings();
              }}
              className={cn(styles.actionRow, styles.actionRowButton)}
            >
              {t("mainmenu.menu-settings-button")}
            </Button>
          )}

          <Divider className={styles.divider} />

          <Button
            type="text"
            icon={<LogoutOutlined className={styles.logoutIcon} />}
            onClick={handleLogout}
            className={cn(styles.actionRow, styles.actionRowButton)}
          >
            {t("mainmenu.popover-user-logout-button")}
          </Button>
        </div>
      }
    >
      <div className={styles.container}>
        <SiderMenu items={userMenuItems} />
      </div>
    </Popover>
  );
}
