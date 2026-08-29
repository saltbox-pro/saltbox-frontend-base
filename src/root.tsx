import { publish, UiEvent, CleanupEventDetail } from "@saltbox/saltbox-frontend-common";
import { Result, Spin, Button, Flex } from "antd";
import { autorun } from "mobx";
import { observer } from "mobx-react";
import { useEffect } from "react";
import { BrowserRouter, useNavigate, useLocation } from "react-router";

import { AppLayout } from "./app-layout";
import { ToastHost } from "./components/toast-host";
import { i18nStore } from "./store/i18n-store";

const AuthWrapper = observer(({ authStore, children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (authStore && authStore.userConfig && !authStore.userManager && !authStore.isLoading) {
      authStore.initialize();
    }
  }, [authStore, authStore.userConfig, authStore.userManager, authStore.isLoading]);

  useEffect(() => {
    if (authStore.userManager && authStore.userConfig && !authStore.user && !authStore.isSignOut) {
      const urlParams = new URLSearchParams(window.location.search);
      const state = urlParams.get("state");

      if (state) {
        authStore.handleSigninRedirectCallback()?.then(() => {
          const pathname = location.pathname;
          const urlParams = new URLSearchParams(window.location.search);
          urlParams.delete("state");
          urlParams.delete("session_state");
          urlParams.delete("code");
          urlParams.delete("iss");
          const search = urlParams.toString();
          const searchString = search ? `?${search}` : "";

          if (pathname === "/") {
            navigate(`/core/minions${searchString}`);
          } else {
            navigate(`${pathname}${searchString}`);
          }
        });
      } else {
        authStore.signIn(window.location.href);
      }
    }
  }, [authStore.userConfig, authStore.userManager, authStore.user, navigate, location.pathname]);

  useEffect(() => {
    if (authStore.error) {
      // Publish UI event to close everything on the screen
      publish<CleanupEventDetail>(UiEvent.CloseAllOverlays, {
        reason: "auth_error",
        context: { error: authStore.error.message },
      });
    }
  }, [authStore.error]);

  if (authStore.error) {
    return (
      <Result
        status="error"
        title="Authentication error"
        subTitle={authStore.error.message}
        extra={[
          <Button
            key="logout"
            type="primary"
            onClick={() => authStore.signOut(window.location.href)}
          >
            Logout
          </Button>,
        ]}
      />
    );
  }

  if (!authStore.userManager || !authStore.user || authStore.isLoading) {
    return (
      <Flex align="center" justify="center" style={{ height: "100vh" }}>
        <Spin size="large" />
      </Flex>
    );
  }

  return children;
});

export default observer(function Root(props) {
  const { authStore, menuStore, localeStore } = props;

  useEffect(() => {
    autorun(() => {
      i18nStore.currentLanguage = localeStore.currentLocale;
    });
  }, []);

  return (
    <BrowserRouter>
      <ToastHost />
      <AuthWrapper authStore={authStore}>
        <AppLayout authStore={authStore} menuStore={menuStore} localeStore={localeStore} />
      </AuthWrapper>
    </BrowserRouter>
  );
});
