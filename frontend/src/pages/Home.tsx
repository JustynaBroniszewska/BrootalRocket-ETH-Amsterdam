import { Flex } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { Link as StyleLink } from "@chakra-ui/react";

export const Home = () => {
  return (
    <Flex align="center" justify="center" gap="16px">
      <StyleLink as={Link} to="earn">
        Earn
      </StyleLink>
      <StyleLink as={Link} to="manage">
        Manage
      </StyleLink>
    </Flex>
  );
};
