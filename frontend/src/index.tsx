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
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

const config: Config = {
  readOnlyChainId: Mainnet.chainId,
  readOnlyUrls: {
    [Mainnet.chainId]: getDefaultProvider("mainnet"),
  },
};

const client = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/nezouse/degenheaven",
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <DAppProvider config={config}>
        <WalletProvider>
          <ChakraProvider theme={theme}>
            <App />
          </ChakraProvider>
        </WalletProvider>
      </DAppProvider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")!
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
