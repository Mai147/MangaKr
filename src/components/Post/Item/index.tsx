import { Post } from "@/models/Post";
import { Box, Stack, VStack } from "@chakra-ui/react";
import React, { useState } from "react";
import "moment/locale/vi";
import PostReactionBar from "./ReactionBar";
import PostItemHeader from "./Header";
import PostItemImages from "./Images";
import PostItemContent from "./Content";
import PostCommentInput from "./Comment/PostCommentInput";
import PostComments from "./Comment";

type PostItemProps = {
    post: Post;
};

const PostItem: React.FC<PostItemProps> = ({ post }) => {
    const [showCommentInput, setShowCommentInput] = useState(false);
    return (
        <Box
            border="1px solid"
            borderColor="gray.300"
            borderRadius={8}
            boxShadow="rgba(0, 0, 0, 0.24) 0px 3px 8px"
            overflow="hidden"
            mb={10}
            w="100%"
        >
            <VStack align="flex-start" w="100%">
                <PostItemHeader post={post} />
                <PostItemContent post={post} />
                <Box w="100%">
                    <PostItemImages imageList={post.imageUrls} />
                </Box>
                <PostReactionBar
                    post={post}
                    setShowCommentInput={setShowCommentInput}
                />
                {showCommentInput && (
                    <Box pb={3} w="100%">
                        <PostCommentInput
                            post={post}
                            onHidden={() => setShowCommentInput(false)}
                        />
                    </Box>
                )}
                <PostComments post={post} />
            </VStack>
        </Box>
    );
};
export default PostItem;
