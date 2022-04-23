import { ReactNode } from "react";
import { Flex, Button, Box, Heading } from "@chakra-ui/react";
import { useEthers } from "@usedapp/core";
import { WalletMenu } from "./WalletMenu";
import { useWallet } from "../providers/WalletProvider";
import { Link } from "react-router-dom";
import { Link as StyleLink } from "@chakra-ui/react";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { account } = useEthers();
  const { deactivateWallet } = useWallet();

  return (
    <Box minH="100vh" p="4">
      <Flex justify="space-between" align="baseline">
        <StyleLink as={Link} to="/" style={{ textDecoration: "none" }}>
          <Heading>DEGEN HEAVEN</Heading>
        </StyleLink>

        {account ? (
          <Button colorScheme="gray" onClick={deactivateWallet}>
            Disconnect wallet
          </Button>
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
