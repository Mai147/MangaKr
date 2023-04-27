import { routes } from "@/constants/routes";
import {
    BoxProps,
    useColorModeValue,
    Flex,
    CloseButton,
    Box,
    Text,
    FlexProps,
    Icon,
    Link,
    VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { IconType } from "react-icons";
import { BiUser } from "react-icons/bi";
import { FiBookOpen, FiHome } from "react-icons/fi";
import { MdOutlineRateReview } from "react-icons/md";
import { TiDocument } from "react-icons/ti";

interface LinkItemProps {
    name: string;
    icon: IconType;
    href: string;
}
const LinkItems: Array<LinkItemProps> = [
    { name: "Dashboard", icon: FiHome, href: routes.getAdminPage() },
    /// TODO
    // { name: "Manga", icon: FiBookOpen, href: "#" },
    // { name: "Bài đánh giá", icon: MdOutlineRateReview, href: "#" },
    { name: "Tài khoản", icon: BiUser, href: routes.getAdminUserPage() },
    { name: "Bài viết", icon: TiDocument, href: routes.getAdminPostPage() },
];

interface NavItemProps extends FlexProps {
    icon: IconType;
    children: string;
    href?: string;
}
const NavItem = ({ icon, children, href, ...rest }: NavItemProps) => {
    const router = useRouter();
    return (
        <Link
            href={router.pathname !== href ? href : undefined}
            style={{ textDecoration: "none" }}
            _focus={{ boxShadow: "none" }}
            w="100%"
        >
            <Flex
                align="center"
                p="4"
                mx="4"
                borderRadius="lg"
                role="group"
                cursor={router.pathname !== href ? "pointer" : "default"}
                fontWeight={router.pathname !== href ? "normal" : "semibold"}
                bg={router.pathname === href ? "red.100" : "white"}
                _hover={
                    router.pathname !== href
                        ? {
                              bg: "red.300",
                              color: "white",
                          }
                        : undefined
                }
                transition="all 0.3s"
                {...rest}
            >
                {icon && (
                    <Icon
                        mr="4"
                        fontSize="16"
                        _groupHover={
                            router.pathname !== href
                                ? {
                                      color: "white",
                                  }
                                : undefined
                        }
                        as={icon}
                    />
                )}
                {children}
            </Flex>
        </Link>
    );
};

interface SidebarProps extends BoxProps {
    onClose: () => void;
}

const AdminSidebarContent = ({ onClose, ...rest }: SidebarProps) => {
    return (
        <Box
            transition="3s ease"
            bg={useColorModeValue("white", "gray.900")}
            borderRight="1px"
            borderRightColor={useColorModeValue("gray.200", "gray.700")}
            w={{ base: "full", md: 60 }}
            pos="fixed"
            h="full"
            {...rest}
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
            <VStack w="100%">
                {LinkItems.map((link) => (
                    <NavItem key={link.name} icon={link.icon} href={link.href}>
                        {link.name}
                    </NavItem>
                ))}
            </VStack>
        </Box>
    );
};

export default AdminSidebarContent;
