import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Config, DAppProvider, Mainnet } from "@usedapp/core";
import { getDefaultProvider } from "ethers";
import { WalletProvider } from "./providers/WalletProvider";
import { ChakraProvider } from "@chakra-ui/provider";
import { theme } from "./theme";

const config: Config = {
  readOnlyChainId: Mainnet.chainId,
  readOnlyUrls: {
    [Mainnet.chainId]: getDefaultProvider("mainnet"),
  },
};

ReactDOM.render(
  <React.StrictMode>
    <DAppProvider config={config}>
      <WalletProvider>
        <ChakraProvider theme={theme}>
          asfsfsa
          <App />
        </ChakraProvider>
      </WalletProvider>
    </DAppProvider>
  </React.StrictMode>,
  document.getElementById("root")!
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
