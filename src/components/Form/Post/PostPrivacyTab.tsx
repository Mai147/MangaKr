import { privacyList, PrivacyType } from "@/constants/privacy";
import { Box, Flex, Radio, RadioGroup, Text, VStack } from "@chakra-ui/react";
import React from "react";

type PostPrivacyTabProps = {
    privacy: PrivacyType;
    setPrivacy: (value: PrivacyType) => void;
};

const PostPrivacyTab: React.FC<PostPrivacyTabProps> = ({
    privacy,
    setPrivacy,
}) => {
    return (
        <Box>
            <Text fontWeight={500} mb={2}>
                Hiển thị bài viết
            </Text>
            <RadioGroup
                onChange={(value) => setPrivacy(value as PrivacyType)}
                value={privacy}
                colorScheme="red"
            >
                <VStack align="flex-start">
                    {privacyList.map((item) => (
                        <Flex key={item.value} align="center">
                            <Radio
                                size={{ base: "md", md: "lg" }}
                                value={item.value}
                            >
                                {item.title}
                            </Radio>
                            <Text
                                color="gray.400"
                                ml={{ base: 1, md: 2 }}
                                fontSize={{ base: 14, md: 16 }}
                            >
                                {item.content}
                            </Text>
                        </Flex>
                    ))}
                </VStack>
            </RadioGroup>
        </Box>
    );
};
export default PostPrivacyTab;
