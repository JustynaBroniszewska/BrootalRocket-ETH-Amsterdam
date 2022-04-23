import logo from "./logo.svg";
import "./App.css";

import { useEthers } from "@usedapp/core";
import { useWallet } from "./providers/WalletProvider";
import { Button } from "@chakra-ui/react";
import { WalletModal } from "./components/WalletModal";

function App() {
  const { deactivateWallet } = useWallet();
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
          <WalletModal />
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
