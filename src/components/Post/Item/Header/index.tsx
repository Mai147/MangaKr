import useAuth from "@/hooks/useAuth";
import usePost from "@/hooks/usePost";
import { Post } from "@/models/Post";
import {
    Flex,
    Avatar,
    VStack,
    Text,
    Box,
    Button,
    Icon,
    Spinner,
} from "@chakra-ui/react";
import moment from "moment";
import "moment/locale/vi";
import React, { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { FiMoreVertical } from "react-icons/fi";

type PostItemHeaderProps = {
    post: Post;
};

const PostItemHeader: React.FC<PostItemHeaderProps> = ({ post }) => {
    const { postState, postAction } = usePost();
    const [deletePostLoading, setDeletePostLoading] = useState(false);
    const { user } = useAuth();
    return (
        <>
            <Flex p={4} pb={2} align="center" justify="space-between" w="100%">
                <Flex align="center">
                    <Avatar
                        src={post.creatorImageUrl || "/images/noImage.jpg"}
                        mr={2}
                    />
                    <VStack spacing={0} align="flex-start">
                        <Text fontWeight={500} fontSize={18} lineHeight={1}>
                            {post.creatorDisplayName}
                        </Text>
                        {post.createdAt?.seconds && (
                            <Text
                                color="gray.600"
                                fontSize={12}
                                fontWeight={500}
                            >
                                {moment(
                                    new Date(post.createdAt?.seconds * 1000)
                                )
                                    .locale("vi")
                                    .fromNow()}
                            </Text>
                        )}
                    </VStack>
                </Flex>
                <Box position="relative" role="group">
                    <Icon
                        as={FiMoreVertical}
                        color="gray.700"
                        fontSize={24}
                        cursor="pointer"
                    />
                    <Box
                        position="absolute"
                        top={4}
                        right={4}
                        px={4}
                        bg="white"
                        boxShadow="md"
                        borderRadius={4}
                        opacity={0}
                        visibility="hidden"
                        _groupHover={{ opacity: 1, visibility: "visible" }}
                    >
                        {user &&
                            user.uid === post.creatorId &&
                            (postState.loading.delete.find(
                                (item) => item.postId === post.id
                            )?.loading ? (
                                <Flex
                                    align="center"
                                    justify="center"
                                    w="100%"
                                    py={2}
                                >
                                    <Spinner size="sm" />
                                </Flex>
                            ) : (
                                <Button
                                    variant="unstyled"
                                    isDisabled={
                                        postState.loading.delete.find(
                                            (item) => item.postId === post.id
                                        )?.loading
                                    }
                                    onClick={async () => {
                                        await postAction.delete(post);
                                    }}
                                >
                                    <Flex align="center">
                                        Xóa bài viết
                                        <Icon
                                            as={AiOutlineDelete}
                                            fontSize={18}
                                            ml={1}
                                        />
                                    </Flex>
                                </Button>
                            ))}
                    </Box>
                </Box>
            </Flex>

            <Flex justify="center" align="center" w="100%" px={4}>
                <Box borderBottom="1px solid" borderColor="gray.300" w="100%" />
            </Flex>
        </>
    );
};
export default PostItemHeader;
