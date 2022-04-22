import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { Web3Auth } from "@web3auth/web3auth";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";

import { useEthers, ChainId } from "@usedapp/core";

const clientId = "YOUR_CLIENT_ID";

const NETWORK_CONNECTIONS = {
  [ChainId.Mainnet]:
    "https://mainnet.infura.io/v3/f88abc181a4a45a6bc47bdda05a94944",
  [ChainId.Ropsten]:
    "https://ropsten.infura.io/v3/f88abc181a4a45a6bc47bdda05a94944",
};

function App() {
  const { account, activateBrowserWallet, deactivate, activate } = useEthers();
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const web3auth = new Web3Auth({
          clientId,
          chainConfig: {
            chainId: "0x1",
            chainNamespace: "eip155",
            rpcTarget:
              "https://mainnet.infura.io/v3/ec659e9f6af4425c8a13aeb0af9f2809",
          },
        });
        const openloginAdapter = new OpenloginAdapter({
          adapterSettings: {
            clientId,
            network: "testnet",
            uxMode: "redirect",
          },
        });
        web3auth.configureAdapter(openloginAdapter);
        setWeb3auth(web3auth);
        await web3auth.initModal();
      } catch (error) {
        console.error(error);
      }
    };
    init();
  }, []);

  const deactivateWallet = async () => {
    localStorage.removeItem("walletconnect");
    if (web3auth) {
      await web3auth.logout();
    }
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
          onClick={async () => {
            if (!account) {
              if (!web3auth) {
                console.log("web3auth not initialized yet");
                return;
              }

              try {
                const provider = await web3auth.connect();
                await activate(provider as any);
              } catch (error) {
                console.log(error);
              }
            } else {
              deactivateWallet();
            }
          }}
        >
          {account ? "Already connected" : "Connect with web3auth"}
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
