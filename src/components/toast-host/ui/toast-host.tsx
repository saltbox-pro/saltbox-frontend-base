import { useToastRenderer, useUploadNoticeHost } from "@saltbox/saltbox-frontend-common";
import { message, notification } from "antd";
import { Fragment } from "react";
import { navigateToUrl } from "single-spa";

import { useToastBusSubscription } from "../hooks/use-toast-bus-subscription";
import { useUnhandledLoadNotification } from "../hooks/use-unhandled-load-notification";

/**
 * Единственный отрисовщик эфемерных сообщений на весь продукт: toast notification,
 * message и progress-notice (upload/download). Локальных инстансов в приложениях быть не должно.
 */
export const ToastHost = () => {
  const [notificationApi, notificationContextHolder] = notification.useNotification({
    maxCount: 5,
    stack: { threshold: 3 },
  });
  const [transferNoticeApi, transferNoticeContextHolder] = notification.useNotification({
    placement: "bottomRight",
    maxCount: 8,
    stack: false,
  });
  const [messageApi, messageContextHolder] = message.useMessage();

  const showToast = useToastRenderer(notificationApi, messageApi, { onNavigate: navigateToUrl });

  useToastBusSubscription(showToast);
  useUnhandledLoadNotification(showToast);
  useUploadNoticeHost(transferNoticeApi);

  return (
    <>
      <Fragment key="toast-notification-holder">{notificationContextHolder}</Fragment>
      <Fragment key="transfer-notice-holder">{transferNoticeContextHolder}</Fragment>
      {messageContextHolder}
    </>
  );
};
