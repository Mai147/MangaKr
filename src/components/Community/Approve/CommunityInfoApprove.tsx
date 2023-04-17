import Pagination from "@/components/Pagination";
import PostHorizontalSnippetItem from "@/components/Post/Snippet/PostHorizontalSnippetItem";
import VotingHorizontalSnippetItem from "@/components/Table/Snippet/Voting/VotingHorizontalSnippetItem";
import TableHeader, { TableInfoHeader } from "@/components/Table/TableHeader";
import { POST_PAGE_COUNT } from "@/constants/pagination";
import { routes } from "@/constants/routes";
import usePagination, {
    defaultPaginationInput,
    defaultPaginationOutput,
    PaginationOutput,
    PostPaginationInput,
    TopicPaginationInput,
    VotingPaginationInput,
} from "@/hooks/usePagination";
import { Community } from "@/models/Community";
import { Post } from "@/models/Post";
import { Topic } from "@/models/Topic";
import { Voting } from "@/models/Vote";
import PostService from "@/services/PostService";
import TopicService from "@/services/TopicService";
import VotingService from "@/services/VotingService";
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
import CommunityInfoApproveList from "./CommunityInfoApproveList";

type CommunityInfoApproveProps = {
    community: Community;
};

type CommunityInfoApproveState = {
    field: "topics" | "posts" | "votings";
    isAccept: boolean;
    reload: boolean;
    topics: {
        input: TopicPaginationInput;
        output: PaginationOutput;
        loading: boolean;
    };
    posts: {
        input: PostPaginationInput;
        output: PaginationOutput;
        loading: boolean;
    };
    votings: {
        input: VotingPaginationInput;
        output: PaginationOutput;
        loading: boolean;
    };
};

const defaultPaginationState = {
    input: {
        ...defaultPaginationInput,
        pageCount: POST_PAGE_COUNT,
        isAccept: false,
        communityId: "",
    },
    output: defaultPaginationOutput,
    loading: true,
};

const defaultCommunityApproveState: CommunityInfoApproveState = {
    field: "topics",
    isAccept: false,
    posts: defaultPaginationState,
    topics: defaultPaginationState,
    votings: defaultPaginationState,
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

export const votingHeaderList: TableInfoHeader[] = [
    {
        title: "Người viết",
        width: "200px",
    },
    {
        title: "Thời gian",
        width: "200px",
    },
    {
        title: "Nội dung",
    },
];

const CommunityInfoApprove: React.FC<CommunityInfoApproveProps> = ({
    community,
}) => {
    const [communityApproveState, setCommunityApproveState] =
        useState<CommunityInfoApproveState>(defaultCommunityApproveState);
    const { getPosts, getTopics, getVotings } = usePagination();

    const getCommunityInfos = async () => {
        setCommunityApproveState((prev) => ({
            ...prev,
            [communityApproveState.field]: {
                ...prev[communityApproveState.field],
                loading: true,
            },
        }));
        let res: any = {};
        const input = {
            ...communityApproveState[communityApproveState.field].input,
            page: communityApproveState.reload
                ? 1
                : communityApproveState[communityApproveState.field].input.page,
            isFirst: communityApproveState.reload
                ? true
                : communityApproveState[communityApproveState.field].input
                      .isFirst,
            isAccept: communityApproveState.isAccept,
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
            case "votings": {
                res = await getVotings({
                    ...input,
                    communityId: community.id!,
                });
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

    const handleApproveVoting = async (
        voting: Voting,
        community: Community,
        isAccept: boolean
    ) => {
        await VotingService.approve({ voting, community, isAccept });
        setCommunityApproveState((prev) => ({
            ...prev,
            reload: true,
            votings: {
                ...prev.votings,
                output: {
                    ...prev.votings.output,
                    list: prev.votings.output.list.filter(
                        (item: Voting) => item.id !== voting.id
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
        communityApproveState.isAccept,
    ]);

    useEffect(() => {
        setCommunityApproveState((prev) => ({
            ...defaultCommunityApproveState,
            field: prev.field,
            isAccept: prev.isAccept,
        }));
    }, [communityApproveState.field, communityApproveState.isAccept]);

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
                    <Text>
                        Phê duyệt{" "}
                        {communityApproveState.field === "posts"
                            ? "bài viết"
                            : communityApproveState.field === "topics"
                            ? "chủ đề"
                            : "cuộc bình chọn"}
                    </Text>
                    <HStack spacing={4}>
                        <Select
                            w="250px"
                            borderColor="gray.400"
                            value={communityApproveState.isAccept ? 1 : 0}
                            onChange={(e) => {
                                setCommunityApproveState((prev) => ({
                                    ...prev,
                                    isAccept: !!e.target.value,
                                }));
                            }}
                        >
                            <option value={""}>Chưa duyệt</option>
                            <option value={1}>Đã duyệt</option>
                        </Select>
                        <Select
                            w="200px"
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
                            <option value={"votings"}>Cuộc bình chọn</option>
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
                ) : communityApproveState.field === "topics" ? (
                    <TableHeader list={topicHeaderList} />
                ) : (
                    <TableHeader list={votingHeaderList} />
                )}
                <Divider borderColor="gray.300" />
                {communityApproveState[communityApproveState.field].loading ? (
                    <Flex align="center" justify="center" w="100%" p={10}>
                        <Spinner />
                    </Flex>
                ) : communityApproveState.field === "posts" ? (
                    <CommunityInfoApproveList
                        list={communityApproveState.posts.output.list}
                        type="POST"
                        isAccept={communityApproveState.isAccept}
                        handleApprove={async (item, isAccept) => {
                            await handleApprovePost(item, community, isAccept);
                        }}
                        handleLock={async (item) => {
                            await PostService.toggleLockState({
                                post: item,
                                community,
                            });
                            setCommunityApproveState((prev) => ({
                                ...prev,
                                posts: {
                                    ...prev.posts,
                                    output: {
                                        ...prev.posts.output,
                                        list: prev.posts.output.list.map(
                                            (postItem: Post) =>
                                                postItem.id !== item.id
                                                    ? postItem
                                                    : {
                                                          ...postItem,
                                                          isLock: !postItem.isLock,
                                                      }
                                        ),
                                    },
                                },
                            }));
                        }}
                        renderChild={(post) => (
                            <PostHorizontalSnippetItem post={post} />
                        )}
                    />
                ) : communityApproveState.field === "topics" ? (
                    communityApproveState.topics.output.list &&
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
                    )
                ) : (
                    <CommunityInfoApproveList
                        list={communityApproveState.votings.output.list}
                        type="VOTING"
                        isAccept={communityApproveState.isAccept}
                        handleApprove={async (item, isAccept) => {
                            await handleApproveVoting(
                                item,
                                community,
                                isAccept
                            );
                        }}
                        handleLock={async (item) => {
                            // await PostService.toggleLockState({
                            //     post: item,
                            //     community,
                            // });
                            // setCommunityApproveState((prev) => ({
                            //     ...prev,
                            //     posts: {
                            //         ...prev.posts,
                            //         output: {
                            //             ...prev.posts.output,
                            //             list: prev.posts.output.list.map(
                            //                 (postItem: Post) =>
                            //                     postItem.id !== item.id
                            //                         ? postItem
                            //                         : {
                            //                               ...postItem,
                            //                               isLock: !postItem.isLock,
                            //                           }
                            //             ),
                            //         },
                            //     },
                            // }));
                        }}
                        renderChild={(voting) => (
                            <VotingHorizontalSnippetItem voting={voting} />
                        )}
                    />
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
