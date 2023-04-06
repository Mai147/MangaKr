import InfiniteScroll from "@/components/InfiniteScroll";
import PostItem from "@/components/Post/Item";
import { usePost } from "@/hooks/usePost";
import { Community } from "@/models/Community";
import { Spinner, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

type CommunityPostTabProps = {
    community: Community;
};

const CommunityPostTab: React.FC<CommunityPostTabProps> = ({ community }) => {
    const { postAction, postState } = usePost();

    useEffect(() => {
        postAction.community.setSelected(community);
    }, [community]);

    return (
        <>
            {postState.postList.community.length > 0 ? (
                <InfiniteScroll
                    page={postState.paginationInput.community.post.page}
                    totalPage={
                        postState.paginationInput.community.post.totalPage
                    }
                    onNext={postAction.community.loadMorePost}
                    isLoading={postState.paginationInput.community.post.loading}
                >
                    {postState.postList.community.map((postData) => (
                        <PostItem key={postData.post.id} postData={postData} />
                    ))}
                </InfiniteScroll>
            ) : (
                !postState.paginationInput.community.post.loading && (
                    <Text>Chưa có bài viết nào</Text>
                )
            )}

            {postState.paginationInput.community.post.loading && (
                <Spinner my={4} />
            )}
        </>
    );
};
export default CommunityPostTab;
