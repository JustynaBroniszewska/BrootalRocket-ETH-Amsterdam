import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import {
  Config,
  DAppProvider,
  Mainnet,
  OptimismKovan,
  Polygon,
} from "@usedapp/core";
import { getDefaultProvider } from "ethers";
import { WalletProvider } from "./providers/WalletProvider";
import { SiweProvider } from "./providers/SiweProvider";
import { ChakraProvider } from "@chakra-ui/provider";
import { theme } from "./theme";
import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";

const config: Config = {
  readOnlyChainId: Polygon.chainId,
  readOnlyUrls: {
    [Mainnet.chainId]: getDefaultProvider("mainnet"),
    [OptimismKovan.chainId]: "https://kovan.optimism.io",
    [Polygon.chainId]: "https://rpc-mainnet.matic.network",
  },
};

export enum Subgraphs {
  Optimism,
  Polygon,
}

const SUBGRAPH_URLS = {
  [Subgraphs.Optimism]:
    "https://api.thegraph.com/subgraphs/name/nezouse/degenheaven",
  [Subgraphs.Polygon]:
    "https://api.thegraph.com/subgraphs/name/nezouse/degenheavenpolygon",
} as const;

const getApolloLink = new ApolloLink((operation) => {
  const subgraph = operation.getContext().subgraph as Subgraphs;
  const uri = SUBGRAPH_URLS[subgraph];
  const link = new HttpLink({ uri, fetch });
  return link.request(operation);
});

const client = new ApolloClient({
  link: getApolloLink,
  cache: new InMemoryCache(),
});

export const optClient = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/nezouse/degenheaven",
  cache: new InMemoryCache(),
});

export const polyClient = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/nezouse/degenheavenpolygon",
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <DAppProvider config={config}>
        <WalletProvider>
          <SiweProvider>
            <ChakraProvider theme={theme}>
              <App />
            </ChakraProvider>
          </SiweProvider>
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
