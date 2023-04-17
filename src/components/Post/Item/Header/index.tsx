import PostEditPrivacyModal from "@/components/Modal/Post/EditPrivacy";
import { privacyList } from "@/constants/privacy";
import useAuth from "@/hooks/useAuth";
import useModal from "@/hooks/useModal";
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
    HStack,
} from "@chakra-ui/react";
import moment from "moment";
import "moment/locale/vi";
import React, { useState } from "react";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { FiMoreVertical } from "react-icons/fi";

type PostItemHeaderProps = {
    post: Post;
};

const PostItemHeader: React.FC<PostItemHeaderProps> = ({ post }) => {
    const { postState, postAction } = usePost();
    const [deletePostLoading, setDeletePostLoading] = useState(false);
    const { user } = useAuth();
    const [showEditPrivacy, setShowEditPrivacy] = useState(false);
    return (
        <>
            {showEditPrivacy && (
                <PostEditPrivacyModal
                    post={post}
                    onHidden={() => setShowEditPrivacy(false)}
                />
            )}
            <Flex p={4} pb={2} align="center" justify="space-between" w="100%">
                <Flex align="center">
                    <Avatar
                        src={post.creatorImageUrl || "/images/noImage.jpg"}
                        mr={2}
                    />
                    <VStack spacing={0} align="flex-start">
                        <HStack align="flex-end">
                            <Text fontWeight={500} fontSize={18} lineHeight={1}>
                                {post.creatorDisplayName}
                            </Text>
                            {user && user.uid === post.creatorId && (
                                <>
                                    <Text lineHeight={1}>-</Text>
                                    <Text
                                        fontSize={14}
                                        color="gray.500"
                                        fontWeight={500}
                                        lineHeight={1}
                                    >
                                        {
                                            privacyList.find(
                                                (item) =>
                                                    item.value ===
                                                    post.privacyType
                                            )?.title
                                        }
                                    </Text>
                                </>
                            )}
                        </HStack>
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
                            (deletePostLoading ? (
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
                                    isDisabled={deletePostLoading}
                                    onClick={async () => {
                                        setDeletePostLoading(true);
                                        await postAction.delete(post);
                                        setDeletePostLoading(false);
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
                        {user && user.uid === post.creatorId && (
                            <Button
                                variant="unstyled"
                                onClick={() => {
                                    setShowEditPrivacy(true);
                                }}
                            >
                                <Flex align="center">
                                    Sửa chế độ hiển thị
                                    <Icon
                                        as={AiOutlineEye}
                                        fontSize={18}
                                        ml={1}
                                    />
                                </Flex>
                            </Button>
                        )}
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
