import {
  CheckCircleFilled,
  GlobalOutlined,
  LogoutOutlined,
  UserOutlined,
  WarningFilled,
} from "@ant-design/icons";
import { Dropdown, Popover } from "@saltbox/saltbox-frontend-common";
import { Button, Descriptions, Flex, Typography } from "antd";
import { useTranslation } from "react-i18next";

import styles from "./menu-footer.module.css";

interface MenuFooterProps {
  authStore: any;
  localeStore: any;
  closeAllDrawers: () => void;
}

export function MenuFooter({ authStore, localeStore, closeAllDrawers }: MenuFooterProps) {
  const { t } = useTranslation();

  const handleLogout = () => {
    if (authStore) {
      authStore.signOut(window.location.href);
    }
  };

  const profile = authStore?.user?.profile;
  const username = profile?.preferred_username;
  const fullName =
    profile?.name ||
    [profile?.given_name, profile?.family_name].filter(Boolean).join(" ") ||
    undefined;
  const email = profile?.email;
  const emailVerified = profile?.email_verified;

  const userDisplayName = fullName || username || "User";

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

  return (
    <Flex className={styles.menuFooter} vertical gap={4}>
      <Popover
        placement="rightBottom"
        trigger="click"
        content={
          <div className={styles.popoverContent}>
            <div className={styles.userHeader}>
              <Typography.Text type="secondary" className={styles.loggedInAs}>
                {t("mainmenu.popover-user-logged-in-as")}
              </Typography.Text>
              <Typography.Text strong className={styles.username}>
                {username}
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
                    <Typography.Text>
                      {t("mainmenu.popover-user-email-not-verified")}
                    </Typography.Text>
                  </>
                )}
              </Flex>
            )}

            <Dropdown
              trigger={["click"]}
              placement="topRight"
              menu={{
                items: localeStore.supportedLocales.map((locale: string) => ({
                  key: locale,
                  label: locale.toUpperCase(),
                })),
                onClick: ({ key }) => localeStore.setLocale(key),
              }}
            >
              <Flex align="center" justify="space-between" className={styles.languageRow}>
                <Flex align="center" gap={8}>
                  <GlobalOutlined className={styles.languageRowIcon} />
                  <Typography.Text>{t("mainmenu.popover-user-language-select")}</Typography.Text>
                </Flex>
                <Typography.Text type="secondary">
                  {localeStore.currentLocale.toUpperCase()}
                </Typography.Text>
              </Flex>
            </Dropdown>

            <Flex justify="flex-end" gap="small" className={styles.logoutRow}>
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
          className={styles.fullWidthButton}
          onClick={closeAllDrawers}
        >
          {userDisplayName}
        </Button>
      </Popover>
    </Flex>
  );
}
