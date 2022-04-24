import { useQuery, gql } from "@apollo/client";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  Heading,
  List,
  ListItem,
  AccordionPanel,
  Divider,
  Text,
  Grid,
  AccordionIcon,
  Tab,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Button,
  LinkOverlay,
  LinkBox,
  FormControl,
  FormLabel,
  Flex,
  NumberInput,
  NumberInputField,
  Spacer,
  Skeleton,
  Spinner,
} from "@chakra-ui/react";
import {
  useBlockNumber,
  useCall,
  useContractFunction,
  useEthers,
  useTokenAllowance,
  shortenIfAddress,
} from "@usedapp/core";
import { Contract, utils } from "ethers";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { OptimismIcon, PolygonIcon } from "../components/PolygonIcon";
import { ASSETS } from "./Create";

export const Earn = () => {
  const blockNumber = useBlockNumber();
  const { data, loading, refetch } = useQuery(gql`
    query getVaults {
      vaults(orderBy: startDate, orderDirection: desc) {
        id
        owner
        asset {
          id
        }
        name
        symbol
      }
    }
  `);

  useEffect(() => {
    refetch();
  }, [blockNumber, refetch]);

  return (
    <>
      <Heading as="h3" size="lg">
        Available portfolios
      </Heading>
      <List spacing="16px" mt="32px" w="full">
        {!data &&
          loading &&
          [1, 2, 3, 4, 5].map((_, i) => <Skeleton key={i} height="20px" />)}

        {data?.vaults?.map((vault: any) => (
          <ListItem key={vault.id}>
            <Portfolio vault={vault} />
          </ListItem>
        ))}
      </List>
      <LinkBox as={Button} mx="auto" mt="32px">
        <LinkOverlay as={Link} to="/manage" display="block">
          Go to my portfolios
        </LinkOverlay>
      </LinkBox>
    </>
  );
};

interface PortfolioProps {
  vault: any;
}

const Portfolio = ({ vault }: PortfolioProps) => {
  const { name, owner, id } = vault;
  const contract = new Contract(
    id,
    new utils.Interface([
      "function totalAssets() public view returns (uint256)",
      "function requestDeposit(int256)",
      "function deposit(uint256 amount, address receiver) returns (uint256)",
    ])
  );
  const { send: deposit } = useContractFunction(contract, "deposit");
  const { send: requestDeposit } = useContractFunction(
    contract,
    "requestDeposit"
  );

  const { value } =
    useCall({
      contract: contract,
      args: [],
      method: "totalAssets",
    }) ?? {};

  return (
    <Accordion allowToggle>
      <AccordionItem>
        <AccordionButton>
          <Grid
            templateColumns="24px 1fr 24px 1fr 24px 1fr 24px"
            w="full"
            alignItems="center"
          >
            <OptimismIcon />
            <Text>{name}</Text>
            <Divider color="white" /> <Text>{shortenIfAddress(owner)}</Text>
            <Divider />
            {value?.[0] ? (
              <Text>{utils.formatEther(value[0]).toString()} TVL</Text>
            ) : (
              <Skeleton height="20px" />
            )}
            <AccordionIcon />
          </Grid>
        </AccordionButton>
        <AccordionPanel>
          <Tabs isFitted variant="solid-rounded" colorScheme="blue" mt="3">
            <Grid templateColumns="3fr 1fr" w="full" gap="32px">
              <TabList w="full" maxW="container.sm" gap="8px">
                <Tab borderRadius="md">Withdraw</Tab>
                <Tab borderRadius="md">Deposit</Tab>
              </TabList>
              <LinkBox as={Button}>
                <LinkOverlay as={Link} to={`/portfolio/${id}`} display="block">
                  Learn more
                </LinkOverlay>
              </LinkBox>
            </Grid>

            <TabPanels>
              <TabPanel>
                <ActionForm
                  actionName="Withdraw"
                  onSubmit={() => console.log("Not implemented yet")}
                  vaultAddress={id}
                />
              </TabPanel>
              <TabPanel>
                <ActionForm
                  actionName="Deposit"
                  onSubmit={deposit}
                  preSubmit={requestDeposit}
                  vaultAddress={id}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

interface ActionFormProps {
  actionName: string;
  onSubmit: (...args: any[]) => void;
  vaultAddress: string;
  preSubmit?: (...args: any[]) => void;
}

const sleep = (milliseconds: number) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

const ActionForm = ({
  actionName,
  onSubmit,
  vaultAddress,
  preSubmit,
}: ActionFormProps) => {
  const { account } = useEthers();
  const [loading, setLoading] = useState(false);
  const [canDeposit, setCanDeposit] = useState(false);
  const [amount, setAmount] = useState(0);
  const allowance = useTokenAllowance(ASSETS[0].address, account, vaultAddress);
  const needsApprove =
    allowance?.lt(utils.parseEther(amount.toString())) ?? false;

  const { send } = useContractFunction(
    new Contract(
      ASSETS[0].address,
      new utils.Interface(["function approve(address, uint256) public"])
    ),
    "approve"
  );

  const request = async () => {
    setLoading(true);
    if (preSubmit) {
      preSubmit(0, { gasLimit: 10000000 });
      await sleep(30_000);
      setLoading(false);
      setCanDeposit(true);
    }
  };
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();

        if (needsApprove) {
          await send(vaultAddress, utils.parseEther(amount.toString()));
        } else {
          const target = e.target as any;
          const amount = +target.amount.value;
          await onSubmit(utils.parseEther(amount.toString()), account, {
            gasLimit: 2000000,
          });
        }
      }}
    >
      <FormControl>
        <FormLabel htmlFor="amount">Amount</FormLabel>
        <Flex gap="4">
          <NumberInput
            id="amount"
            w="full"
            maxW="md"
            precision={2}
            onChange={(_, number) => setAmount(number ?? 0)}
          >
            <NumberInputField />
          </NumberInput>
          <Button>Max</Button>
          <Spacer />
          {preSubmit && !canDeposit && (
            <Button colorScheme="blue" w="36" onClick={request}>
              {loading ? <Spinner /> : "Request"}
            </Button>
          )}
          <Button
            disabled={!canDeposit}
            type="submit"
            colorScheme="blue"
            w="36"
          >
            {needsApprove ? "Approve" : actionName}
          </Button>
        </Flex>
      </FormControl>
    </form>
  );
};
