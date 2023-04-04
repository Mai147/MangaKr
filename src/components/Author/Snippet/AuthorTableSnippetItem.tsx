import { authorHeaderList } from "@/components/Writer/WriterEditBox";
import { routes } from "@/constants/routes";
import { Author } from "@/models/Author";
import {
    Avatar,
    Box,
    Flex,
    HStack,
    IconButton,
    Link,
    Text,
} from "@chakra-ui/react";
import React from "react";
import { AiOutlineEdit } from "react-icons/ai";
import { MdOutlineClear } from "react-icons/md";

type AuthorTableSnippetItemProps = {
    author: Author;
    onDelete: (author: Author) => void;
};

const AuthorTableSnippetItem: React.FC<AuthorTableSnippetItemProps> = ({
    author,
    onDelete,
}) => {
    return (
        <Flex
            justify="space-between"
            align="center"
            w="100%"
            p={4}
            _hover={{ bg: "gray.50" }}
            transition="all 0.3s"
        >
            <HStack spacing={4} flexGrow={1}>
                <Text w={authorHeaderList[0].width} flexShrink={0}>
                    {author.creatorDisplayName}
                </Text>
                <Box w={authorHeaderList[1].width} flexShrink={0}>
                    <Avatar src={author.imageUrl || "/images/noImage.jpg"} />
                </Box>
                <Text w={authorHeaderList[2].width} flexShrink={0}>
                    {author.name}
                </Text>
                <Text
                    w={authorHeaderList[3].width}
                    whiteSpace="pre-line"
                    noOfLines={3}
                >
                    {author.bio || "-----"}
                </Text>
            </HStack>
            <HStack ml={10} spacing={4}>
                <Link href={routes.getAuthorEditPage(author.id!)}>
                    <IconButton
                        bgColor="green.300"
                        aria-label="Edit"
                        _hover={{ bgColor: "green.400" }}
                        icon={<AiOutlineEdit />}
                        fontSize={16}
                    />
                </Link>
                <IconButton
                    aria-label="Delete"
                    icon={<MdOutlineClear />}
                    fontSize={16}
                    onClick={() => onDelete(author)}
                />
            </HStack>
        </Flex>
    );
};
export default AuthorTableSnippetItem;
