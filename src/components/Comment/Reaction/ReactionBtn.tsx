import { Box, Flex, Icon, IconButton, Stack } from "@chakra-ui/react";
import React from "react";
import {
    AiFillLike,
    AiOutlineLike,
    AiFillDislike,
    AiOutlineDislike,
} from "react-icons/ai";
import { RiEmotionHappyLine } from "react-icons/ri";

type ReactionBtnProps = {
    userVote: 1 | -1 | undefined;
    likeLoading: boolean;
    dislikeLoading: boolean;
    handleLikeComment: (value: 1 | -1) => Promise<void>;
};

const ReactionBtn: React.FC<ReactionBtnProps> = ({
    dislikeLoading,
    handleLikeComment,
    likeLoading,
    userVote,
}) => {
    return (
        <Flex position="relative" role="group" align="center">
            <Flex
                align="center"
                justify="center"
                boxShadow="rgba(0, 0, 0, 0.16) 0px 1px 4px"
                p={1}
                borderRadius={4}
                cursor="pointer"
            >
                <Icon as={RiEmotionHappyLine} fontSize={16} />
            </Flex>
            <Stack
                direction="row"
                align="center"
                spacing={0}
                position="absolute"
                bottom="100%"
                boxShadow="lg"
                borderRadius="16"
                bg="white"
                px={2}
                py={2}
                left={0}
                opacity={0}
                visibility="hidden"
                _groupHover={{
                    opacity: 1,
                    visibility: "visible",
                }}
                transition="all 0.3s"
            >
                <IconButton
                    aria-label="Like button"
                    variant="link"
                    icon={userVote === 1 ? <AiFillLike /> : <AiOutlineLike />}
                    color={userVote === 1 ? "brand.400" : "gray.500"}
                    fontSize={20}
                    mr={"4px"}
                    cursor="pointer"
                    onClick={() => handleLikeComment(1)}
                    isDisabled={dislikeLoading}
                    isLoading={likeLoading}
                />
                <IconButton
                    aria-label="Dislike button"
                    variant="link"
                    icon={
                        userVote === -1 ? (
                            <AiFillDislike />
                        ) : (
                            <AiOutlineDislike />
                        )
                    }
                    color={userVote === -1 ? "brand.400" : "gray.500"}
                    fontSize={20}
                    mr={"4px"}
                    cursor="pointer"
                    onClick={() => handleLikeComment(-1)}
                    isDisabled={likeLoading}
                    isLoading={dislikeLoading}
                />
            </Stack>
        </Flex>
    );
};
export default ReactionBtn;
