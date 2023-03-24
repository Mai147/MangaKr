import useCommunity from "@/hooks/useCommunity";
import { Post } from "@/models/Post";
import { PostVote, postVoteList } from "@/models/Vote";
import { formatNumber } from "@/utils/StringUtils";
import { Divider, Flex, HStack, Icon, Text, VStack } from "@chakra-ui/react";
import React, { SetStateAction, useState } from "react";
import { AiFillLike, AiFillDislike } from "react-icons/ai";
import { FaLaughSquint, FaAngry } from "react-icons/fa";
import { MdFavorite } from "react-icons/md";
import { RiChat3Line } from "react-icons/ri";
import VotePopup from "./VotePopup";

type PostReactionBarProps = {
    post: Post;
    setShowCommentInput: React.Dispatch<SetStateAction<boolean>>;
};

const PostReactionBar: React.FC<PostReactionBarProps> = ({
    post,
    setShowCommentInput,
}) => {
    const { communityState, communityAction } = useCommunity();
    const [loading, setLoading] = useState(false);
    const [selectedReaction, setSelectedReaction] = useState<
        PostVote | undefined
    >();
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
                            communityState.communityPostVotes?.find(
                                (item) => item.postId === post.id
                            )?.voteValue
                        }
                        onVote={async (value) => {
                            await communityAction.onPostVote(value, post.id!);
                        }}
                    />
                    {/* <Box position="relative" role="group">
                        <Flex align="center" justify="center">
                            <Icon
                                as={RiEmotionHappyLine}
                                fontSize={26}
                                cursor="pointer"
                            />
                        </Flex>
                        <Box
                            position="absolute"
                            bottom={`calc(100% + 16px)`}
                            left={-4}
                            bg="white"
                            p={4}
                            borderRadius={4}
                            boxShadow="rgba(0, 0, 0, 0.24) 0px 3px 8px"
                            _before={{
                                content: '""',
                                position: "absolute",
                                top: "100%",
                                left: 4,
                                w: 0,
                                h: 0,
                                borderLeft: "12px solid transparent",
                                borderRight: "12px solid transparent",
                                borderTop: "12px solid white",
                                filter: "drop-shadow(3px 3px 2px rgba(0,0,0,0.25))",
                            }}
                            _after={{
                                content: '""',
                                position: "absolute",
                                top: "100%",
                                left: 0,
                                w: "100%",
                                h: "24px",
                                bg: "transparent",
                            }}
                            opacity={0}
                            visibility="hidden"
                            _groupHover={{ opacity: 1, visibility: "visible" }}
                            transition="all 0.3s"
                        >
                            <HStack spacing={6} fontSize={24}>
                                {postVoteList.map((e, idx) => (
                                    <ReactionItem
                                        key={idx}
                                        icon={e.icon}
                                        color={e.color}
                                        isActive={
                                            communityState.communityPostVotes?.find(
                                                (item) =>
                                                    item.postId === post.id
                                            )?.voteValue?.value === e.value
                                        }
                                        isLoading={
                                            loading && e === selectedReaction
                                        }
                                        isDisabled={loading}
                                        value={e}
                                        onClick={async (value) => {
                                            setLoading(true);
                                            setSelectedReaction(e);
                                            await communityAction.onPostVote(
                                                value,
                                                post.id!
                                            );
                                            setLoading(false);
                                        }}
                                    />
                                ))}
                            </HStack>
                        </Box>
                    </Box> */}
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
                >
                    {formatNumber(post.numberOfComments)} bình luận
                </Text>
            </Flex>
            <Divider borderColor="gray.300" />
        </VStack>
    );
};
export default PostReactionBar;
