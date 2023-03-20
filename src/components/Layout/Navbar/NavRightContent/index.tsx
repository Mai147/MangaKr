import { WRITER_ROLE } from "@/constants/roles";
import useAuth from "@/hooks/useAuth";
import {
    Flex,
    IconButton,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Stack,
} from "@chakra-ui/react";
import React from "react";
import { AiOutlinePlus, AiOutlineTags } from "react-icons/ai";
import { FiBell } from "react-icons/fi";
import { IoPersonOutline } from "react-icons/io5";
import NavItem from "../NavItem";
import NavSearch from "./NavSearch";
import NavUser from "./NavUser";

type NavRightContentProps = {};

const NavRightContent: React.FC<NavRightContentProps> = () => {
    const { user } = useAuth();
    return (
        <Flex align="center">
            <Flex display={{ base: "none", lg: "flex" }}>
                <NavSearch />
            </Flex>
            <IconButton
                size="lg"
                variant="ghost"
                aria-label="open menu"
                borderRadius="full"
                icon={<FiBell />}
                ml={2}
            />
            {user && user.role === WRITER_ROLE && (
                <Popover trigger={"hover"} placement={"bottom-start"}>
                    <PopoverTrigger>
                        <IconButton
                            size="lg"
                            variant="ghost"
                            aria-label="add"
                            borderRadius="full"
                            icon={<AiOutlinePlus />}
                            mr={2}
                        />
                    </PopoverTrigger>

                    <PopoverContent
                        border={0}
                        boxShadow="md"
                        bg="white"
                        p={4}
                        rounded={"xl"}
                        minW={"xs"}
                    >
                        <Stack>
                            <NavItem
                                label="Thêm tác giả"
                                leftIcon={IoPersonOutline}
                            />
                            <NavItem
                                label="Thêm thể loại"
                                leftIcon={AiOutlineTags}
                            />
                            {/* {navItem.children.map((child) => (
                                <NavItem key={child.label} {...child} />
                            ))} */}
                        </Stack>
                    </PopoverContent>
                </Popover>
            )}
            <NavUser />
        </Flex>
    );
};
export default NavRightContent;
