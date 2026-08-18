import { useToastRenderer, useUploadNoticeHost } from "@saltbox/saltbox-frontend-common";
import { message, notification } from "antd";
import { Fragment } from "react";
import { navigateToUrl } from "single-spa";

import { useToastBusSubscription } from "../hooks/use-toast-bus-subscription";
import { useUnhandledLoadNotification } from "../hooks/use-unhandled-load-notification";

/**
 * Единственный отрисовщик эфемерных сообщений на весь продукт: toast notification,
 * message и upload notice. Локальных инстансов в приложениях быть не должно.
 */
export const ToastHost = () => {
  const [notificationApi, notificationContextHolder] = notification.useNotification({
    maxCount: 5,
    stack: { threshold: 3 },
  });
  const [uploadNotificationApi, uploadNotificationContextHolder] = notification.useNotification({
    placement: "bottomRight",
    maxCount: 8,
    stack: false,
  });
  const [messageApi, messageContextHolder] = message.useMessage();

  const showToast = useToastRenderer(notificationApi, messageApi, { onNavigate: navigateToUrl });

  useToastBusSubscription(showToast);
  useUnhandledLoadNotification(showToast);
  useUploadNoticeHost(uploadNotificationApi);

  return (
    <>
      <Fragment key="toast-notification-holder">{notificationContextHolder}</Fragment>
      <Fragment key="upload-notification-holder">{uploadNotificationContextHolder}</Fragment>
      <Fragment key="toast-message-holder">{messageContextHolder}</Fragment>
    </>
  );
};
