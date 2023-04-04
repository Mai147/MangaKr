import Pagination from "@/components/Pagination";
import PostHorizontalSnippetItem from "@/components/Post/Snippet/PostHorizontalSnippetItem";
import TableHeader, { TableInfoHeader } from "@/components/Table/TableHeader";
import { POST_PAGE_COUNT } from "@/constants/pagination";
import { routes } from "@/constants/routes";
import usePagination, {
    defaultPaginationInput,
    PaginationInput,
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

interface CommunityInfoPaginationInput extends PaginationInput {
    communityId: string;
    reload: boolean;
    type: "topics" | "posts";
}

const defaultCommunityInfoPaginationInput: CommunityInfoPaginationInput = {
    ...defaultPaginationInput,
    pageCount: POST_PAGE_COUNT,
    communityId: "",
    type: "posts",
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
    const [communityInfoPaginationInput, setCommunityInfoPaginationInput] =
        useState<CommunityInfoPaginationInput>(
            defaultCommunityInfoPaginationInput
        );
    const [postList, setPostList] = useState<Post[]>([]);
    const [topicList, setTopicList] = useState<Topic[]>([]);
    const { getPosts, getTopics } = usePagination();

    const getCommunityInfos = async () => {
        setCommunityInfoPaginationInput((prev) => ({
            ...prev,
            loading: true,
        }));
        let res: any = {};
        switch (communityInfoPaginationInput.type) {
            case "posts": {
                res = await getPosts({
                    ...communityInfoPaginationInput,
                    page: communityInfoPaginationInput.reload
                        ? 1
                        : communityInfoPaginationInput.page,
                    isFirst: communityInfoPaginationInput.reload
                        ? true
                        : communityInfoPaginationInput.isFirst,
                    communityId: community.id,
                    isAccept: false,
                });
                setPostList(res.posts);
                break;
            }
            case "topics": {
                res = await getTopics({
                    ...communityInfoPaginationInput,
                    page: communityInfoPaginationInput.reload
                        ? 1
                        : communityInfoPaginationInput.page,
                    isFirst: communityInfoPaginationInput.reload
                        ? true
                        : communityInfoPaginationInput.isFirst,
                    communityId: community.id!,
                    isAccept: false,
                });
                setTopicList(res.topics);
                break;
            }
        }
        setCommunityInfoPaginationInput((prev) => ({
            ...prev,
            isFirst: false,
            loading: false,
            page: prev.reload ? 1 : prev.page,
            totalPage: res.totalPage || 0,
            reload: false,
        }));
    };

    const handleApprovePost = async (
        post: Post,
        community: Community,
        isAccept: boolean
    ) => {
        await PostService.approve({ post, community, isAccept });
        setCommunityInfoPaginationInput((prev) => ({
            ...prev,
            reload: true,
        }));
        setPostList((prev) => prev.filter((item) => item.id !== post.id));
    };

    const handleApproveTopic = async (
        topic: Topic,
        community: Community,
        isAccept: boolean
    ) => {
        await TopicService.approve({ topic, community, isAccept });
        setCommunityInfoPaginationInput((prev) => ({
            ...prev,
            reload: true,
        }));
        setTopicList((prev) => prev.filter((item) => item.id !== topic.id));
    };

    useEffect(() => {
        getCommunityInfos();
    }, [communityInfoPaginationInput.page, communityInfoPaginationInput.type]);

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
                            value={communityInfoPaginationInput.type}
                            onChange={(e) => {
                                setCommunityInfoPaginationInput((prev) => ({
                                    ...prev,
                                    page: 1,
                                    isFirst: true,
                                    isNext: true,
                                    type: e.target.value as "topics" | "posts",
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
                {communityInfoPaginationInput.type === "posts" ? (
                    <TableHeader list={postHeaderList} />
                ) : (
                    <TableHeader list={topicHeaderList} />
                )}
                <Divider borderColor="gray.300" />
                {communityInfoPaginationInput.loading ? (
                    <Flex align="center" justify="center" w="100%" p={10}>
                        <Spinner />
                    </Flex>
                ) : communityInfoPaginationInput.type === "posts" ? (
                    postList && postList.length > 0 ? (
                        postList.map((post) => (
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
                        ))
                    ) : (
                        <Flex align="center" justify="center" w="100%" py={10}>
                            <Text>Không có bài viết cần phê duyệt</Text>
                        </Flex>
                    )
                ) : topicList && topicList.length > 0 ? (
                    topicList.map((topic) => (
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
                    ))
                ) : (
                    <Flex align="center" justify="center" w="100%" py={10}>
                        <Text>Không có chủ đề cần phê duyệt</Text>
                    </Flex>
                )}
            </VStack>
            <Flex align="center" py={6} justify="center" w="100%">
                <Pagination
                    page={communityInfoPaginationInput.page}
                    totalPage={communityInfoPaginationInput.totalPage}
                    onNext={() =>
                        setCommunityInfoPaginationInput((prev) => ({
                            ...prev,
                            page: prev.page + 1,
                            isNext: true,
                        }))
                    }
                    onPrev={() =>
                        setCommunityInfoPaginationInput((prev) => ({
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
export default CommunityInfoApprove;
