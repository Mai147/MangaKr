import { usePost } from "@/hooks/usePost";
import { Post } from "@/models/Post";
import { postVoteList } from "@/models/Vote";
import { formatNumber } from "@/utils/StringUtils";
import { Divider, Flex, HStack, Icon, Text, VStack } from "@chakra-ui/react";
import React, { SetStateAction } from "react";
import { AiFillLike, AiFillDislike } from "react-icons/ai";
import { FaLaughSquint, FaAngry } from "react-icons/fa";
import { MdFavorite } from "react-icons/md";
import { RiChat3Line } from "react-icons/ri";
import VotePopup from "./VotePopup";

type PostReactionBarProps = {
    post: Post;
    setShowCommentInput: React.Dispatch<SetStateAction<boolean>>;
    setShowCommentList: React.Dispatch<SetStateAction<boolean>>;
};

const PostReactionBar: React.FC<PostReactionBarProps> = ({
    post,
    setShowCommentInput,
    setShowCommentList,
}) => {
    const { postAction, postState } = usePost();
    return (
        <VStack align="flex-start" w="100%" py={1} spacing={3}>
            <Flex px={6} justify="space-between" w="100%">
                <HStack spacing={1} fontSize={24}>
                    <Text>{formatNumber(post.numberOfLikes)}</Text>
                    <Icon as={AiFillLike} color="blue.500" />
                </HStack>
                <HStack spacing={1} fontSize={24}>
                    <Text>{formatNumber(post.numberOfFavorites)}</Text>
                    <Icon as={MdFavorite} color="brand.100" />
                </HStack>
                <HStack spacing={1} fontSize={24}>
                    <Text>{formatNumber(post.numberOfLaughs)}</Text>
                    <Icon as={FaLaughSquint} color="yellow.400" />
                </HStack>
                <HStack spacing={1} fontSize={24}>
                    <Text>{formatNumber(post.numberOfDislikes)}</Text>
                    <Icon as={AiFillDislike} color="gray.700" />
                </HStack>
                <HStack spacing={1} fontSize={24}>
                    <Text>{formatNumber(post.numberOfAngrys)}</Text>
                    <Icon as={FaAngry} color="red.500" />
                </HStack>
            </Flex>
            <Divider borderColor="gray.300" />
            <Flex px={6} justify="space-between" w="100%">
                <HStack fontSize={24} spacing={6}>
                    <VotePopup
                        voteList={postVoteList}
                        userVoteValue={
                            postState.selected.user
                                ? postState.postList.user.find(
                                      (item) => item.post.id === post.id
                                  )?.voteValue
                                : postState.postList.community.find(
                                      (item) => item.post.id === post.id
                                  )?.voteValue
                        }
                        onVote={async (value) => {
                            postState.selected.user
                                ? await postAction.user.vote(value, post.id!)
                                : await postAction.community.vote(
                                      value,
                                      post.id!
                                  );
                        }}
                    />
                    <Icon
                        as={RiChat3Line}
                        cursor="pointer"
                        onClick={() => setShowCommentInput((prev) => !prev)}
                    />
                </HStack>
                <Text
                    cursor="pointer"
                    _hover={{ textDecoration: "underline" }}
                    color="gray.600"
                    onClick={() => setShowCommentList((prev) => !prev)}
                >
                    {formatNumber(post.numberOfComments)} bình luận
                </Text>
            </Flex>
            <Divider borderColor="gray.300" />
        </VStack>
    );
};
export default PostReactionBar;
