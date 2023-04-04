import InfiniteScroll from "@/components/InfiniteScroll";
import PostItem from "@/components/Post/Item";
import useCommunity from "@/hooks/useCommunity";
import { Spinner, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

type CommunityPostTabProps = {};

const CommunityPostTab: React.FC<CommunityPostTabProps> = () => {
    const { communityState } = useCommunity();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (communityState.communityPostPagination?.state) {
            setLoading(communityState.communityPostPagination.state.loading);
        }
    }, [communityState.communityPostPagination?.state.loading]);
    return (
        <>
            {communityState.communityPosts &&
            communityState.communityPosts.length > 0 ? (
                <InfiniteScroll
                    page={
                        communityState.communityPostPagination?.state.page || 1
                    }
                    totalPage={
                        communityState.communityPostPagination?.state
                            .totalPage || 1
                    }
                    onNext={communityState.communityPostPagination?.onNext}
                    isLoading={loading}
                >
                    {communityState.communityPosts?.map((post) => (
                        <PostItem key={post.id} post={post} />
                    ))}
                </InfiniteScroll>
            ) : (
                !communityState.communityPostPagination?.state.loading && (
                    <Text>Chưa có bài viết nào</Text>
                )
            )}

            {communityState.communityPostPagination?.state.loading && (
                <Spinner my={4} />
            )}
        </>
    );
};
export default CommunityPostTab;
