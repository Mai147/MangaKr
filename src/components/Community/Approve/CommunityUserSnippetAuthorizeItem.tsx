import {
    CommunityRole,
    COMMUNITY_ADMIN_ROLE,
    COMMUNITY_SUPER_ADMIN_ROLE,
    listCommunityRole,
} from "@/constants/roles";
import { toastOption } from "@/constants/toast";
import useCommunity from "@/hooks/useCommunity";
import { CommunityUserSnippet } from "@/models/User";
import {
    Avatar,
    Box,
    Checkbox,
    Flex,
    HStack,
    Icon,
    Text,
    useToast,
} from "@chakra-ui/react";
import moment from "moment";
import React from "react";
import { AiOutlineCheck } from "react-icons/ai";
import { MdOutlineClear } from "react-icons/md";
import { userHeaderList } from "./CommunityUserAuthorize";

type CommunityUserSnippetAuthorizeItemProps = {
    user: CommunityUserSnippet;
    onChangeRole: (
        user: CommunityUserSnippet,
        role: CommunityRole,
        roleLabel: string
    ) => void;
};

const CommunityUserSnippetAuthorizeItem: React.FC<
    CommunityUserSnippetAuthorizeItemProps
> = ({ user, onChangeRole }) => {
    const toast = useToast();
    const { communityState } = useCommunity();
    return (
        <Flex
            align="center"
            w="100%"
            p={4}
            _hover={{ bg: "gray.50" }}
            transition="all 0.3s"
        >
            <HStack spacing={4}>
                <Box w={userHeaderList[0].width}>
                    <Avatar src={user.imageUrl || "/images/noImage.jpg"} />
                </Box>
                <Text w={userHeaderList[1].width} flexShrink={0}>
                    {user.displayName}
                </Text>
                <Box
                    w={userHeaderList[2].width}
                    flexShrink={0}
                    display={userHeaderList[2].display}
                >
                    {user.createdAt?.seconds && (
                        <Text>
                            {moment(
                                new Date(user.createdAt?.seconds * 1000)
                            ).format("DD/MM/YYYY")}
                        </Text>
                    )}
                </Box>
                <Flex
                    w={userHeaderList[3].width}
                    display={userHeaderList[3].display}
                    flexShrink={0}
                    fontSize={30}
                    align="center"
                    justify="center"
                >
                    {user.isAccept ? (
                        <Icon as={AiOutlineCheck} color="green.400" />
                    ) : (
                        <Icon as={MdOutlineClear} color="brand.400" />
                    )}
                </Flex>
            </HStack>
            <HStack
                flexGrow={1}
                align="center"
                justify="center"
                spacing={{ base: 4, xl: 8 }}
                wrap="wrap"
            >
                {listCommunityRole.map(
                    (role) =>
                        (role.value !== COMMUNITY_SUPER_ADMIN_ROLE ||
                            communityState.userCommunityRole?.role ===
                                COMMUNITY_SUPER_ADMIN_ROLE) && (
                            <Checkbox
                                key={role.value}
                                size="md"
                                colorScheme="green"
                                value={role.value}
                                isChecked={role.value === user.role}
                                onChange={(e) => {
                                    if (e.target.value !== user.role) {
                                        if (
                                            (user.role ===
                                                COMMUNITY_ADMIN_ROLE ||
                                                e.target.value ===
                                                    COMMUNITY_ADMIN_ROLE) &&
                                            communityState.userCommunityRole
                                                ?.role !==
                                                COMMUNITY_SUPER_ADMIN_ROLE
                                        ) {
                                            toast({
                                                ...toastOption,
                                                title: "Bạn không thể thay đổi vai trò Admin.",
                                                status: "error",
                                            });
                                        } else {
                                            onChangeRole(
                                                user,
                                                role.value as CommunityRole,
                                                role.label
                                            );
                                        }
                                    }
                                }}
                            >
                                {role.label}
                            </Checkbox>
                        )
                )}
            </HStack>
        </Flex>
    );
};
export default CommunityUserSnippetAuthorizeItem;
