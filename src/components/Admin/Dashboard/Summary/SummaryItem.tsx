import { AspectRatio, Box, Flex, Icon, Text } from "@chakra-ui/react";
import React from "react";
import { IconType } from "react-icons";

type SummaryItemProps = {
    title: string;
    icon: IconType;
    color: string;
    data: number;
};

const SummaryItem: React.FC<SummaryItemProps> = ({
    color,
    icon,
    title,
    data,
}) => {
    return (
        <Flex
            px={4}
            py={2}
            borderRadius={8}
            bg={color}
            align="center"
            justify="space-between"
            w="100%"
        >
            <Flex align="center">
                <Icon as={icon} mr={1} />
                <Text fontWeight={600}>{title}</Text>
            </Flex>
            <Box py={2} px={4} borderRadius={8} bg="white" fontWeight={600}>
                {data}
            </Box>
        </Flex>
    );
};
export default SummaryItem;
