import logo from "./logo.svg";
import "./App.css";

import { useEthers } from "@usedapp/core";
import { useWallet } from "./providers/WalletProvider";
import {
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Grid,
} from "@chakra-ui/react";

function App() {
  const {
    activateBrowserWallet,
    activateWalletConnect,
    activateWalletLink,
    activateWeb3Auth,
    deactivateWallet,
  } = useWallet();
  const { account } = useEthers();
  const { isOpen, onOpen, onClose } = useDisclosure();

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
          <>
            <Button colorScheme="blue" onClick={onOpen}>
              Open Modal
            </Button>
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Connect wallet</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Grid
                    templateColumns="1fr 1fr"
                    gap="8px"
                    columnGap="16px"
                    rowGap="24px"
                  >
                    <Button colorScheme="blue" onClick={activateWalletConnect}>
                      Walletconnect
                    </Button>
                    <Button colorScheme="blue" onClick={activateWalletLink}>
                      CoinbaseWallet
                    </Button>
                    <Button colorScheme="blue" onClick={activateWeb3Auth}>
                      Web3auth
                    </Button>
                    <Button colorScheme="blue" onClick={activateBrowserWallet}>
                      Metamask
                    </Button>
                  </Grid>
                  <ModalFooter />
                </ModalBody>
              </ModalContent>
            </Modal>
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
