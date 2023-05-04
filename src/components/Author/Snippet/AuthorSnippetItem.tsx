import { Author } from "@/models/Author";
import { formatNumber } from "@/utils/StringUtils";
import {
    Avatar,
    Box,
    Flex,
    FlexProps,
    Icon,
    IconButton,
    Link,
    Text,
} from "@chakra-ui/react";
import React from "react";
import { FaTimes } from "react-icons/fa";
import { ImHeart, ImHeartBroken } from "react-icons/im";

interface AuthorSnippetItemProps extends FlexProps {
    author: Author;
    href?: string;
    onDelete?: (author: Author) => void;
}

const AuthorSnippetItem: React.FC<AuthorSnippetItemProps> = ({
    author,
    href,
    onDelete,
    ...rest
}) => {
    return (
        <Link href={href} _hover={{ textDecoration: "none" }}>
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
                bg="white"
                position="relative"
                _hover={{ bg: "gray.50" }}
                transition="all 0.5s"
            >
                <Box mb={2} w="100%">
                    <Avatar
                        src={author.imageUrl || "/images/noImage.jpg"}
                        size="xl"
                        mb={2}
                    />
                    <Text noOfLines={1} fontWeight={600}>
                        {author.name}
                    </Text>
                    <Text>---</Text>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: author.bio || "",
                        }}
                        style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            maxHeight: "80px",
                        }}
                        className="ck ck-content"
                    ></div>
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
                {onDelete && (
                    <IconButton
                        position="absolute"
                        top={2}
                        right={2}
                        size="xs"
                        aria-label="Delete button"
                        bg="brand.400"
                        borderRadius="full"
                        icon={<FaTimes />}
                        _hover={{ bg: "brand.100" }}
                        transition="all 0.3s"
                        onClick={(event) => {
                            event.stopPropagation();
                            event.nativeEvent.preventDefault();
                            onDelete(author);
                        }}
                    />
                )}
            </Flex>
        </Link>
    );
};
export default AuthorSnippetItem;
