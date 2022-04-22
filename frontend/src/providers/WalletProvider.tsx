import { createContext, ReactNode, useContext, useCallback } from "react";
import { Web3Auth } from "@web3auth/web3auth";
import { useState, useEffect } from "react";
import { useEthers, ChainId } from "@usedapp/core";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";

const clientId = "YOUR_CLIENT_ID";

const NETWORK_CONNECTIONS = {
  [ChainId.Mainnet]:
    "https://mainnet.infura.io/v3/f88abc181a4a45a6bc47bdda05a94944",
  [ChainId.Ropsten]:
    "https://ropsten.infura.io/v3/f88abc181a4a45a6bc47bdda05a94944",
};

const WalletContext = createContext<{
  deactivateWallet: () => Promise<void>;
  activateWalletConnect: () => Promise<void>;
  activateWalletLink: () => Promise<void>;
  activateWeb3Auth: () => Promise<void>;
  activateBrowserWallet: () => void;
}>({
  deactivateWallet: async () => {},
  activateWalletConnect: async () => {},
  activateWalletLink: async () => {},
  activateWeb3Auth: async () => {},
  activateBrowserWallet: () => {},
});

interface WalletProviderProps {
  children: ReactNode;
}

const removeWalletlinkStorage = () => {
  Object.entries(localStorage)
    .map((x) => x[0])
    .filter((x) => x.substring(0, 11) === "-walletlink")
    .forEach((entry) => {
      localStorage.removeItem(entry);
    });
};

export const WalletProvider = ({ children }: WalletProviderProps) => {
  const { activateBrowserWallet, deactivate, activate } = useEthers();
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [web3authLogin, setWeb3authLogin] = useState(false);

  const deactivateWallet = useCallback(async () => {
    localStorage.removeItem("walletconnect");
    removeWalletlinkStorage();
    if (web3auth && web3authLogin) {
      setWeb3authLogin(false);
      await web3auth.logout();
    }
    deactivate();
  }, [deactivate, web3auth, web3authLogin]);

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

  const activateWalletConnect = useCallback(async () => {
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
  }, [activate]);

  const activateWalletLink = useCallback(async () => {
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
  }, [activate]);

  const activateWeb3Auth = useCallback(async () => {
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
  }, [activate, web3auth]);

  return (
    <WalletContext.Provider
      value={{
        deactivateWallet,
        activateWalletConnect,
        activateWalletLink,
        activateWeb3Auth,
        activateBrowserWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
