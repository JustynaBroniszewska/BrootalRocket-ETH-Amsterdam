import logo from "./logo.svg";
import "./App.css";

import { useEthers } from "@usedapp/core";
import { useWallet } from "./providers/WalletProvider";

Object.entries(localStorage)
  .map((x) => x[0])
  .filter((x) => x.substring(0, 11) === "-walletlink")
  .forEach((entry) => {
    localStorage.removeItem(entry);
  });

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
          <button onClick={deactivateWallet}>Disconnect wallet</button>
        ) : (
          <>
            <button onClick={activateWalletConnect}>
              Connect with walletconnect
            </button>
            <button onClick={activateWalletLink}>
              Connect with coinbase wallet
            </button>
            <button onClick={activateWeb3Auth}>Connect with web3auth</button>
            <button onClick={activateBrowserWallet}>
              Connect with metamask
            </button>
          </>
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
