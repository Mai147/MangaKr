import { AspectRatio, Box, Flex, Image, Text } from "@chakra-ui/react";
import React from "react";

type TopItemProps = {
    title: string;
    name: string;
    data: number;
    imageUrl?: string;
    subTitle: string;
};

const TopItem: React.FC<TopItemProps> = ({
    data,
    name,
    title,
    imageUrl,
    subTitle,
}) => {
    return (
        <Flex
            p={6}
            borderRadius={8}
            bg="white"
            boxShadow="md"
            direction="column"
            align="center"
            textAlign="center"
        >
            <Box flexGrow={1}>
                <Text fontSize={18} fontWeight={600}>
                    {title}
                </Text>
            </Box>
            <Box>
                <Text color="brand.100" noOfLines={3}>
                    {name}
                </Text>
                <Text fontSize={18} fontWeight={600} color="blue.300">
                    {data} {subTitle}
                </Text>
            </Box>
            <AspectRatio ratio={1} w="70%" mt={2} flexShrink={0}>
                <Image
                    src={imageUrl || "/images/noImage.jpg"}
                    w="100%"
                    borderRadius={8}
                />
            </AspectRatio>
        </Flex>
    );
};
export default TopItem;
