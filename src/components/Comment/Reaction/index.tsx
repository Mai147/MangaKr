import { Flex, Icon, Text } from "@chakra-ui/react";
import React from "react";
import { IconType } from "react-icons";

type CommentReactionProps = {
    icon: IconType;
    value: number;
};

const CommentReaction: React.FC<CommentReactionProps> = ({ icon, value }) => {
    return value > 0 ? (
        <Flex
            align="center"
            px={2}
            bg="gray.100"
            borderRadius={6}
            boxShadow="inner"
        >
            <Icon as={icon} fontSize={14} mr={"4px"} />
            <Text fontSize={14}>{value}</Text>
        </Flex>
    ) : (
        <></>
    );
};
export default CommentReaction;
