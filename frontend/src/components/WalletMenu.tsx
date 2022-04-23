import {
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Image,
  Flex,
  Text,
} from "@chakra-ui/react";
import { useWallet } from "../providers/WalletProvider";

export const WalletMenu = () => {
  const {
    activateBrowserWallet,
    activateWalletConnect,
    activateWalletLink,
    activateWeb3Auth,
  } = useWallet();

  return (
    <Menu>
      <MenuButton as={Button} colorScheme="blue">
        Connect wallet
      </MenuButton>
      <MenuList>
        <MenuItem>
          <WalletButton
            onClick={activateWalletConnect}
            text="WalletConnect"
            src="/icons/walletConnect.png"
          />
        </MenuItem>
        <MenuItem>
          <WalletButton
            onClick={activateWalletLink}
            text="CoinbaseWallet"
            src="/icons/coinbase.png"
          />
        </MenuItem>
        <MenuItem>
          <WalletButton
            onClick={activateWeb3Auth}
            text="Web3auth"
            src="/icons/web3auth.jpeg"
          />
        </MenuItem>
        <MenuItem>
          <WalletButton
            onClick={activateBrowserWallet}
            text="Metamask"
            src="/icons/metamask.png"
          />
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

interface WalletButtonProps {
  onClick: () => any;
  src: string;
  text: string;
}

const WalletButton = ({ onClick, src, text }: WalletButtonProps) => (
  <Button colorScheme="blue" w="full" onClick={onClick}>
    <Flex align="center" gap="16px" w="full">
      <Image src={src} w="32px" h="32px" borderRadius="8px" />
      <Text>{text}</Text>
    </Flex>
  </Button>
);
