import Pagination from "@/components/Pagination";
import PostHorizontalSnippetItem from "@/components/Post/Snippet/PostHorizontalSnippetItem";
import TableHeader, { TableInfoHeader } from "@/components/Table/TableHeader";
import { POST_PAGE_COUNT } from "@/constants/pagination";
import { routes } from "@/constants/routes";
import usePagination, {
    defaultPaginationInput,
    defaultPaginationOutput,
    PaginationInput,
    PaginationOutput,
} from "@/hooks/usePagination";
import { Community } from "@/models/Community";
import { Post } from "@/models/Post";
import { Topic } from "@/models/Topic";
import PostService from "@/services/PostService";
import TopicService from "@/services/TopicService";
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
    VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import CommunityLeftSideBarAction from "../LeftSideBar/Action";
import TopicHorizontalSnippetItem from "../Topic/TopicHorizontalSnippetItem";

type CommunityInfoApproveProps = {
    community: Community;
};

type CommunityInfoApproveState = {
    field: "topics" | "posts";
    reload: boolean;
    topics: {
        input: PaginationInput;
        output: PaginationOutput;
        loading: boolean;
    };
    posts: {
        input: PaginationInput;
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

const defaultCommunityApproveState: CommunityInfoApproveState = {
    field: "posts",
    posts: defaultPaginationState,
    topics: defaultPaginationState,
    reload: false,
};

export const postHeaderList: TableInfoHeader[] = [
    {
        title: "Người viết",
        width: "100px",
    },
    {
        title: "Ảnh",
        width: "80px",
    },
    {
        title: "Tiêu đề",
        width: "200px",
    },
    {
        title: "Nội dung",
    },
];

export const topicHeaderList: TableInfoHeader[] = [
    {
        title: "Người viết",
        width: "100px",
    },
    {
        title: "Ảnh",
        width: "80px",
    },
    {
        title: "Chủ đề",
        width: "300px",
    },
    {
        title: "Mô tả",
    },
];

const CommunityInfoApprove: React.FC<CommunityInfoApproveProps> = ({
    community,
}) => {
    const [communityApproveState, setCommunityApproveState] =
        useState<CommunityInfoApproveState>(defaultCommunityApproveState);
    const { getPosts, getTopics } = usePagination();

    const getCommunityInfos = async () => {
        setCommunityApproveState((prev) => ({
            ...prev,
            [communityApproveState.field]: {
                ...prev[communityApproveState.field],
                loading: true,
            },
        }));
        let res: any = {};
        const input: PaginationInput = {
            ...communityApproveState[communityApproveState.field].input,
            page: communityApproveState.reload
                ? 1
                : communityApproveState[communityApproveState.field].input.page,
            isFirst: communityApproveState.reload
                ? true
                : communityApproveState[communityApproveState.field].input
                      .isFirst,
            setDocValue: (docValue: any) => {
                setCommunityApproveState((prev) => ({
                    ...prev,
                    [prev.field]: {
                        ...prev[prev.field],
                        input: {
                            ...prev[prev.field].input,
                            docValue,
                        },
                    },
                }));
            },
        };
        switch (communityApproveState.field) {
            case "posts": {
                res = await getPosts({ ...input, communityId: community.id! });
                break;
            }
            case "topics": {
                res = await getTopics({ ...input, communityId: community.id! });
                break;
            }
        }
        setCommunityApproveState((prev) => ({
            ...prev,
            [prev.field]: {
                ...prev[prev.field],
                loading: false,
                output: res,
                input: {
                    ...prev[prev.field].input,
                    isFirst: false,
                },
            },
            reload: false,
        }));
    };

    const handleApprovePost = async (
        post: Post,
        community: Community,
        isAccept: boolean
    ) => {
        await PostService.approve({ post, community, isAccept });
        setCommunityApproveState((prev) => ({
            ...prev,
            reload: true,
            posts: {
                ...prev.posts,
                output: {
                    ...prev.posts.output,
                    list: prev.posts.output.list.filter(
                        (item: Post) => item.id !== post.id
                    ),
                },
            },
        }));
    };

    const handleApproveTopic = async (
        topic: Topic,
        community: Community,
        isAccept: boolean
    ) => {
        await TopicService.approve({ topic, community, isAccept });
        setCommunityApproveState((prev) => ({
            ...prev,
            reload: true,
            topics: {
                ...prev.topics,
                output: {
                    ...prev.topics.output,
                    list: prev.topics.output.list.filter(
                        (item: Topic) => item.id !== topic.id
                    ),
                },
            },
        }));
    };

    useEffect(() => {
        getCommunityInfos();
    }, [
        communityApproveState.field,
        communityApproveState[communityApproveState.field].input.page,
    ]);

    useEffect(() => {
        setCommunityApproveState((prev) => ({
            ...defaultCommunityApproveState,
            field: prev.field,
        }));
    }, [communityApproveState.field]);

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
                    <HStack spacing={4}>
                        <Select
                            w="250px"
                            borderColor="gray.400"
                            value={communityApproveState.field}
                            onChange={(e) => {
                                setCommunityApproveState((prev) => ({
                                    ...prev,
                                    field: e.target.value as any,
                                }));
                            }}
                        >
                            <option value={"topics"}>Chủ đề</option>
                            <option value={"posts"}>Bài viết</option>
                        </Select>
                        <HStack spacing={2} align="center">
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
                    </HStack>
                </Flex>
                <Divider borderColor="gray.300" />
                {communityApproveState.field === "posts" ? (
                    <TableHeader list={postHeaderList} />
                ) : (
                    <TableHeader list={topicHeaderList} />
                )}
                <Divider borderColor="gray.300" />
                {communityApproveState[communityApproveState.field].loading ? (
                    <Flex align="center" justify="center" w="100%" p={10}>
                        <Spinner />
                    </Flex>
                ) : communityApproveState.field === "posts" ? (
                    communityApproveState.posts.output.list &&
                    communityApproveState.posts.output.list.length > 0 ? (
                        communityApproveState.posts.output.list.map(
                            (post: Post) => (
                                <Box key={post.id} w="100%">
                                    <PostHorizontalSnippetItem
                                        post={post}
                                        handleApprove={async (isAccept) => {
                                            await handleApprovePost(
                                                post,
                                                community,
                                                isAccept
                                            );
                                        }}
                                    />
                                    <Divider borderColor="gray.300" />
                                </Box>
                            )
                        )
                    ) : (
                        <Flex align="center" justify="center" w="100%" py={10}>
                            <Text>Không có bài viết cần phê duyệt</Text>
                        </Flex>
                    )
                ) : communityApproveState.topics.output.list &&
                  communityApproveState.topics.output.list.length > 0 ? (
                    communityApproveState.topics.output.list.map(
                        (topic: Topic) => (
                            <Box key={topic.id} w="100%">
                                <TopicHorizontalSnippetItem
                                    topic={topic}
                                    handleApprove={async (isAccept) => {
                                        await handleApproveTopic(
                                            topic,
                                            community,
                                            isAccept
                                        );
                                    }}
                                />
                                <Divider borderColor="gray.300" />
                            </Box>
                        )
                    )
                ) : (
                    <Flex align="center" justify="center" w="100%" py={10}>
                        <Text>Không có chủ đề cần phê duyệt</Text>
                    </Flex>
                )}
            </VStack>
            <Flex align="center" py={6} justify="center" w="100%">
                <Pagination
                    page={
                        communityApproveState[communityApproveState.field]
                            .output.page
                    }
                    totalPage={
                        communityApproveState[communityApproveState.field]
                            .output.totalPage
                    }
                    onNext={() =>
                        setCommunityApproveState((prev) => ({
                            ...prev,
                            [prev.field]: {
                                ...prev[prev.field],
                                input: {
                                    ...prev[prev.field].input,
                                    page: prev[prev.field].input.page + 1,
                                    isNext: true,
                                },
                            },
                        }))
                    }
                    onPrev={() =>
                        setCommunityApproveState((prev) => ({
                            ...prev,
                            [prev.field]: {
                                ...prev[prev.field],
                                input: {
                                    ...prev[prev.field].input,
                                    page: prev[prev.field].input.page - 1,
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
export default CommunityInfoApprove;
