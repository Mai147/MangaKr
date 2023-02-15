import React from "react";
import {
    IconButton,
    Flex,
    HStack,
    useColorModeValue,
    Text,
    Link,
} from "@chakra-ui/react";
import { FiMenu } from "react-icons/fi";
import NavList from "./NavList";
import NavRightContent from "./NavRightContent";
import { HOME_PAGE } from "@/constants/routes";

type NavbarProps = {
    onOpen: () => void;
};
const Navbar = ({ onOpen }: NavbarProps) => {
    return (
        <Flex
            px={{ base: 4, md: 4 }}
            height="20"
            alignItems="center"
            bg={useColorModeValue("white", "gray.900")}
            borderBottomWidth="1px"
            borderBottomColor={useColorModeValue("gray.200", "gray.700")}
            justifyContent="space-between"
        >
            <IconButton
                display={{ base: "flex", lg: "none" }}
                onClick={onOpen}
                variant="outline"
                aria-label="open menu"
                icon={<FiMenu />}
            />

            <HStack spacing={2}>
                <Link href={HOME_PAGE} _hover={{ textDecoration: "none" }}>
                    <Text
                        fontSize="2xl"
                        fontFamily="monospace"
                        fontWeight="bold"
                    >
                        Logo
                    </Text>
                </Link>
                <NavList />
            </HStack>

            <NavRightContent />
        </Flex>
    );
};

export default Navbar;
