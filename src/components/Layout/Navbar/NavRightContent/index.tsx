import { Flex, HStack, IconButton } from "@chakra-ui/react";
import React from "react";
import { FiBell } from "react-icons/fi";
import NavSearch from "./NavSearch";
import NavUser from "./NavUser";

type NavRightContentProps = {};

const NavRightContent: React.FC<NavRightContentProps> = () => {
    return (
        <HStack spacing={{ base: "0", md: "6" }}>
            <Flex display={{ base: "none", lg: "flex" }}>
                <NavSearch />
            </Flex>
            <IconButton
                size="lg"
                variant="ghost"
                aria-label="open menu"
                icon={<FiBell />}
            />
            <NavUser />
        </HStack>
    );
};
export default NavRightContent;
