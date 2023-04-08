import InfiniteScroll from "@/components/InfiniteScroll";
import PostItem from "@/components/Post/Item";
import { usePost } from "@/hooks/usePost";
import { Community } from "@/models/Community";
import { Spinner, Text } from "@chakra-ui/react";
import React, { useEffect } from "react";

type CommunityPostTabProps = {
    community: Community;
};

const CommunityPostTab: React.FC<CommunityPostTabProps> = ({ community }) => {
    const { postAction, postState } = usePost();

    useEffect(() => {
        postAction.setSelectedCommunity(community);
    }, [community]);

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
                        <PostItem key={postData.post.id} postData={postData} />
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
