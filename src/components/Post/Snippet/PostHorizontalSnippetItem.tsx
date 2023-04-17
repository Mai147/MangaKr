import { postHeaderList } from "@/components/Community/Approve/CommunityInfoApprove";
import { Post } from "@/models/Post";
import { Box, Flex, HStack, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import PostItemImages from "../Item/Images";
import PostItemPreview from "../Item/Preview";

type PostHorizontalSnippetItemProps = {
    post: Post;
};

const PostHorizontalSnippetItem: React.FC<PostHorizontalSnippetItemProps> = ({
    post,
}) => {
    const [showPreview, setShowPreview] = useState(false);
    return (
        <Flex
            justify="space-between"
            align="center"
            w="100%"
            p={4}
            _hover={{ bg: "gray.50" }}
            transition="all 0.3s"
            cursor="pointer"
            onClick={() => setShowPreview(true)}
        >
            {showPreview && (
                <PostItemPreview
                    post={post}
                    onHidden={() => {
                        setShowPreview(false);
                    }}
                />
            )}
            <HStack spacing={4} flexGrow={1}>
                <Text w={postHeaderList[0].width} flexShrink={0}>
                    {post.creatorDisplayName}
                </Text>
                <Box w={postHeaderList[1].width} flexShrink={0}>
                    <PostItemImages
                        imageList={post.imageUrls}
                        size="sm"
                        canShow={false}
                    />
                </Box>
                <Text w={postHeaderList[2].width} flexShrink={0}>
                    {post.caption}
                </Text>
                <div
                    dangerouslySetInnerHTML={{
                        __html: post.description || "---",
                    }}
                    className="ck ck-content"
                    style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        flexGrow: 1,
                    }}
                ></div>
            </HStack>
        </Flex>
    );
};
export default PostHorizontalSnippetItem;
