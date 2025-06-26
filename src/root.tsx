import { Result, Spin, Button, Flex } from "antd";
import { BrowserRouter, useNavigate, useLocation } from "react-router";
import { observer } from "mobx-react";
import { useEffect } from "react";
import { AppLayout } from "./app-layout";

const AuthWrapper = observer(({ authStore, children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (authStore && !authStore.userManager && !authStore.isLoading) {
      authStore.initialize();
    }
  }, [authStore]);

  useEffect(() => {
    if (authStore.userManager && !authStore.user && !authStore.isSignOut) {
      const urlParams = new URLSearchParams(window.location.search);
      const state = urlParams.get("state");

      if (state) {
        authStore.handleSigninRedirectCallback()?.then(() => {
          navigate({});
        });
      } else {
        authStore.signIn(window.location.origin + location.pathname);
      }
    }
  }, [authStore.userManager, authStore.user, navigate, location.pathname]);

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
  const { authStore, menuConfig } = props;

  return (
    <BrowserRouter>
      <AuthWrapper authStore={authStore}>
        <AppLayout authStore={authStore} menuConfig={menuConfig} />
      </AuthWrapper>
    </BrowserRouter>
  );
});
