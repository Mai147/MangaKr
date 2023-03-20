import { Comment } from "@/models/Comment";
import {
    Avatar,
    Box,
    Flex,
    Icon,
    Spinner,
    Stack,
    Text,
} from "@chakra-ui/react";
import moment from "moment";
import "moment/locale/vi";
import React from "react";
import {
    IoArrowUpCircleOutline,
    IoArrowDownCircleOutline,
} from "react-icons/io5";

type CommentItemProps = {
    comment: Comment;
    onDeleteComment: (comment: Comment) => void;
    loadingDelete: boolean;
    userId: string;
};

const CommentItem: React.FC<CommentItemProps> = ({
    comment,
    loadingDelete,
    onDeleteComment,
    userId,
}) => {
    return (
        <Flex py={2}>
            <Box mr={2}>
                <Avatar
                    size={"sm"}
                    src={comment.creatorImageUrl || ""}
                    referrerPolicy="no-referrer"
                />
            </Box>
            <Stack spacing={1}>
                <Stack
                    direction="row"
                    align="center"
                    spacing={2}
                    fontSize="8pt"
                >
                    <Text
                        fontWeight={700}
                        _hover={{
                            textDecoration: "underline",
                            cursor: "pointer",
                        }}
                    >
                        {comment.creatorDisplayName}
                    </Text>
                    {comment.createdAt?.seconds && (
                        <Text color="gray.600">
                            {moment(new Date(comment.createdAt?.seconds * 1000))
                                .locale("vi")
                                .fromNow()}
                        </Text>
                    )}
                    {loadingDelete && <Spinner size="sm" />}
                </Stack>
                <Text fontSize="10pt">{comment.text}</Text>
                <Stack
                    direction="row"
                    align="center"
                    cursor="pointer"
                    fontWeight={600}
                    color="gray.500"
                >
                    <Icon as={IoArrowUpCircleOutline} />
                    <Icon as={IoArrowDownCircleOutline} />
                    {userId === comment.creatorId && (
                        <>
                            {/* <Text fontSize="9pt" _hover={{ color: "blue.500" }}>
                                Edit
                            </Text> */}
                            <Text
                                fontSize="9pt"
                                _hover={{ color: "blue.500" }}
                                onClick={() => onDeleteComment(comment)}
                            >
                                Xóa
                            </Text>
                        </>
                    )}
                </Stack>
            </Stack>
        </Flex>
    );
};
export default CommentItem;
