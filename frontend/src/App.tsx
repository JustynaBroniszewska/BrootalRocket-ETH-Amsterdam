import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

import { useEthers, ChainId } from "@usedapp/core";

const NETWORK_CONNECTIONS = {
  [ChainId.Mainnet]:
    "https://mainnet.infura.io/v3/f88abc181a4a45a6bc47bdda05a94944",
  [ChainId.Ropsten]:
    "https://ropsten.infura.io/v3/f88abc181a4a45a6bc47bdda05a94944",
};

function App() {
  const { account, activateBrowserWallet, deactivate, activate } = useEthers();

  const deactivateWallet = () => {
    localStorage.removeItem("walletconnect");
    deactivate();
  };
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <p>{account}</p>
        <button
          onClick={async () => {
            if (!account) {
              try {
                await activate(
                  new WalletConnectConnector({
                    rpc: NETWORK_CONNECTIONS,
                    bridge: "https://bridge.walletconnect.org",
                    qrcode: true,
                  })
                );
              } catch (error) {
                console.log(error);
              }
            } else {
              deactivateWallet();
            }
          }}
        >
          {account ? "Already connected" : "Connect with walletconnect"}
        </button>
        <button
          onClick={() => {
            account ? deactivateWallet() : activateBrowserWallet();
          }}
        >
          {account ? "Already connected" : "Connect with metamask"}
        </button>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
