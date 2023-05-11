import { Box, Flex, HStack, Icon, Image, Link, Text } from "@chakra-ui/react";
import React from "react";
import { BsFacebook, BsGithub } from "react-icons/bs";

type FooterProps = {};

const Footer: React.FC<FooterProps> = () => {
    return (
        <Flex
            bg="black"
            py={6}
            px={{ base: 0, md: 18, lg: 24, xl: 32 }}
            textAlign="center"
            color="white"
            align="center"
            justify="space-between"
        >
            <HStack fontSize={24} spacing={4}>
                <Link href="https://github.com/Mai147?tab=repositories">
                    <Icon as={BsGithub} />
                </Link>
                <Link href="https://www.facebook.com/phuonghoangmai.ha/">
                    <Icon as={BsFacebook} />
                </Link>
            </HStack>
            <Text>&copy; 2023 MangaKr. All rights reserved</Text>
        </Flex>
    );
};
export default Footer;
