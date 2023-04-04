import { postHeaderList } from "@/components/Community/Approve/CommunityInfoApprove";
import { Post } from "@/models/Post";
import { Box, Flex, HStack, IconButton, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { AiOutlineCheck } from "react-icons/ai";
import { MdOutlineClear } from "react-icons/md";
import PostItemImages from "../Item/Images";
import PostItemPreview from "../Item/Preview";

type PostHorizontalSnippetItemProps = {
    post: Post;
    handleApprove?: (isAccept: boolean) => Promise<void>;
};

const PostHorizontalSnippetItem: React.FC<PostHorizontalSnippetItemProps> = ({
    post,
    handleApprove,
}) => {
    const [showPreview, setShowPreview] = useState(false);
    const [acceptLoading, setAcceptLoading] = useState(false);
    const [deleLoading, setDeleteLoading] = useState(false);

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
                    onHidden={(e) => {
                        e.stopPropagation();
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
            <IconButton
                aria-label="approve-button"
                icon={<AiOutlineCheck fontSize={16} />}
                ml={10}
                flexShrink={0}
                bg={"green.300"}
                _hover={{
                    bg: "green.400",
                }}
                isLoading={acceptLoading}
                isDisabled={deleLoading}
                onClick={async (e) => {
                    e.stopPropagation();
                    setAcceptLoading(true);
                    handleApprove && (await handleApprove(true));
                    setAcceptLoading(false);
                }}
            />
            <IconButton
                aria-label="approve-button"
                icon={<MdOutlineClear fontSize={16} />}
                ml={10}
                flexShrink={0}
                bg={"brand.100"}
                _hover={{
                    bg: "brand.400",
                }}
                isLoading={deleLoading}
                isDisabled={acceptLoading}
                onClick={async (e) => {
                    e.stopPropagation();
                    setDeleteLoading(true);
                    handleApprove && (await handleApprove(false));
                    setDeleteLoading(false);
                }}
            />
        </Flex>
    );
};
export default PostHorizontalSnippetItem;
