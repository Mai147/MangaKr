import PostEditPrivacyModal from "@/components/Modal/Post/EditPrivacy";
import { privacyList } from "@/constants/privacy";
import { routes } from "@/constants/routes";
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
    HStack,
    Link,
} from "@chakra-ui/react";
import moment from "moment";
import "moment/locale/vi";
import React, { useState } from "react";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { FiMoreVertical } from "react-icons/fi";
import { HiOutlineDocumentSearch } from "react-icons/hi";

type PostItemHeaderProps = {
    post: Post;
    action?: boolean;
    size?: "md" | "lg";
    back?: boolean;
};

const PostItemHeader: React.FC<PostItemHeaderProps> = ({
    post,
    action = true,
    size = "md",
    back = false,
}) => {
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
            <Flex
                p={size === "md" ? 4 : 8}
                pb={size === "md" ? 2 : 4}
                align="center"
                justify="space-between"
                w="100%"
            >
                <Flex align="center">
                    <Avatar
                        src={post.creatorImageUrl || "/images/noImage.jpg"}
                        mr={size === "md" ? 2 : 4}
                        size={size}
                    />
                    <VStack spacing={0} align="flex-start">
                        <HStack align="flex-end">
                            <Text
                                fontWeight={500}
                                fontSize={size === "md" ? 18 : 24}
                                lineHeight={1}
                            >
                                {post.creatorDisplayName}
                            </Text>
                            {postState.selectedUser &&
                                user &&
                                user.uid === post.creatorId && (
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
                                fontSize={size === "md" ? 12 : 14}
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
                {action && (
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
                            boxShadow="rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px"
                            borderRadius={4}
                            opacity={0}
                            visibility="hidden"
                            _groupHover={{ opacity: 1, visibility: "visible" }}
                        >
                            <Link
                                href={
                                    postState.selectedCommunity
                                        ? routes.getCommunityPostDetailPage(
                                              postState.selectedCommunity.id!,
                                              post.id!
                                          )
                                        : postState.selectedUser
                                        ? routes.getUserPostDetailPage(
                                              postState.selectedUser.uid,
                                              post.id!
                                          )
                                        : undefined
                                }
                                w="100%"
                                _hover={{ textDecoration: "none" }}
                            >
                                <Button variant="unstyled">
                                    <Flex align="center">
                                        Xem bài viết
                                        <Icon
                                            as={HiOutlineDocumentSearch}
                                            fontSize={18}
                                            ml={1}
                                        />
                                    </Flex>
                                </Button>
                            </Link>
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
                            {postState.selectedUser &&
                                user &&
                                user.uid === post.creatorId && (
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
                )}
                {back &&
                    (postState.selectedUser || postState.selectedCommunity) && (
                        <Link
                            href={
                                postState.selectedUser
                                    ? routes.getProfilePage(
                                          postState.selectedUser.uid
                                      )
                                    : routes.getCommunityDetailPage(
                                          postState.selectedCommunity!.id!
                                      )
                            }
                        >
                            <Button w="28" flexShrink={0}>
                                Quay lại
                            </Button>
                        </Link>
                    )}
            </Flex>

            <Flex
                justify="center"
                align="center"
                w="100%"
                px={size === "md" ? 4 : 8}
            >
                <Box borderBottom="1px solid" borderColor="gray.300" w="100%" />
            </Flex>
        </>
    );
};
export default PostItemHeader;
