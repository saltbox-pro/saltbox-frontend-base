import {
  ToastEventDetail,
  UiEvent,
  publish,
  subscribe,
  unsubscribe,
  type ShowToast,
} from "@saltbox/saltbox-frontend-common";
import { useEffect } from "react";

/**
 * Единственный подписчик UiEvent.Toast на весь продукт: один стек, один порядок,
 * replace по key. Handshake: window-флаг покрывает приложения, загрузившиеся позже
 * host-а, ready-событие сливает буферы загрузившихся раньше.
 */
export function useToastBusSubscription(showToast: ShowToast): void {
  useEffect(() => {
    const listener = (event: Event) => {
      const detail = (event as CustomEvent<ToastEventDetail>).detail;
      if (!detail) return;
      showToast(detail);
    };

    subscribe(UiEvent.Toast, listener);
    window.__saltboxToastHostReady = true;
    publish(UiEvent.ToastHostReady, undefined);

    return () => {
      window.__saltboxToastHostReady = false;
      unsubscribe(UiEvent.Toast, listener);
    };
  }, [showToast]);
}
