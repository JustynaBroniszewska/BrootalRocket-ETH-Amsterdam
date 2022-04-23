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
} from "@chakra-ui/react";

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

export const Earn = () => {
  return (
    <>
      <Heading as="h3" size="lg">
        Available portfolios
      </Heading>
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
  const { name, owner, value } = portfolio;
  return (
    <Accordion allowToggle>
      <AccordionItem>
        <AccordionButton>
          <Grid
            templateColumns="1fr 24px 1fr 24px 1fr 24px"
            w="full"
            alignItems="center"
          >
            <Text flex="1">{name}</Text>
            <Divider color="white" /> <Text>{owner}</Text>
            <Divider />
            <Text>{value}M TVL</Text>
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
                <LinkOverlay href="#" display="block" isExternal>
                  Learn more
                </LinkOverlay>
              </LinkBox>
            </Grid>

            <TabPanels>
              <TabPanel>
                <ActionForm actionName="Withdraw" />
              </TabPanel>
              <TabPanel>
                <ActionForm actionName="Deposit" />
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
}

const ActionForm = ({ actionName }: ActionFormProps) => {
  return (
    <form>
      <FormControl>
        <FormLabel htmlFor="amount">Amount</FormLabel>
        <Flex gap="4">
          <NumberInput id="amount" w="full" maxW="md" precision={2}>
            <NumberInputField />
          </NumberInput>
          <Button>Max</Button>
          <Spacer />
          <Button type="submit" colorScheme="blue" w="36">
            {actionName}
          </Button>
        </Flex>
      </FormControl>
    </form>
  );
};
