import useAuth from "@/hooks/useAuth";
import usePost from "@/hooks/usePost";
import { Post } from "@/models/Post";
import { postVoteList } from "@/models/Vote";
import { formatNumber } from "@/utils/StringUtils";
import {
    Divider,
    Flex,
    HStack,
    Icon,
    Spinner,
    Text,
    VStack,
} from "@chakra-ui/react";
import React, { SetStateAction, useState } from "react";
import { AiFillLike, AiFillDislike, AiOutlineShareAlt } from "react-icons/ai";
import { FaLaughSquint, FaAngry } from "react-icons/fa";
import { MdFavorite } from "react-icons/md";
import { RiChat3Line } from "react-icons/ri";
import VotePopup from "./VotePopup";

type PostReactionBarProps = {
    post: Post;
    isShared?: boolean;
    size?: "md" | "lg";
    setShowCommentInput?: React.Dispatch<SetStateAction<boolean>>;
    setShowCommentList?: React.Dispatch<SetStateAction<boolean>>;
    reaction?: boolean;
};

const PostReactionBar: React.FC<PostReactionBarProps> = ({
    post,
    size = "md",
    isShared,
    setShowCommentInput,
    setShowCommentList,
    reaction = true,
}) => {
    const { postAction, postState } = usePost();
    const { user } = useAuth();
    const [shareLoading, setShareLoading] = useState(false);
    return (
        <VStack
            align="flex-start"
            w="100%"
            py={size === "md" ? 1 : 4}
            spacing={3}
        >
            <Flex px={size === "md" ? 6 : 8} justify="space-between" w="100%">
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
                {reaction ? (
                    <HStack fontSize={24} spacing={6}>
                        <VotePopup
                            voteList={postVoteList}
                            userVoteValue={
                                postState.output.list.find(
                                    (item) => item.post.id === post.id
                                )?.voteValue
                            }
                            onVote={async (value) => {
                                await postAction.vote(value, post.id!);
                            }}
                        />
                        <Icon
                            as={RiChat3Line}
                            cursor="pointer"
                            onClick={() => {
                                setShowCommentInput &&
                                    setShowCommentInput((prev) => !prev);
                            }}
                        />
                        {user &&
                            user.uid !== post.creatorId &&
                            isShared === false &&
                            (shareLoading ? (
                                <Spinner />
                            ) : (
                                <Icon
                                    as={AiOutlineShareAlt}
                                    cursor="pointer"
                                    onClick={async () => {
                                        setShareLoading(true);
                                        await postAction.share(post, user);
                                        setShareLoading(false);
                                    }}
                                />
                            ))}
                    </HStack>
                ) : (
                    <Text></Text>
                )}
                <Text
                    cursor="pointer"
                    _hover={{ textDecoration: "underline" }}
                    color="gray.600"
                    onClick={() => {
                        reaction &&
                            setShowCommentList &&
                            setShowCommentList((prev) => !prev);
                    }}
                >
                    {formatNumber(post.numberOfComments)} bình luận
                </Text>
            </Flex>
            <Divider borderColor="gray.300" />
        </VStack>
    );
};
export default PostReactionBar;
