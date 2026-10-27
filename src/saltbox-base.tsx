import "@saltbox/saltbox-frontend-common/material-symbols";
import {
  createSingleSpaErrorBoundary,
  preloadMaterialSymbolsFont,
} from "@saltbox/saltbox-frontend-common";
import React from "react";
import ReactDOMClient from "react-dom/client";
import singleSpaReact from "single-spa-react";

import Root from "./root";

preloadMaterialSymbolsFont();

const lifecycles = singleSpaReact({
  React,
  ReactDOMClient,
  rootComponent: Root,
  errorBoundary: createSingleSpaErrorBoundary("Base"),
});

export const { bootstrap, mount, unmount } = lifecycles;
