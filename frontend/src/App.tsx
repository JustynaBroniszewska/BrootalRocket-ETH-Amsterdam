import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { Web3Auth } from "@web3auth/web3auth";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";

import { useEthers, ChainId } from "@usedapp/core";

Object.entries(localStorage)
  .map((x) => x[0])
  .filter((x) => x.substring(0, 11) === "-walletlink")
  .forEach((entry) => {
    localStorage.removeItem(entry);
  });

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
  const [web3authLogin, setWeb3authLogin] = useState(false);

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

  const removeWalletlinkStorage = () => {
    Object.entries(localStorage)
      .map((x) => x[0])
      .filter((x) => x.substring(0, 11) === "-walletlink")
      .forEach((entry) => {
        localStorage.removeItem(entry);
      });
  };

  const deactivateWallet = async () => {
    localStorage.removeItem("walletconnect");
    removeWalletlinkStorage();
    if (web3auth && web3authLogin) {
      setWeb3authLogin(false);
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
              try {
                await activate(
                  new WalletLinkConnector({
                    url: NETWORK_CONNECTIONS[ChainId.Mainnet],
                    appName: "Web3-react Demo",
                    supportedChainIds: [1, 3, 4, 5, 42],
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
          {account ? "Already connected" : "Connect with coinbase wallet"}
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
                setWeb3authLogin(true);
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
