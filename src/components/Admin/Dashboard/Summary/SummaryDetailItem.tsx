import { Box, Flex, Icon, Text } from "@chakra-ui/react";
import React from "react";
import { IconType } from "react-icons";

type SummaryDetailItemProps = {
    title: string;
    icon: IconType;
    color: string;
    data: number;
};

const SummaryDetailItem: React.FC<SummaryDetailItemProps> = ({
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
            boxShadow="md"
            bg="white"
            align="center"
            justify="space-between"
            w="100%"
        >
            <Box>
                <Text fontWeight={600} color="gray.500">
                    {title}
                </Text>
                <Text
                    fontWeight={600}
                    fontSize={20}
                    color={data > 0 ? "green.300" : "black"}
                >
                    {data}
                </Text>
            </Box>
            <Flex
                w={12}
                h={12}
                bg={color}
                borderRadius={8}
                align="center"
                justify="center"
            >
                <Icon as={icon} fontSize={24} />
            </Flex>
        </Flex>
    );
};
export default SummaryDetailItem;
