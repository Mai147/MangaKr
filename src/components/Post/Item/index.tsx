import { Box, VStack } from "@chakra-ui/react";
import React, { useState } from "react";
import "moment/locale/vi";
import { PostItemState } from "@/context/PostContext";
import PostItemHeader from "./Header";
import PostItemContent from "./Content";
import PostItemImages from "./Images";
import PostCommentInput from "./Comment/PostCommentInput";
import PostComments from "./Comment";
import PostReactionBar from "./ReactionBar";

type PostItemProps = {
    postData: PostItemState;
};

const PostItem: React.FC<PostItemProps> = ({ postData }) => {
    const [showCommentInput, setShowCommentInput] = useState(false);
    const [showCommentList, setShowCommentList] = useState(false);
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
                <PostItemHeader post={postData.post} />
                <PostItemContent post={postData.post} />
                <Box w="100%">
                    <PostItemImages imageList={postData.post.imageUrls} />
                </Box>
                <PostReactionBar
                    post={postData.post}
                    setShowCommentInput={setShowCommentInput}
                    setShowCommentList={setShowCommentList}
                />
                {showCommentInput && (
                    <Box pb={3} w="100%">
                        <PostCommentInput
                            post={postData.post}
                            onHidden={() => setShowCommentInput(false)}
                        />
                    </Box>
                )}
                {showCommentList && <PostComments post={postData.post} />}
            </VStack>
        </Box>
    );
};
export default PostItem;
