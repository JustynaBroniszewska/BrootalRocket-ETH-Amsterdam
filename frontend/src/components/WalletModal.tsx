import { Button, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { useWallet } from "../providers/WalletProvider";

export const WalletModal = () => {
  const {
    activateBrowserWallet,
    activateWalletConnect,
    activateWalletLink,
    activateWeb3Auth,
  } = useWallet();

  return (
    <Menu>
      <MenuButton as={Button} colorScheme="blue">
        Open Modal
      </MenuButton>
      <MenuList>
        <MenuItem>
          <Button colorScheme="blue" w="full" onClick={activateWalletConnect}>
            Walletconnect
          </Button>
        </MenuItem>
        <MenuItem>
          <Button colorScheme="blue" w="full" onClick={activateWalletLink}>
            CoinbaseWallet
          </Button>
        </MenuItem>
        <MenuItem>
          <Button colorScheme="blue" w="full" onClick={activateWeb3Auth}>
            Web3auth
          </Button>
        </MenuItem>
        <MenuItem>
          <Button colorScheme="blue" w="full" onClick={activateBrowserWallet}>
            Metamask
          </Button>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
