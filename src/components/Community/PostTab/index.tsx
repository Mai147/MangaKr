import InfiniteScroll from "@/components/InfiniteScroll";
import PostItem from "@/components/Post/Item";
import usePost from "@/hooks/usePost";
import { Box, Spinner, Text } from "@chakra-ui/react";
import React from "react";

type CommunityPostTabProps = {};

const CommunityPostTab: React.FC<CommunityPostTabProps> = () => {
    const { postAction, postState } = usePost();

    return (
        <>
            {postState.output.list.length > 0 ? (
                <InfiniteScroll
                    page={postState.output.page}
                    totalPage={postState.output.totalPage}
                    onNext={postAction.loadMore}
                    isLoading={postState.loading.getAll}
                >
                    {postState.output.list.map((postData) => (
                        <Box w="100%" mb={10} key={postData.post.id!}>
                            <PostItem
                                key={postData.post.id}
                                postData={postData}
                            />
                        </Box>
                    ))}
                </InfiniteScroll>
            ) : (
                !postState.loading.getAll && <Text>Chưa có bài viết nào</Text>
            )}

            {postState.loading.getAll && <Spinner my={4} />}
        </>
    );
};
export default CommunityPostTab;
