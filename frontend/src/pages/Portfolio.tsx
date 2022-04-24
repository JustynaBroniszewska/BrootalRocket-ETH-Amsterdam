import { gql, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import {
  useBlockNumber,
  useContractFunction,
  useEthers,
  useTokenAllowance,
  useTokenBalance,
} from "@usedapp/core";
import { useParams } from "react-router-dom";
import {
  Button,
  VStack,
  Box,
  FormControl,
  FormLabel,
  Select,
  Input,
  Image,
  Text,
} from "@chakra-ui/react";
import { Contract, utils } from "ethers";
import { ASSETS } from "./Create";
import axios from "axios";
import { aDAI } from "../addresses";

const AAVE_INTERFACE = new utils.Interface([
  "function supply(address asset, uint256 amount, address onBehalfOf, uint16 referralCode) public",
]);

export const Portfolio = () => {
  const address = useParams().address ?? "";
  const { account } = useEthers();
  const blockNumber = useBlockNumber();
  const daiBalance = useTokenBalance(ASSETS[0].address, address);
  const aDaiBalance = useTokenBalance(aDAI, address);
  const { data, refetch } = useQuery(
    gql`
      query getVaultsById($id: String!) {
        vault(id: $id) {
          id
          owner
          asset {
            id
          }
          name
          symbol
        }
      }
    `,
    { variables: { id: address.toLowerCase() } }
  );

  useEffect(() => {
    refetch();
  }, [blockNumber, refetch]);

  const [description, setDescription] = useState("");
  useEffect(() => {
    const getDescription = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await axios.get(
          `http://localhost:3001/portfolio/${data?.vault?.name}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setDescription(res.data.description);
      } catch {}
    };
    getDescription();
  }, [account, data?.vault?.name]);

  return (
    <div>
      <Text>{data?.vault?.name}</Text>
      <Text>{data?.vault?.id}</Text>
      <Text>{description}</Text>

      <Box mt="3">
        <Text>Portfolio value:</Text>
        <Text>DAI: {daiBalance && utils.formatEther(daiBalance)}</Text>
        <Text>aDAI: {aDaiBalance && utils.formatEther(aDaiBalance)}</Text>
      </Box>
      <ManageModal portfolioAddress={data?.vault?.id} />
    </div>
  );
};

const ManageModal = ({ portfolioAddress }: { portfolioAddress: string }) => {
  const [state, setState] = useState("default");
  if (state == "aave") {
    return <ManageAave portfolioAddress={portfolioAddress} />;
  }

  return (
    <VStack spacing="3" mt="4">
      <Box>Available protocols:</Box>

      <Button
        w="150px"
        colorScheme="whiteAlpha"
        border="2px"
        borderColor="blue.100"
        onClick={() => setState("aave")}
        leftIcon={<Image h="56px" src="/aave-logo.png" />}
      />
      <Button
        w="150px"
        colorScheme="whiteAlpha"
        border="2px"
        borderColor="blue.100"
        leftIcon={<Image h="32px" src="/apwine-logo.png" />}
      />
      <Button
        w="150px"
        colorScheme="whiteAlpha"
        border="2px"
        borderColor="blue.100"
        leftIcon={<Image h="32px" src="/1inch-logo.png" />}
      />
    </VStack>
  );
};

const SUPPORTED_AAVE_OPERATIONS = ["deposit", "borrow", "withdraw"];

const AAVE = "0x139d8F557f70D1903787e929D7C42165c4667229";

const ManageAave = ({ portfolioAddress }: { portfolioAddress: string }) => {
  const [amount, setAmount] = useState("0");
  const approval = useTokenAllowance(ASSETS[0].address, portfolioAddress, AAVE);
  const contract = new Contract(
    portfolioAddress,
    new utils.Interface(["function execute(address, bytes) public"])
  );
  const needsApprove = approval?.lt(utils.parseEther(amount));
  const { send } = useContractFunction(contract, "execute");
  const tokenInt = new utils.Interface([
    "function approve(address, uint256) public",
  ]);
  return (
    <VStack
      as="form"
      maxW="sm"
      mt="4"
      spacing="3"
      onSubmit={async (e) => {
        e.preventDefault();
        if (needsApprove) {
          await send(
            ASSETS[0].address,
            tokenInt.encodeFunctionData("approve", [
              AAVE,
              utils.parseEther(amount.toString()),
            ])
          );
        } else {
          const data = AAVE_INTERFACE.encodeFunctionData("supply", [
            ASSETS[0].address,
            utils.parseEther(amount.toString()),
            portfolioAddress,
            0,
          ]);
          await send(AAVE, data);
        }
      }}
    >
      <FormControl>
        <FormLabel htmlFor="network">Network:</FormLabel>
        <Select id="network">
          {SUPPORTED_AAVE_OPERATIONS.map((operation) => (
            <option value={operation}>
              {operation[0].toUpperCase() + operation.slice(1)}
            </option>
          ))}
        </Select>
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="amount">Amount:</FormLabel>
        <Input
          id="amount"
          placeholder="Amount"
          onChange={(e) => setAmount(e.target.value)}
        ></Input>
      </FormControl>

      <Button type="submit" w="32">
        {needsApprove ? "Approve" : "Send"}
      </Button>
    </VStack>
  );
};
