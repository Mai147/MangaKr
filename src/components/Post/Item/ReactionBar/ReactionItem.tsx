import { PostVote } from "@/models/Vote";
import { Flex, Icon, Spinner } from "@chakra-ui/react";
import React from "react";
import { IconType } from "react-icons";

type ReactionItemProps = {
    icon: IconType;
    color: string;
    isActive?: boolean;
    value: PostVote;
    onClick?: (value: PostVote) => Promise<void>;
    isLoading?: boolean;
    isDisabled?: boolean;
};

const ReactionItem: React.FC<ReactionItemProps> = ({
    color,
    icon,
    isActive = false,
    onClick,
    value,
    isLoading = false,
    isDisabled = false,
}) => {
    return (
        <Flex
            bg={isActive ? "rgba(255, 40, 20, 0.2)" : "transparent"}
            align="center"
            justify="center"
            p={isActive ? 2 : 0}
            rounded="full"
        >
            {isLoading ? (
                <Spinner />
            ) : (
                <Icon
                    as={icon}
                    color={color}
                    cursor="pointer"
                    _hover={{ transform: "scale(1.5)" }}
                    transition="all 0.3s"
                    onClick={() => {
                        !isDisabled && onClick && onClick(value);
                    }}
                />
            )}
        </Flex>
    );
};
export default ReactionItem;
