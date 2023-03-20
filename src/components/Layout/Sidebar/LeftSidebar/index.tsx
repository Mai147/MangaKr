import { VStack, IconButton } from "@chakra-ui/react";
import React from "react";
import { IconType } from "react-icons";
import {
    AiFillLike,
    AiOutlineLike,
    AiFillDislike,
    AiOutlineDislike,
} from "react-icons/ai";

type LeftSidebarProps = {
    handleLike: (value: 1 | -1) => Promise<void>;
    userVote: 1 | -1 | undefined;
    likeLoading: boolean;
    dislikeLoading: boolean;
    LikeOutlineIcon?: IconType;
    DislikeOutlineIcon?: IconType;
    LikeFillIcon?: IconType;
    DislikeFillIcon?: IconType;
};

const LeftSidebar: React.FC<LeftSidebarProps> = ({
    handleLike,
    userVote,
    dislikeLoading,
    likeLoading,
    LikeOutlineIcon = AiOutlineLike,
    LikeFillIcon = AiFillLike,
    DislikeOutlineIcon = AiOutlineDislike,
    DislikeFillIcon = AiFillDislike,
}) => {
    return (
        <VStack position="sticky" top={24} mr={4} spacing={4}>
            <IconButton
                aria-label="like-button"
                icon={
                    userVote === 1 ? (
                        <LikeFillIcon fontSize={30} />
                    ) : (
                        <LikeOutlineIcon fontSize={30} />
                    )
                }
                color={userVote === 1 ? "brand.100" : "gray.700"}
                variant="ghost"
                borderRadius="full"
                size="lg"
                onClick={() => handleLike(1)}
                isDisabled={dislikeLoading}
                isLoading={likeLoading}
            />
            <IconButton
                aria-label="like-button"
                icon={
                    userVote === -1 ? (
                        <DislikeFillIcon fontSize={30} />
                    ) : (
                        <DislikeOutlineIcon fontSize={30} />
                    )
                }
                color={userVote === -1 ? "brand.100" : "gray.700"}
                variant="ghost"
                borderRadius="full"
                size="lg"
                onClick={() => handleLike(-1)}
                isDisabled={likeLoading}
                isLoading={dislikeLoading}
            />
        </VStack>
    );
};
export default LeftSidebar;
