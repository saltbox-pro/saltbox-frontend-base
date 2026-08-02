import { notification } from "antd";

import { useToastBusSubscription } from "../hooks/use-toast-bus-subscription";
import { useUnhandledLoadNotification } from "../hooks/use-unhandled-load-notification";

/**
 * Единственный стек уведомлений на весь продукт. Два источника, один antd-инстанс:
 * - шина UiEvent.Toast (runMutation/notify всех микрофронтендов);
 * - страховочная сетка необработанных ошибок загрузки.
 */
export const ToastHost = () => {
  const [notificationApi, notificationContextHolder] = notification.useNotification({
    maxCount: 5,
    stack: { threshold: 3 },
  });
  useToastBusSubscription(notificationApi);
  useUnhandledLoadNotification(notificationApi);

  return notificationContextHolder;
};
