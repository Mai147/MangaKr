import { routes } from "@/constants/routes";
import {
    Box,
    CloseButton,
    Flex,
    Text,
    useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { IconType } from "react-icons";
import { BiLibrary } from "react-icons/bi";
import { BsBook } from "react-icons/bs";
import { FiHome } from "react-icons/fi";
import { HiOutlineUserGroup } from "react-icons/hi";
import NavSearch from "../Navbar/NavRightContent/NavSearch";
import SidebarItem from "./SidebarItem";

interface LinkItemProps {
    name: string;
    icon: IconType;
    href?: string;
    subChildren?: {
        name: string;
        href?: string;
    }[];
}
const LinkItems: Array<LinkItemProps> = [
    { name: "Trang chủ", icon: FiHome, href: routes.getHomePage() },
    {
        name: "Manga",
        icon: BsBook,
        href: routes.getBookHomePage(),
        subChildren: [
            {
                name: "Tìm kiếm Manga",
                href: routes.getBookHomePage(),
            },
            {
                name: "Manga hàng đầu",
                href: routes.getBookTopPage(),
            },
            {
                name: "Reviews",
                href: routes.getReviewHomePage(),
            },
        ],
    },
    {
        name: "Cộng đồng",
        icon: HiOutlineUserGroup,
        href: routes.getCommunityHomePage(),
    },
    { name: "Thư viện", icon: BiLibrary, href: routes.getProfileLibraryPage() },
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
                <SidebarItem
                    key={link.name}
                    icon={link.icon}
                    href={link.href}
                    subChildren={link.subChildren}
                >
                    {link.name}
                </SidebarItem>
            ))}
        </Box>
    );
};

export default Sidebar;
