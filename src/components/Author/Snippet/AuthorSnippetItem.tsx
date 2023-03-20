import { AUTHOR_PAGE, BOOK_PAGE } from "@/constants/routes";
import { Author } from "@/models/Author";
import { formatNumber } from "@/utils/StringUtils";
import {
    Avatar,
    Box,
    Flex,
    FlexProps,
    Icon,
    Link,
    Text,
    VStack,
} from "@chakra-ui/react";
import React from "react";
import {
    AiFillDislike,
    AiFillLike,
    AiOutlineDislike,
    AiOutlineLike,
} from "react-icons/ai";
import { ImHeart, ImHeartBroken } from "react-icons/im";

interface AuthorSnippetItemProps extends FlexProps {
    author: Author;
}

const AuthorSnippetItem: React.FC<AuthorSnippetItemProps> = ({
    author,
    ...rest
}) => {
    return (
        <Link
            href={`${AUTHOR_PAGE}/${author.id}`}
            _hover={{ textDecoration: "none" }}
        >
            <Flex
                {...rest}
                direction="column"
                align="center"
                textAlign="center"
                justify="space-between"
                w="100%"
                p={4}
                boxShadow="rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset"
                borderRadius={4}
                _hover={{ bg: "gray.50" }}
                transition="all 0.5s"
            >
                <Box mb={2}>
                    <Avatar
                        src={author.imageUrl || "/images/noImage.jpg"}
                        size="xl"
                        mb={2}
                    />
                    <Text noOfLines={1} fontWeight={600}>
                        {author.name}
                    </Text>
                    <Text noOfLines={2} fontSize={14} color="gray.400">
                        {author.bio}
                    </Text>
                </Box>

                <Flex
                    align="center"
                    justify="space-around"
                    w="100%"
                    fontSize={18}
                    color="gray.500"
                >
                    <Flex align="center">
                        <Icon as={ImHeart} color="brand.100" mr={1} />
                        {formatNumber(author.numberOfLikes)}
                    </Flex>
                    <Flex align="center">
                        <Icon as={ImHeartBroken} color="gray.700" mr={1} />
                        {formatNumber(author.numberOfDislikes)}
                    </Flex>
                </Flex>
            </Flex>
        </Link>
    );
};
export default AuthorSnippetItem;
