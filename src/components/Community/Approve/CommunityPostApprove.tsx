import Pagination from "@/components/Pagination";
import PostHorizontalSnippetItem from "@/components/Post/Snippet/PostHorizontalSnippetItem";
import { POST_PAGE_COUNT } from "@/constants/pagination";
import { COMMUNITY_PAGE } from "@/constants/routes";
import useCommunity from "@/hooks/useCommunity";
import usePagination, {
    defaultPaginationInput,
    PaginationInput,
} from "@/hooks/usePagination";
import { Community } from "@/models/Community";
import { Post } from "@/models/Post";
import PostService from "@/services/PostService";
import {
    Box,
    Button,
    Divider,
    Flex,
    HStack,
    Link,
    Spinner,
    Text,
    VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import CommunityLeftSideBarAction from "../LeftSideBar/Action";

type CommunityPostApproveProps = {
    community: Community;
};

interface CommunityPostPaginationInput extends PaginationInput {
    communityId: string;
    reload: boolean;
}

const defaultCommunityPostPaginationInput: CommunityPostPaginationInput = {
    ...defaultPaginationInput,
    pageCount: POST_PAGE_COUNT,
    communityId: "",
    reload: false,
};

const CommunityPostApprove: React.FC<CommunityPostApproveProps> = ({
    community,
}) => {
    const [postPaginationInput, setPostPaginationInput] =
        useState<CommunityPostPaginationInput>(
            defaultCommunityPostPaginationInput
        );
    const [postList, setPostList] = useState<Post[]>([]);
    const { getPosts } = usePagination();
    const { communityState } = useCommunity();

    const getCommunityPosts = async () => {
        setPostPaginationInput((prev) => ({
            ...prev,
            loading: true,
        }));
        const res = await getPosts({
            ...postPaginationInput,
            page: postPaginationInput.reload ? 1 : postPaginationInput.page,
            isFirst: postPaginationInput.reload
                ? true
                : postPaginationInput.isFirst,
            communityId: community.id,
            isAccept: false,
        });
        setPostList(res.posts);
        setPostPaginationInput((prev) => ({
            ...prev,
            isFirst: false,
            loading: false,
            page: prev.reload ? 1 : prev.page,
            totalPage: res.totalPage || 0,
            reload: false,
        }));
    };

    const handleApprove = async (
        post: Post,
        community: Community,
        isAccept: boolean
    ) => {
        await PostService.approve({ post, community, isAccept });
        setPostPaginationInput((prev) => ({
            ...prev,
            reload: true,
        }));
        setPostList((prev) => prev.filter((item) => item.id !== post.id));
    };

    useEffect(() => {
        getCommunityPosts();
    }, [postPaginationInput.page]);

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
                    <HStack spacing={2} align="center">
                        <Link
                            href={`${COMMUNITY_PAGE}/${community.id!}`}
                            _hover={{ textDecoration: "none" }}
                        >
                            <Button>Quay lại cộng đồng</Button>
                        </Link>
                        <CommunityLeftSideBarAction />
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
                        Người viết
                    </Text>
                    <Text w="80px" flexShrink={0}>
                        Ảnh
                    </Text>
                    <Text w="200px" flexShrink={0}>
                        Tiêu đề
                    </Text>
                    <Text flexGrow={1}>Nội dung</Text>
                </HStack>
                <Divider borderColor="gray.300" />
                {postPaginationInput.loading ? (
                    <Flex align="center" justify="center" w="100%" p={10}>
                        <Spinner />
                    </Flex>
                ) : postList && postList.length > 0 ? (
                    postList.map((post) => (
                        <Box key={post.id} w="100%">
                            <PostHorizontalSnippetItem
                                post={post}
                                handleApprove={async (isAccept) => {
                                    await handleApprove(
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
                )}
            </VStack>
            <Flex align="center" py={6} justify="center" w="100%">
                <Pagination
                    page={postPaginationInput.page}
                    totalPage={postPaginationInput.totalPage}
                    onNext={() =>
                        setPostPaginationInput((prev) => ({
                            ...prev,
                            page: prev.page + 1,
                            isNext: true,
                        }))
                    }
                    onPrev={() =>
                        setPostPaginationInput((prev) => ({
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
export default CommunityPostApprove;
