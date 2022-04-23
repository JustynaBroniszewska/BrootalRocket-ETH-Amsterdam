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
import { SUPPORTED_NETWORKS } from "../networks";

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
            {SUPPORTED_NETWORKS.map((network) => (
              <option value={`option-${network.chainName}`}>
                {network.chainName}
              </option>
            ))}
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
