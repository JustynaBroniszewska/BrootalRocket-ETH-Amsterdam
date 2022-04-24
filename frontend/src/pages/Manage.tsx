import { gql, useQuery } from "@apollo/client";
import {
  Button,
  Divider,
  Flex,
  Grid,
  Heading,
  LinkBox,
  LinkOverlay,
  List,
  ListItem,
  Skeleton,
  Spacer,
  Text,
} from "@chakra-ui/react";
import {
  useBlockNumber,
  useEthers,
  useCall,
  OptimismKovan,
  Polygon,
} from "@usedapp/core";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Contract, utils } from "ethers";
import { PolygonIcon, OptimismIcon } from "../components/PolygonIcon";
import { optClient, polyClient, Subgraphs } from "..";

const usePolygonVaults = () => {
  const { account } = useEthers();
  const blockNumber = useBlockNumber();
  const { data, loading, refetch } = useQuery(
    gql`
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
    `,
    {
      skip: !account,
      variables: { owner: account?.toLowerCase() },
      client: polyClient,
    }
  );

  useEffect(() => {
    refetch();
  }, [blockNumber, refetch]);

  return [
    data?.vaults?.map((d: any) => ({
      ...d,
      chainId: Polygon.chainId,
    })) ?? [],
    loading,
  ];
};

const useOptimismVaults = () => {
  const { account } = useEthers();
  const blockNumber = useBlockNumber();
  const { data, loading, refetch } = useQuery(
    gql`
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
    `,
    {
      skip: !account,
      variables: { owner: account?.toLowerCase() },
      client: optClient,
    }
  );

  useEffect(() => {
    refetch();
  }, [blockNumber, refetch]);

  return [
    data?.vaults?.map((d: any) => ({
      ...d,
      chainId: OptimismKovan.chainId,
    })) ?? [],
    loading,
  ];
};

const PrimaryButton = ({ children }: any) => (
  <Button colorScheme="blue" w="240px">
    {children}
  </Button>
);

export const Manage = () => {
  const { account } = useEthers();
  const [optData, l1] = useOptimismVaults();

  const [polData, l2] = usePolygonVaults();
  const loading = l1 || l2;

  const data = [...optData, ...polData];

  return (
    <>
      <Flex w="full">
        <Heading as="h3" size="lg">
          Available portfolios
        </Heading>
        <Spacer />

        <LinkBox as={PrimaryButton} colorScheme>
          <LinkOverlay as={Link} to="/create" display="block">
            Create
          </LinkOverlay>
        </LinkBox>
      </Flex>
      <List spacing="16px" mt="32px" w="full">
        {!data &&
          loading &&
          [1, 2, 3, 4, 5].map((_, i) => <Skeleton key={i} height="20px" />)}

        {data?.map((vault: any) => (
          <ListItem>
            <Portfolio vault={vault} />
          </ListItem>
        ))}
      </List>
      <LinkBox as={Button} mx="auto" mt="32px">
        <LinkOverlay as={Link} to="/earn" display="block">
          Go to all portfolios
        </LinkOverlay>
      </LinkBox>
    </>
  );
};

interface PortfolioProps {
  vault: any;
}

const Portfolio = ({ vault }: PortfolioProps) => {
  const { name, id, chainId } = vault;

  const contract = new Contract(
    id,
    new utils.Interface([
      "function totalAssets() public view returns (uint256)",
      "function deposit(uint256 amount, address receiver) external override returns (uint256 shares)",
    ])
  );

  const { value } =
    useCall(
      {
        contract: contract,
        args: [],
        method: "totalAssets",
      },
      { chainId }
    ) ?? {};

  return (
    <Grid
      templateColumns="32px 1fr 24px 1fr 24px 240px"
      w="full"
      alignItems="center"
    >
      {chainId === Polygon.chainId ? <PolygonIcon /> : <OptimismIcon />}
      <Text>{name}</Text>
      <Divider />
      {value?.[0] ? (
        <Text>{utils.formatEther(value[0]).toString()} TVL</Text>
      ) : (
        <Skeleton height="20px" />
      )}
      <Spacer />

      <LinkBox as={Button}>
        <LinkOverlay href={`/portfolio/${chainId}/${id}`} display="block">
          Manage
        </LinkOverlay>
      </LinkBox>
    </Grid>
  );
};
