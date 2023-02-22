import { Box, Text } from "@chakra-ui/react";
import React from "react";

type FooterProps = {};

const Footer: React.FC<FooterProps> = () => {
    return (
        <Box bg="black" p={6} textAlign="center">
            <Text color="white">Footer</Text>
        </Box>
    );
};
export default Footer;
