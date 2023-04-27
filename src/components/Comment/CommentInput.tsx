import { UserModel } from "@/models/User";
import { Flex, Textarea, Button, Text } from "@chakra-ui/react";
import React, { useRef } from "react";

type CommentInputProps = {
    commentText: string;
    setCommentText: (value: string) => void;
    user?: UserModel | null;
    createLoading: boolean;
    onCreateComment: (commentText: string) => void;
};

const CommentInputs: React.FC<CommentInputProps> = ({
    commentText,
    createLoading,
    onCreateComment,
    setCommentText,
    user,
}) => {
    const formRef = useRef<HTMLFormElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onCreateComment(commentText);
                setCommentText("");
            }}
            ref={formRef}
        >
            <Flex direction="column" position="relative">
                {user ? (
                    <>
                        <Text mb={1}>
                            Bình luận dưới tên{" "}
                            <span style={{ color: "#3182CE" }}>
                                {user.displayName}
                            </span>
                        </Text>
                        <Textarea
                            ref={inputRef}
                            value={commentText}
                            onChange={(event) =>
                                setCommentText(event.target.value)
                            }
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    inputRef.current?.blur();
                                    formRef.current?.dispatchEvent(
                                        new Event("submit", {
                                            cancelable: true,
                                            bubbles: true,
                                        })
                                    );
                                    setCommentText("");
                                }
                            }}
                            placeholder="Để lại bình luận..."
                            fontSize="10pt"
                            borderRadius={4}
                            minHeight="160px"
                            pb={10}
                            _placeholder={{ color: "gray.500" }}
                            _focus={{
                                bg: "white",
                            }}
                            resize="none"
                        />
                        <Flex
                            position="absolute"
                            left="1px"
                            right={0.1}
                            bottom="1px"
                            justify="flex-end"
                            bg="gray.100"
                            p="6px 8px"
                            borderRadius="0px 0px 4px 4px"
                        >
                            <Button
                                height="26px"
                                isDisabled={!commentText.length}
                                isLoading={createLoading}
                                type="submit"
                            >
                                Bình luận
                            </Button>
                        </Flex>
                    </>
                ) : (
                    <Flex
                        align="center"
                        justify="space-between"
                        borderRadius={2}
                        border="1px solid"
                        borderColor="gray.100"
                        p={4}
                    >
                        <Text fontWeight={600}>
                            Bạn cần đăng nhập để có thể bình luận
                        </Text>
                    </Flex>
                )}
            </Flex>
        </form>
    );
};
export default CommentInputs;
