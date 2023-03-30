import Pagination from "@/components/Pagination";
import { USER_PAGE_COUNT } from "@/constants/pagination";
import {
    COMMUNITY_ADMIN_ROLE,
    COMMUNITY_SUPER_ADMIN_ROLE,
} from "@/constants/roles";
import { COMMUNITY_PAGE } from "@/constants/routes";
import { toastOption } from "@/constants/toast";
import useAuth from "@/hooks/useAuth";
import usePagination, {
    defaultPaginationInput,
    PaginationInput,
} from "@/hooks/usePagination";
import { Community } from "@/models/Community";
import { CommunityUserSnippet } from "@/models/User";
import CommunityService from "@/services/CommunityService";
import {
    Box,
    Button,
    Divider,
    Flex,
    HStack,
    Link,
    Select,
    Spinner,
    Text,
    useToast,
    VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import CommunityLeftSideBarAction from "../LeftSideBar/Action";
import CommunityUserSnippetApproveItem from "./CommunityUserSnippetApproveItem";

type CommunityUserApproveProps = {
    community: Community;
};

interface CommunityUserPaginationInput extends PaginationInput {
    communityId: string;
    reload: boolean;
    isAccept: boolean;
}

const defaultCommunityUserPaginationInput: CommunityUserPaginationInput = {
    ...defaultPaginationInput,
    pageCount: USER_PAGE_COUNT,
    communityId: "",
    reload: false,
    isAccept: false,
};

const CommunityUserApprove: React.FC<CommunityUserApproveProps> = ({
    community,
}) => {
    const [userPaginationInput, setUserPaginationInput] =
        useState<CommunityUserPaginationInput>(
            defaultCommunityUserPaginationInput
        );
    const [userList, setUserList] = useState<CommunityUserSnippet[]>([]);
    const { getUsers } = usePagination();
    const toast = useToast();
    const { user } = useAuth();

    const getCommunityUsers = async () => {
        setUserPaginationInput((prev) => ({
            ...prev,
            loading: true,
        }));
        const res = await getUsers({
            ...userPaginationInput,
            page: userPaginationInput.reload ? 1 : userPaginationInput.page,
            isFirst: userPaginationInput.reload
                ? true
                : userPaginationInput.isFirst,
            communityId: community.id,
            isAccept: userPaginationInput.isAccept,
        });
        setUserList(res.users);
        setUserPaginationInput((prev) => ({
            ...prev,
            isFirst: false,
            loading: false,
            page: prev.reload ? 1 : prev.page,
            totalPage: res.totalPage || 0,
            reload: false,
        }));
    };

    const handleApprove = async (
        user: CommunityUserSnippet,
        isAccept: boolean
    ) => {
        if (!userPaginationInput.isAccept) {
            await CommunityService.approveUser({
                userId: user.id,
                communityId: community.id!,
                isAccept,
            });
        } else {
            if (
                user.role === COMMUNITY_ADMIN_ROLE ||
                user.role === COMMUNITY_SUPER_ADMIN_ROLE
            ) {
                toast({
                    ...toastOption,
                    title: "Bạn không thể xóa Admin!",
                    status: "error",
                });
                return;
            } else {
                await CommunityService.leave({
                    communityId: community.id!,
                    userId: user.id,
                });
            }
        }
        setUserPaginationInput((prev) => ({
            ...prev,
            reload: true,
        }));
        setUserList((prev) => prev.filter((item) => item.id !== user.id));
    };

    useEffect(() => {
        getCommunityUsers();
    }, [userPaginationInput.page, userPaginationInput.isAccept]);

    return (
        <Flex direction="column" flexGrow={1} justify="space-between">
            <VStack spacing={0} align="flex-start">
                <Flex
                    p={4}
                    w="100%"
                    fontSize={20}
                    fontWeight={600}
                    align="center"
                    justify="space-between"
                >
                    <Text>Phê duyệt thành viên</Text>
                    <HStack spacing={4}>
                        <Select
                            w="250px"
                            borderColor="gray.400"
                            value={userPaginationInput.isAccept ? 1 : 0}
                            onChange={(e) => {
                                setUserPaginationInput((prev) => ({
                                    ...prev,
                                    page: 1,
                                    isFirst: true,
                                    isAccept: !!e.target.value,
                                }));
                            }}
                        >
                            <option value={""}>Chưa duyệt</option>
                            <option value={1}>Đã duyệt</option>
                        </Select>
                        <HStack spacing={2} align="center">
                            <Link
                                href={`${COMMUNITY_PAGE}/${community.id!}`}
                                _hover={{ textDecoration: "none" }}
                            >
                                <Button>Quay lại cộng đồng</Button>
                            </Link>
                            <CommunityLeftSideBarAction />
                        </HStack>
                    </HStack>
                </Flex>
                <Divider borderColor="gray.300" />
                <HStack
                    spacing={4}
                    flexGrow={1}
                    w="100%"
                    p={4}
                    fontWeight={500}
                >
                    <Text w="100px" flexShrink={0}>
                        Avatar
                    </Text>
                    <Text w="300px" flexShrink={0}>
                        Tên
                    </Text>
                    <Text w="200px" flexShrink={0}>
                        {!userPaginationInput.isAccept
                            ? "Ngày yêu cầu"
                            : "Ngày gia nhập"}
                    </Text>
                </HStack>
                <Divider borderColor="gray.300" />
                {userPaginationInput.loading ? (
                    <Flex align="center" justify="center" w="100%" p={10}>
                        <Spinner />
                    </Flex>
                ) : userList && userList.length > 0 ? (
                    userList.map((u) =>
                        u.id !== user?.uid ? (
                            <Box key={u.id} w="100%">
                                <CommunityUserSnippetApproveItem
                                    user={u}
                                    isDeleteOnly={userPaginationInput.isAccept}
                                    handleApprove={async (isAccept) => {
                                        await handleApprove(u, isAccept);
                                    }}
                                />
                                <Divider borderColor="gray.300" />
                            </Box>
                        ) : (
                            <Box key={u.id}></Box>
                        )
                    )
                ) : (
                    <Flex align="center" justify="center" w="100%" py={10}>
                        <Text>Không có thành viên cần phê duyệt</Text>
                    </Flex>
                )}
            </VStack>
            <Flex align="center" py={6} justify="center" w="100%">
                <Pagination
                    page={userPaginationInput.page}
                    totalPage={userPaginationInput.totalPage}
                    onNext={() =>
                        setUserPaginationInput((prev) => ({
                            ...prev,
                            page: prev.page + 1,
                            isNext: true,
                        }))
                    }
                    onPrev={() =>
                        setUserPaginationInput((prev) => ({
                            ...prev,
                            page: prev.page - 1,
                            isNext: false,
                        }))
                    }
                />
            </Flex>
        </Flex>
    );
};
export default CommunityUserApprove;
