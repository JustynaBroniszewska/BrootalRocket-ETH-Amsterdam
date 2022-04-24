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
import { useSiweProvider } from "../providers/SiweProvider";

export const ASSETS = [
  {
    name: "Dai",
    address: "0xd6B095c27bDf158C462AaB8Cb947BdA9351C0e1d",
  },
];

const COLLATERAL_DAI = "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1";

export const Create = () => {
  const { switchNetwork, account } = useEthers();
  const { signIn } = useSiweProvider();
  const navigate = useNavigate();
  const { send, state } = useContractFunction(
    new Contract(
      "0x4C22b9D0687EA4f2f19a97BceeE017841086064d",
      new utils.Interface([
        "function createVault(address asset, address collateralAsset, string memory name, string memory symbol) public",
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
          switchNetwork(targetChainId);
          const asset = target.asset.value;
          const portfolioName = target.name.value;
          const symbol = target.symbol.value;
          const description = target.description.value;

          await signIn();
          const token = localStorage.getItem("authToken");

          await axios.post(
            "https://solitary-glitter-2647.fly.dev/portfolio",
            {
              account,
              portfolioName,
              description,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          console.log({ asset, COLLATERAL_DAI, portfolioName, symbol });
          await send(asset, COLLATERAL_DAI, portfolioName, symbol, {
            gasLimit: 3000000,
          });
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
