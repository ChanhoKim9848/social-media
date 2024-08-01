import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ChakraProvider, ColorModeScript, extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";

// mode color setting
const styles = {
  global: (props) => ({
    body: {
      // first is dark mode and second is light mode
      color: mode("gray.800", "whiteAlpha.900")(props),

      // background color
      bg: mode("gray100", "#101010")(props),
    },
  }),
};

// initial mode : dark
const config = {
  initialColorMode: "dark",
  useSystemColorMode: true,
};

// set gray color when it is dark and light mode
const colors = {
  gray: {
    light: "#616161",
    dark: "#1e1e1e",
  },
};

const theme = extendTheme({ config, styles, colors });

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RecoilRoot>
      <BrowserRouter>
        <ChakraProvider theme={theme}>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <App />
        </ChakraProvider>
      </BrowserRouter>
    </RecoilRoot>
  </React.StrictMode>
);
