import { useToastRenderer } from "@saltbox/saltbox-frontend-common";
import { message, notification } from "antd";
import { navigateToUrl } from "single-spa";

import { useToastBusSubscription } from "../hooks/use-toast-bus-subscription";
import { useUnhandledLoadNotification } from "../hooks/use-unhandled-load-notification";

/**
 * Единственный отрисовщик эфемерных сообщений на весь продукт. Две поверхности antd
 * в одном месте: notification (ошибки, действия, страховочная сетка) и message
 * (короткие подтверждения вроде копирования). Локальных инстансов в приложениях быть не должно.
 * Сама отрисовка — общий useToastRenderer из common, чтобы Storybook не расходился с продуктом.
 */
export const ToastHost = () => {
  const [notificationApi, notificationContextHolder] = notification.useNotification({
    maxCount: 5,
    stack: { threshold: 3 },
  });
  const [messageApi, messageContextHolder] = message.useMessage();

  const showToast = useToastRenderer(notificationApi, messageApi, { onNavigate: navigateToUrl });

  useToastBusSubscription(showToast);
  useUnhandledLoadNotification(showToast);

  return (
    <>
      {notificationContextHolder}
      {messageContextHolder}
    </>
  );
};
