import { postHeaderList } from "@/components/Community/Approve/CommunityInfoApprove";
import CommunityInfoApproveList from "@/components/Community/Approve/CommunityInfoApproveList";
import Pagination from "@/components/Pagination";
import PostHorizontalSnippetItem from "@/components/Post/Snippet/PostHorizontalSnippetItem";
import TableHeader from "@/components/Table/TableHeader";
import { POST_PAGE_COUNT } from "@/constants/pagination";
import usePagination, {
    defaultPaginationInput,
    defaultPaginationOutput,
    PaginationOutput,
    PostPaginationInput,
} from "@/hooks/usePagination";
import PostService from "@/services/PostService";
import { Divider, Flex, Spinner, Text, VStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

type AdminPostApproveProps = {};

type AdminPostApproveState = {
    reload: boolean;
    posts: {
        input: PostPaginationInput;
        output: PaginationOutput;
        loading: boolean;
    };
};

const defaultPaginationState = {
    input: {
        ...defaultPaginationInput,
        pageCount: POST_PAGE_COUNT,
    },
    output: defaultPaginationOutput,
    loading: true,
};

const defaultCommunityApproveState: AdminPostApproveState = {
    posts: defaultPaginationState,
    reload: false,
};

const AdminPostApprove: React.FC<AdminPostApproveProps> = () => {
    const [communityApproveState, setCommunityApproveState] =
        useState<AdminPostApproveState>(defaultCommunityApproveState);
    const { getPosts } = usePagination();

    const getCommunityInfos = async () => {
        setCommunityApproveState((prev) => ({
            ...prev,
            posts: {
                ...prev.posts,
                loading: true,
            },
        }));
        const input = {
            ...communityApproveState.posts.input,
            page: communityApproveState.reload
                ? 1
                : communityApproveState.posts.input.page,
            isFirst: communityApproveState.reload
                ? true
                : communityApproveState.posts.input.isFirst,
            setDocValue: (docValue: any) => {
                setCommunityApproveState((prev) => ({
                    ...prev,
                    posts: {
                        ...prev.posts,
                        input: {
                            ...prev.posts.input,
                            docValue,
                        },
                    },
                }));
            },
        };
        const res = await getPosts({ ...input });
        if (res) {
            setCommunityApproveState((prev) => ({
                ...prev,
                posts: {
                    ...prev.posts,
                    loading: false,
                    output: res,
                    input: {
                        ...prev.posts.input,
                        isFirst: false,
                    },
                },
                reload: false,
            }));
        }
    };

    const handleLock = async (item: any) => {
        await PostService.toggleLockState({
            post: item,
            communityId: item.communityId,
        });
        setCommunityApproveState((prev) => ({
            ...prev,
            posts: {
                ...prev.posts,
                output: {
                    ...prev.posts.output,
                    list: prev.posts.output.list.map((listItem: any) =>
                        listItem.id !== item.id
                            ? listItem
                            : {
                                  ...listItem,
                                  isLock: !listItem.isLock,
                              }
                    ),
                },
            },
        }));
    };

    useEffect(() => {
        getCommunityInfos();
    }, [communityApproveState.posts.input.page]);

    return (
        <Flex direction="column" flexGrow={1} justify="space-between">
            <VStack spacing={0} align="flex-start">
                <Flex
                    p={4}
                    w="100%"
                    fontSize={20}
                    fontWeight={600}
                    justify="space-between"
                >
                    <Text>Phê duyệt bài viết</Text>
                </Flex>
                <Divider borderColor="gray.300" />
                <TableHeader list={postHeaderList} />
                <Divider borderColor="gray.300" />
                {communityApproveState.posts.loading ? (
                    <Flex align="center" justify="center" w="100%" p={10}>
                        <Spinner />
                    </Flex>
                ) : (
                    <CommunityInfoApproveList
                        list={communityApproveState.posts.output.list}
                        type={"posts"}
                        isAccept={true}
                        handleLock={handleLock}
                        renderChild={(item) => (
                            <PostHorizontalSnippetItem post={item} />
                        )}
                    />
                )}
            </VStack>
            <Flex align="center" py={6} justify="center" w="100%">
                <Pagination
                    page={communityApproveState.posts.output.page}
                    totalPage={communityApproveState.posts.output.totalPage}
                    onNext={() =>
                        setCommunityApproveState((prev) => ({
                            ...prev,
                            posts: {
                                ...prev.posts,
                                input: {
                                    ...prev.posts.input,
                                    page: prev.posts.input.page + 1,
                                    isNext: true,
                                },
                            },
                        }))
                    }
                    onPrev={() =>
                        setCommunityApproveState((prev) => ({
                            ...prev,
                            posts: {
                                ...prev.posts,
                                input: {
                                    ...prev.posts.input,
                                    page: prev.posts.input.page - 1,
                                    isNext: false,
                                },
                            },
                        }))
                    }
                />
            </Flex>
        </Flex>
    );
};
export default AdminPostApprove;
