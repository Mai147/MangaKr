import Pagination from "@/components/Pagination";
import TableHeader, { TableInfoHeader } from "@/components/Table/TableHeader";
import { USER_PAGE_COUNT } from "@/constants/pagination";
import {
    COMMUNITY_ADMIN_ROLE,
    COMMUNITY_SUPER_ADMIN_ROLE,
} from "@/constants/roles";
import { routes } from "@/constants/routes";
import { toastOption } from "@/constants/toast";
import useAuth from "@/hooks/useAuth";
import usePagination, {
    defaultPaginationInput,
    defaultPaginationOutput,
    PaginationOutput,
    UserPaginationInput,
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
import CommunityInfoApproveList from "./CommunityInfoApproveList";
import CommunityUserSnippetApproveItem from "./CommunityUserSnippetApproveItem";

type CommunityUserApproveProps = {
    community: Community;
};

type CommunityUserApproveState = {
    reload: boolean;
    paginationInput: UserPaginationInput;
    paginationOutput: PaginationOutput;
    loading: boolean;
};

const defaultCommunityUserApproveState: CommunityUserApproveState = {
    reload: false,
    paginationInput: {
        ...defaultPaginationInput,
        pageCount: USER_PAGE_COUNT,
        isAccept: false,
    },
    paginationOutput: defaultPaginationOutput,
    loading: true,
};

export const userHeaderList: TableInfoHeader[] = [
    {
        title: "Avatar",
        width: { base: "80px", md: "100px" },
    },
    {
        title: "Tên",
        width: { base: "200px", md: "300px" },
    },
    {
        title: "Ngày yêu cầu",
        width: "200px",
        display: { base: "none", md: "block" },
    },
];

const CommunityUserApprove: React.FC<CommunityUserApproveProps> = ({
    community,
}) => {
    const [communityUserApproveState, setCommunityUserApproveState] =
        useState<CommunityUserApproveState>(defaultCommunityUserApproveState);
    const { getUsers } = usePagination();
    const toast = useToast();
    const { user } = useAuth();

    const getCommunityUsers = async () => {
        setCommunityUserApproveState((prev) => ({
            ...prev,
            loading: true,
        }));
        const input: UserPaginationInput = {
            ...communityUserApproveState.paginationInput,
            communityId: community.id!,
            page: communityUserApproveState.reload
                ? 1
                : communityUserApproveState.paginationInput.page,
            isFirst: communityUserApproveState.reload
                ? true
                : communityUserApproveState.paginationInput.isFirst,
            setDocValue: (docValue) => {
                setCommunityUserApproveState((prev) => ({
                    ...prev,
                    paginationInput: {
                        ...prev.paginationInput,
                        docValue,
                    },
                }));
            },
        };
        const res = await getUsers(input);
        if (res) {
            setCommunityUserApproveState((prev) => ({
                ...prev,
                paginationOutput: res,
                paginationInput: {
                    ...prev.paginationInput,
                    isFirst: false,
                },
            }));
        }
        setCommunityUserApproveState((prev) => ({
            ...prev,
            loading: false,
        }));
    };

    const handleApprove = async (
        user: CommunityUserSnippet,
        isAccept: boolean
    ) => {
        if (!communityUserApproveState.paginationInput.isAccept) {
            await CommunityService.approveUser({
                userId: user.id,
                community,
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
        setCommunityUserApproveState((prev) => ({
            ...prev,
            reload: true,
            paginationOutput: {
                ...prev.paginationOutput,
                list: prev.paginationOutput.list.filter(
                    (item: CommunityUserSnippet) => item.id !== user.id
                ),
            },
        }));
    };

    useEffect(() => {
        getCommunityUsers();
    }, [
        communityUserApproveState.paginationInput.page,
        communityUserApproveState.paginationInput.isAccept,
    ]);

    useEffect(() => {
        setCommunityUserApproveState((prev) => ({
            ...defaultCommunityUserApproveState,
            paginationInput: {
                ...defaultCommunityUserApproveState.paginationInput,
                isAccept: prev.paginationInput.isAccept,
            },
        }));
    }, [communityUserApproveState.paginationInput.isAccept]);

    return (
        <Flex direction="column" flexGrow={1} justify="space-between">
            <VStack spacing={0} align="flex-start">
                <Flex
                    p={4}
                    w="100%"
                    fontSize={20}
                    fontWeight={600}
                    direction="column"
                >
                    <Flex justify="space-between" align="center">
                        <Text>Phê duyệt thành viên</Text>
                        <HStack spacing={2} align="center" ml={4}>
                            <Link
                                href={routes.getCommunityDetailPage(
                                    community.id!
                                )}
                                _hover={{ textDecoration: "none" }}
                            >
                                <Button>Quay lại cộng đồng</Button>
                            </Link>
                            <CommunityLeftSideBarAction />
                        </HStack>
                    </Flex>
                    <Select
                        w="250px"
                        borderColor="gray.400"
                        value={
                            communityUserApproveState.paginationInput.isAccept
                                ? 1
                                : 0
                        }
                        onChange={(e) => {
                            setCommunityUserApproveState((prev) => ({
                                ...prev,
                                paginationInput: {
                                    ...prev.paginationInput,
                                    isAccept: !!e.target.value,
                                },
                            }));
                        }}
                        alignSelf="flex-end"
                        mt={2}
                    >
                        <option value={""}>Chưa duyệt</option>
                        <option value={1}>Đã duyệt</option>
                    </Select>
                </Flex>
                <Divider borderColor="gray.300" />
                <TableHeader list={userHeaderList} />
                <Divider borderColor="gray.300" />
                {communityUserApproveState.loading ? (
                    <Flex align="center" justify="center" w="100%" p={10}>
                        <Spinner />
                    </Flex>
                ) : communityUserApproveState.paginationOutput.list &&
                  communityUserApproveState.paginationOutput.list.length > 0 ? (
                    <CommunityInfoApproveList
                        list={communityUserApproveState.paginationOutput.list}
                        type={"users"}
                        isAccept={
                            communityUserApproveState.paginationInput
                                .isAccept || false
                        }
                        handleApprove={async (item, isAccept) => {
                            await handleApprove(item, isAccept);
                        }}
                        handleDelete={async (item) => {
                            await handleApprove(item, true);
                        }}
                        renderChild={(item) =>
                            item.id !== user?.uid ? (
                                <CommunityUserSnippetApproveItem user={item} />
                            ) : (
                                <></>
                            )
                        }
                        exception={(item) => item.id === user?.uid}
                    />
                ) : (
                    <Flex align="center" justify="center" w="100%" py={10}>
                        <Text>Không có thành viên cần phê duyệt</Text>
                    </Flex>
                )}
            </VStack>
            <Flex align="center" py={6} justify="center" w="100%">
                <Pagination
                    page={communityUserApproveState.paginationOutput.page}
                    totalPage={
                        communityUserApproveState.paginationOutput.totalPage
                    }
                    onNext={() =>
                        setCommunityUserApproveState((prev) => ({
                            ...prev,
                            paginationInput: {
                                ...prev.paginationInput,
                                page: prev.paginationInput.page + 1,
                                isNext: true,
                            },
                        }))
                    }
                    onPrev={() =>
                        setCommunityUserApproveState((prev) => ({
                            ...prev,
                            paginationInput: {
                                ...prev.paginationInput,
                                page: prev.paginationInput.page - 1,
                                isNext: false,
                            },
                        }))
                    }
                />
            </Flex>
        </Flex>
    );
};
export default CommunityUserApprove;
