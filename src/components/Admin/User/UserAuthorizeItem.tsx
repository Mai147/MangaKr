import { ADMIN_ROLE, listRole, Role } from "@/constants/roles";
import { toastOption } from "@/constants/toast";
import { UserRoleSnippet } from "@/models/User";
import {
    Avatar,
    Box,
    Checkbox,
    Flex,
    HStack,
    Text,
    useToast,
} from "@chakra-ui/react";
import React from "react";
import { userHeaderList } from "./UserAuthorize";

type AdminUserAuthorizeItemProps = {
    user: UserRoleSnippet;
    onChangeRole: (
        user: UserRoleSnippet,
        role: Role,
        roleLabel: string
    ) => void;
};

const AdminUserAuthorizeItem: React.FC<AdminUserAuthorizeItemProps> = ({
    user,
    onChangeRole,
}) => {
    const toast = useToast();
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
                    {user.email}
                </Text>
                <Text w={userHeaderList[2].width} flexShrink={0}>
                    {user.displayName}
                </Text>
            </HStack>
            <HStack flexGrow={1} align="center" justify="center" spacing={8}>
                {listRole.map(
                    (role) =>
                        role.value !== ADMIN_ROLE && (
                            <Checkbox
                                key={role.value}
                                size="md"
                                colorScheme="green"
                                value={role.value}
                                isChecked={role.value === user.role}
                                onChange={(e) => {
                                    if (e.target.value !== user.role) {
                                        if (
                                            user.role === ADMIN_ROLE ||
                                            e.target.value === ADMIN_ROLE
                                        ) {
                                            toast({
                                                ...toastOption,
                                                title: "Bạn không thể thay đổi vai trò Admin.",
                                                status: "error",
                                            });
                                        } else {
                                            onChangeRole(
                                                user,
                                                role.value as Role,
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
export default AdminUserAuthorizeItem;
