import {
    authorHeaderList,
    genreHeaderList,
} from "@/components/Writer/WriterEditBox";
import { routes } from "@/constants/routes";
import { Author } from "@/models/Author";
import { Genre } from "@/models/Genre";
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

type GenreTableSnippetItemProps = {
    genre: Genre;
    onDelete: (genre: Genre) => void;
};

const GenreTableSnippetItem: React.FC<GenreTableSnippetItemProps> = ({
    genre,
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
                <Text w={genreHeaderList[0].width} flexShrink={0}>
                    {genre.creatorDisplayName}
                </Text>
                <Text w={genreHeaderList[1].width} flexShrink={0}>
                    {genre.name}
                </Text>
                <Text
                    w={authorHeaderList[2].width}
                    whiteSpace="pre-line"
                    noOfLines={3}
                >
                    {genre.description || "-----"}
                </Text>
            </HStack>
            <HStack ml={10} spacing={4}>
                <Link href={routes.getGenreEditPage(genre.id!)}>
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
                    onClick={() => onDelete(genre)}
                />
            </HStack>
        </Flex>
    );
};
export default GenreTableSnippetItem;
