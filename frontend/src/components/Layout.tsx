import { ReactNode } from "react";
import { Flex, Button, Box, Heading, Text } from "@chakra-ui/react";
import { useEthers, shortenIfAddress } from "@usedapp/core";
import { WalletMenu } from "./WalletMenu";
import { useWallet } from "../providers/WalletProvider";
import { Link } from "react-router-dom";
import { Link as StyleLink } from "@chakra-ui/react";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { account, chainId } = useEthers();
  const { deactivateWallet } = useWallet();

  return (
    <Box minH="100vh" p="4">
      <Flex justify="space-between" align="baseline">
        <StyleLink as={Link} to="/" style={{ textDecoration: "none" }}>
          <Heading>DEGEN HEAVEN</Heading>
        </StyleLink>

        {account ? (
          <Flex align="baseline" gap="4">
            <Text>{chainId === 69 ? "[ Optimism ]" : "[ Polygon ]"}</Text>
            <Text>{shortenIfAddress(account)}</Text>
            <Button colorScheme="gray" onClick={deactivateWallet}>
              Disconnect wallet
            </Button>
          </Flex>
        ) : (
          <WalletMenu />
        )}
      </Flex>
      <Flex
        py="8"
        h="full"
        flexDirection="column"
        maxW="3xl"
        mx="auto"
        align="center"
      >
        {children}
      </Flex>
    </Box>
  );
};
