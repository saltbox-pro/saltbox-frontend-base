import { message, notification } from "antd";

import { useToastBusSubscription } from "../hooks/use-toast-bus-subscription";
import { useUnhandledLoadNotification } from "../hooks/use-unhandled-load-notification";

/**
 * Единственный отрисовщик эфемерных сообщений на весь продукт. Две поверхности antd
 * в одном месте: notification (ошибки, действия, страховочная сетка) и message
 * (короткие подтверждения вроде копирования). Локальных инстансов в приложениях быть не должно.
 */
export const ToastHost = () => {
  const [notificationApi, notificationContextHolder] = notification.useNotification({
    maxCount: 5,
    stack: { threshold: 3 },
  });
  const [messageApi, messageContextHolder] = message.useMessage();

  useToastBusSubscription(notificationApi, messageApi);
  useUnhandledLoadNotification(notificationApi);

  return (
    <>
      {notificationContextHolder}
      {messageContextHolder}
    </>
  );
};
