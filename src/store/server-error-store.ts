import {
  ServerErrorEventDetail,
  UiEvent,
  subscribe,
  unsubscribe,
} from "@saltbox/saltbox-frontend-common";
import { makeAutoObservable } from "mobx";

class ServerErrorStore {
  currentError: ServerErrorEventDetail | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  private handler = (event: Event) => {
    const detail = (event as CustomEvent<ServerErrorEventDetail>).detail;
    if (!detail) return;
    this.setError(detail);
  };

  setError(detail: ServerErrorEventDetail) {
    this.currentError = detail;
  }

  clearError() {
    this.currentError = null;
  }

  init() {
    subscribe(UiEvent.ServerError, this.handler);
  }

  dispose() {
    unsubscribe(UiEvent.ServerError, this.handler);
    this.clearError();
  }
}

export const serverErrorStore = new ServerErrorStore();
