import { UserModel } from "@/models/User";
import { Flex, Input, Avatar, IconButton } from "@chakra-ui/react";
import React, { useState } from "react";
import { AiOutlineSend } from "react-icons/ai";

type CommentInputBasicProps = {
    onSubmit: (commentText: string) => Promise<void>;
    loading: boolean;
    user?: UserModel;
    placeholder?: string;
};

const CommentInputBasic: React.FC<CommentInputBasicProps> = ({
    onSubmit,
    loading,
    user,
    placeholder,
}) => {
    const [commentText, setCommentText] = useState("");

    return (
        <form
            onSubmit={async (e) => {
                e.preventDefault();
                await onSubmit(commentText);
                setCommentText("");
            }}
        >
            <Flex w="100%" position="relative">
                <Input
                    autoFocus
                    flexGrow={1}
                    bg="white"
                    px={12}
                    borderRadius="100"
                    boxShadow="rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px"
                    value={commentText}
                    placeholder={placeholder || "Để lại bình luận..."}
                    onChange={(e) => setCommentText(e.target.value)}
                />
                <Avatar
                    src={user?.photoURL || "/images/noImage.jpg"}
                    size="sm"
                    position="absolute"
                    top={1}
                    left={1}
                    zIndex={10}
                />
                <IconButton
                    aria-label="Send button"
                    variant="ghost"
                    type="submit"
                    icon={<AiOutlineSend />}
                    position="absolute"
                    fontSize={20}
                    color="gray.500"
                    top={0}
                    right={0}
                    zIndex={10}
                    isLoading={loading}
                />
            </Flex>
        </form>
    );
};
export default CommentInputBasic;
