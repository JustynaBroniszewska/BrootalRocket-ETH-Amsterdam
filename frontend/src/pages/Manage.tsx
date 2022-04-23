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
import { useBlockNumber, useEthers, useCall } from "@usedapp/core";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Contract, utils } from "ethers";

export const Manage = () => {
  const { account } = useEthers();
  const blockNumber = useBlockNumber();
  const { data, loading, refetch } = useQuery(
    gql`
      query getVaultsByOwner($owner: String!) {
        vaults(where: { owner: $owner }) {
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
    { skip: !account, variables: { owner: account?.toLowerCase() } }
  );

  useEffect(() => {
    refetch();
  }, [blockNumber, refetch]);

  return (
    <>
      <Flex w="full">
        <Heading as="h3" size="lg">
          Available portfolios
        </Heading>
        <Spacer />

        <LinkBox as={Button}>
          <LinkOverlay as={Link} to="/create" display="block">
            Create
          </LinkOverlay>
        </LinkBox>
      </Flex>
      <List spacing="16px" mt="32px" w="full">
        {!data &&
          loading &&
          [1, 2, 3, 4, 5].map((_, i) => <Skeleton key={i} height="20px" />)}

        {data?.vaults?.map((vault: any) => (
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
  const { name, id } = vault;

  const contract = new Contract(
    id,
    new utils.Interface([
      "function totalAssets() public view returns (uint256)",
      "function deposit(uint256 amount, address receiver) external override returns (uint256 shares)",
    ])
  );

  const { value } =
    useCall({
      contract: contract,
      args: [],
      method: "totalAssets",
    }) ?? {};

  return (
    <Grid templateColumns="1fr 24px 1fr 24px 1fr" w="full" alignItems="center">
      <Text flex="1">{name}</Text>
      <Divider />
      {value?.[0] ? (
        <Text>{utils.formatEther(value[0]).toString()} TVL</Text>
      ) : (
        <Skeleton height="20px" />
      )}
      <Spacer />

      <LinkBox as={Button}>
                <LinkOverlay href={`/portfolio/${id}`} display="block" >
                  Manage
                </LinkOverlay>
              </LinkBox>

      <Button>Manage</Button>
    </Grid>
  );
};
