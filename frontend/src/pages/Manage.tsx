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
  Spacer,
  Text,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

const portfolios = [
  {
    name: "Super name",
    owner: "The dude",
    value: "12",
  },
  {
    name: "Cool name",
    owner: "Other dude",
    value: "10",
  },
];

export const Manage = () => {
  return (
    <>
      <Flex>
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
      <List spacing="16px" mt="32px">
        {portfolios.map((portfolio) => (
          <ListItem>
            <Portfolio portfolio={portfolio} />
          </ListItem>
        ))}
      </List>
    </>
  );
};

interface PortfolioProps {
  portfolio: typeof portfolios[number];
}

const Portfolio = ({ portfolio }: PortfolioProps) => {
  const { name, value } = portfolio;
  return (
    <Grid templateColumns="1fr 24px 1fr 24px 1fr" w="full" alignItems="center">
      <Text flex="1">{name}</Text>
      <Divider />
      <Text>{value}M TVL</Text>
      <Spacer />
      <Button>Manage</Button>
    </Grid>
  );
};
