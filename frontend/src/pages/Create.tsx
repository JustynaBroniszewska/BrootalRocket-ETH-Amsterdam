import {
  FormControl,
  FormLabel,
  Heading,
  Select,
  Input,
  VStack,
  Textarea,
  Button,
} from "@chakra-ui/react";

export const Create = () => {
  return (
    <>
      <Heading as="h3" size="lg">
        Create portfolio
      </Heading>
      <VStack as="form" maxW="sm" mt="4">
        <FormControl>
          <FormLabel htmlFor="network">Network:</FormLabel>
          <Select id="network">
            <option value="option1">Mainnet</option>
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="name">Name:</FormLabel>
          <Input placeholder="Degen investment"></Input>
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="description">Description:</FormLabel>
          <Textarea
            id="description"
            placeholder="Best investement in your life!"
          />
        </FormControl>
        <Button type="submit">Create</Button>
      </VStack>
    </>
  );
};
