import { CloseCircleFilled, CloseOutlined, CopyOutlined } from "@ant-design/icons";
import { ServerErrorEventDetail } from "@saltbox/saltbox-frontend-common";
import { Button, message as staticMessage, notification } from "antd";
import { observer } from "mobx-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { serverErrorStore } from "../../../store/server-error-store";

import { ServerErrorAlertContent } from "./server-error-alert-content";
import styles from "./server-error-notifier.module.css";

const NOTIFICATION_KEY = "global-server-error";
const NOTIFICATION_DURATION_SECONDS = 0;

const buildStatusTitle = (detail: ServerErrorEventDetail): string | undefined => {
  if (detail.status <= 0) return undefined;
  return detail.statusText ? `${detail.status} ${detail.statusText}` : String(detail.status);
};

const buildDebugInfo = (detail: ServerErrorEventDetail, fallbackMessage: string): string => {
  const lines = [
    `Time: ${detail.timestamp}`,
    `Status: ${detail.status}${detail.statusText ? ` ${detail.statusText}` : ""}`,
    detail.method ? `Method: ${detail.method}` : null,
    `URL: ${detail.url}`,
    `Message: ${detail.message ?? fallbackMessage}`,
    detail.requestBody ? `Request body:\n${detail.requestBody}` : null,
    detail.responseBody ? `Response body:\n${detail.responseBody}` : null,
    `User-Agent: ${navigator.userAgent}`,
  ];
  return lines.filter(Boolean).join("\n");
};

export const ServerErrorNotifier = observer(() => {
  const { t } = useTranslation();
  const [notificationApi, notificationContextHolder] = notification.useNotification({
    placement: "topRight",
  });
  const [messageApi, messageContextHolder] = staticMessage.useMessage();
  const error = serverErrorStore.currentError;

  useEffect(() => {
    if (!error) {
      notificationApi.destroy(NOTIFICATION_KEY);
      return;
    }

    const fallbackMessage = t("errors.connection-error");
    const statusTitle = buildStatusTitle(error);
    const title = statusTitle ?? fallbackMessage;

    const handleClose = () => {
      notificationApi.destroy(NOTIFICATION_KEY);
      serverErrorStore.clearError();
    };

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(buildDebugInfo(error, fallbackMessage));
        messageApi.success({
          content: t("errors.debug-info-copied"),
          duration: 2,
          key: "global-server-error-copied",
        });
      } catch {
        messageApi.error({
          content: t("errors.debug-info-copy-failed"),
          duration: 3,
          key: "global-server-error-copy-failed",
        });
      }
    };

    notificationApi.error({
      key: NOTIFICATION_KEY,
      duration: NOTIFICATION_DURATION_SECONDS,
      className: styles.noticeSoft,
      icon: null,
      closable: false,
      message: (
        <div className={styles.titleRow}>
          <span className={styles.titleMain}>
            <CloseCircleFilled className={styles.titleIcon} />
            <span className={styles.titleText}>{title}</span>
          </span>
          <span className={styles.titleActions}>
            <Button
              icon={<CopyOutlined />}
              color="default"
              variant="outlined"
              size="small"
              title={t("errors.copy-debug-info")}
              aria-label={t("errors.copy-debug-info")}
              onClick={handleCopy}
            />
            <Button
              icon={<CloseOutlined />}
              color="default"
              variant="outlined"
              size="small"
              title={t("errors.close")}
              aria-label={t("errors.close")}
              onClick={handleClose}
            />
          </span>
        </div>
      ),
      description: (
        <ServerErrorAlertContent
          detail={error}
          labels={{
            showDetails: t("errors.show-details"),
            hideDetails: t("errors.hide-details"),
            method: t("errors.detail-method"),
            url: t("errors.detail-url"),
            status: t("errors.detail-status"),
            time: t("errors.detail-time"),
            responseBody: t("errors.detail-response-body"),
          }}
        />
      ),
      onClose: () => serverErrorStore.clearError(),
    });
  }, [error, messageApi, notificationApi, t]);

  return (
    <>
      {notificationContextHolder}
      {messageContextHolder}
    </>
  );
});
