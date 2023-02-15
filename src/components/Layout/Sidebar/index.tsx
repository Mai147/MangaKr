import { HOME_PAGE } from "@/constants/routes";
import {
    Box,
    CloseButton,
    Flex,
    Text,
    useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { IconType } from "react-icons";
import { FiHome, FiTrendingUp, FiCompass } from "react-icons/fi";
import NavSearch from "../Navbar/NavRightContent/NavSearch";
import SidebarItem from "./SidebarItem";

interface LinkItemProps {
    name: string;
    icon: IconType;
    href?: string;
}
const LinkItems: Array<LinkItemProps> = [
    { name: "Home", icon: FiHome, href: HOME_PAGE },
    { name: "Trending", icon: FiTrendingUp },
    { name: "Job", icon: FiCompass },
    { name: "Library", icon: FiCompass },
];

type SidebarProps = {
    onClose: () => void;
};

const Sidebar = ({ onClose }: SidebarProps) => {
    return (
        <Box
            transition="3s ease"
            bg={useColorModeValue("white", "gray.900")}
            borderRight="1px"
            borderRightColor={useColorModeValue("gray.200", "gray.700")}
            w={{ base: "full", md: 60 }}
            pos="fixed"
            h="full"
        >
            <Flex
                h="20"
                alignItems="center"
                mx="8"
                justifyContent="space-between"
            >
                <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
                    Logo
                </Text>
                <CloseButton
                    display={{ base: "flex", md: "none" }}
                    onClick={onClose}
                />
            </Flex>
            <Flex direction="column" mx={4} mb={4}>
                <NavSearch />
            </Flex>
            {LinkItems.map((link) => (
                <SidebarItem key={link.name} icon={link.icon} href={link.href}>
                    {link.name}
                </SidebarItem>
            ))}
        </Box>
    );
};

export default Sidebar;
