import {
  FormControl,
  FormLabel,
  Heading,
  Select,
  Input,
  VStack,
  Textarea,
  Button,
  Spinner,
  Spacer,
} from "@chakra-ui/react";
import { SUPPORTED_NETWORKS } from "../networks";
import { useContractFunction, useEthers } from "@usedapp/core";
import { Contract, utils } from "ethers";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

export const ASSETS = [
  {
    name: "Dai",
    address: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
  },
];

export const Create = () => {
  const { switchNetwork, account } = useEthers();
  const navigate = useNavigate();
  const { send, state } = useContractFunction(
    new Contract(
      "0xDfB4F647fB6059c1E37E56C485d6bF585B8be44b",
      new utils.Interface([
        "function createVault(address asset, string memory name, string memory symbol) public ",
      ])
    ),
    "createVault"
  );

  useEffect(() => {
    if (state.status === "Success") navigate("/earn");
  }, [state.status, navigate]);

  return (
    <>
      <Heading as="h3" size="lg">
        Create portfolio
      </Heading>
      <VStack
        as="form"
        maxW="sm"
        w="full"
        mt="4"
        onSubmit={async (e) => {
          e.preventDefault();
          const target = e.target as any;

          const targetChainId = +target.network.value;
          console.log({ targetChainId });
          switchNetwork(targetChainId);
          const asset = target.asset.value;
          const portfolioName = target.name.value;
          const symbol = target.symbol.value;
          const description = target.description.value;

          await axios.post("http://localhost:3001/portfolio", {
            account,
            portfolioName,
            description,
          });

          await send(asset, portfolioName, symbol);
        }}
      >
        <FormControl>
          <FormLabel htmlFor="network">Network:</FormLabel>
          <Select id="network">
            {SUPPORTED_NETWORKS.map((network) => (
              <option value={network.chainId}>{network.chainName}</option>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="asset">Asset:</FormLabel>
          <Select id="asset">
            {ASSETS.map((asset) => (
              <option value={asset.address}>{asset.name}</option>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="name">Name:</FormLabel>
          <Input id="name" placeholder="Degen investment"></Input>
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="symbol">Symbol:</FormLabel>
          <Input id="symbol" placeholder="Degen investment"></Input>
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="description">Description:</FormLabel>
          <Textarea
            id="description"
            placeholder="Best investement in your life!"
          />
        </FormControl>
        <Spacer />
        <Button type="submit" w="full" colorScheme="blue">
          {state.status === "None" ? "Create" : <Spinner />}
        </Button>
      </VStack>
    </>
  );
};
