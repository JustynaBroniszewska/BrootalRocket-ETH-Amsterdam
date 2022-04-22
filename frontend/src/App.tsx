import logo from "./logo.svg";
import "./App.css";

import { useEthers } from "@usedapp/core";
import { useWallet } from "./providers/WalletProvider";
import { Button, VStack } from "@chakra-ui/react";

function App() {
  const {
    activateBrowserWallet,
    activateWalletConnect,
    activateWalletLink,
    activateWeb3Auth,
    deactivateWallet,
  } = useWallet();
  const { account } = useEthers();

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <p>{account}</p>

        {account ? (
          <Button colorScheme="gray" onClick={deactivateWallet}>
            Disconnect wallet
          </Button>
        ) : (
          <VStack>
            <Button colorScheme="blue" onClick={activateWalletConnect}>
              Connect with walletconnect
            </Button>
            <Button colorScheme="blue" onClick={activateWalletLink}>
              Connect with coinbase wallet
            </Button>
            <Button colorScheme="blue" onClick={activateWeb3Auth}>
              Connect with web3auth
            </Button>
            <Button colorScheme="blue" onClick={activateBrowserWallet}>
              Connect with metamask
            </Button>
          </VStack>
        )}
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
