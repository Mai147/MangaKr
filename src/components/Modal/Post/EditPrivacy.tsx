import Overlay from "@/components/Overlay";
import { PrivacyType, privacyList } from "@/constants/privacy";
import usePost from "@/hooks/usePost";
import { Post } from "@/models/Post";
import {
    Flex,
    Radio,
    RadioGroup,
    VStack,
    Text,
    Button,
    Box,
} from "@chakra-ui/react";
import React, { useState } from "react";

type PostEditPrivacyModalProps = {
    post: Post;
    onHidden: () => void;
};

const PostEditPrivacyModal: React.FC<PostEditPrivacyModalProps> = ({
    post,
    onHidden,
}) => {
    const { postAction } = usePost();
    const [privacy, setPrivacy] = useState<PrivacyType>(post.privacyType);
    const [loading, setLoading] = useState(false);
    return (
        <Overlay contentWidth="40%" onHidden={onHidden}>
            <Flex flexGrow={1} px={12} align="center" justify="center">
                <Box
                    border="1px solid"
                    borderColor="gray.300"
                    borderRadius={8}
                    boxShadow="rgba(0, 0, 0, 0.24) 0px 3px 8px"
                    bg="white"
                    w="100%"
                    overflow="auto"
                    maxH="calc(100vh - 36px)"
                    className="scroll dark"
                    cursor="default"
                    p={6}
                    onClick={(e) => e.stopPropagation()}
                >
                    <VStack>
                        <Text fontWeight={500} mb={2} fontSize={20}>
                            Chỉnh sửa chế độ hiển thị bài viết
                        </Text>
                        <RadioGroup
                            onChange={(value) =>
                                setPrivacy(value as PrivacyType)
                            }
                            value={privacy}
                            colorScheme="red"
                        >
                            <VStack align="flex-start">
                                {privacyList.map((item) => (
                                    <Flex key={item.value}>
                                        <Radio
                                            size="md"
                                            value={item.value}
                                            flexShrink={0}
                                        >
                                            {item.title}
                                        </Radio>
                                        <Text color="gray.400" ml={2}>
                                            {item.content}
                                        </Text>
                                    </Flex>
                                ))}
                            </VStack>
                        </RadioGroup>
                        <Button
                            w="28"
                            alignSelf="flex-end"
                            isLoading={loading}
                            onClick={async () => {
                                setLoading(true);
                                await postAction.handleSubmitPrivacy(
                                    post.id!,
                                    post.creatorId,
                                    privacy
                                );
                                setLoading(false);
                                onHidden();
                            }}
                        >
                            Lưu
                        </Button>
                    </VStack>
                </Box>
            </Flex>
        </Overlay>
    );
};
export default PostEditPrivacyModal;
