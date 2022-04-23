import { Button, Flex, Image, LinkBox, LinkOverlay } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export const Home = () => {
  return (
    <>
      <Image src="vault.svg" mt="32px" />
      <Flex align="center" justify="center" gap="16px" mt="32px">
        <LinkBox as={Button} w="32">
          <LinkOverlay as={Link} to="/earn" display="block">
            Earn
          </LinkOverlay>
        </LinkBox>

        <LinkBox as={Button} w="32">
          <LinkOverlay as={Link} to="/manage" display="block">
            Manage
          </LinkOverlay>
        </LinkBox>
      </Flex>
    </>
  );
};
