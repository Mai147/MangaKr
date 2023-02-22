import { Flex, Icon, Text } from "@chakra-ui/react";
import React from "react";
import { CgUnavailable } from "react-icons/cg";

type BookErrorProps = {};

const BookError: React.FC<BookErrorProps> = () => {
    return (
        <Flex align="center" justify="center" direction="column" flexGrow={1}>
            <Icon as={CgUnavailable} fontSize={60} color="brand.100" />
            <Text fontSize={24} fontWeight={600}>
                Sorry this book is not available now
            </Text>
        </Flex>
    );
};
export default BookError;
