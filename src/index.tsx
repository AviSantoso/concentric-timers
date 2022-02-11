import * as React from "react";
import { render } from "react-dom";
import { ChakraProvider, extendTheme, ThemeConfig } from "@chakra-ui/react";

import App from "./App";

// theme.ts

// 1. import `extendTheme` function

// 2. Add your color mode config
const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false
};

const theme = extendTheme({ config });

const rootElement = document.getElementById("root");
render(
  <ChakraProvider theme={theme}>
    <App />
  </ChakraProvider>,
  rootElement
);
