import React from "react";
import logo from "./logo.svg";
import "./App.css";

import { useEthers } from "@usedapp/core";

function App() {
  const { account, activateBrowserWallet, deactivate } = useEthers();
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <p>{account}</p>
        <button
          onClick={() => {
            account ? deactivate() : activateBrowserWallet();
          }}
        >
          {account ? "Already connected" : "Connect"}
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
