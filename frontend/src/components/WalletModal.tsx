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
import { useWallet } from "../providers/WalletProvider";

export const WalletModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    activateBrowserWallet,
    activateWalletConnect,
    activateWalletLink,
    activateWeb3Auth,
  } = useWallet();

  return (
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
  );
};
