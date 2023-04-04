import { routes } from "@/constants/routes";
import { Author } from "@/models/Author";
import {
    Avatar,
    Box,
    Flex,
    FlexProps,
    Link,
    Text,
    VStack,
} from "@chakra-ui/react";
import React from "react";

interface AuthorSnippetHorizontalItemProps extends FlexProps {
    author: Author;
}

const AuthorSnippetHorizontalItem: React.FC<
    AuthorSnippetHorizontalItemProps
> = ({ author, ...rest }) => {
    return (
        <Link
            href={routes.getAuthorDetailPage(author.id!)}
            _hover={{ textDecoration: "none" }}
        >
            <Box
                {...rest}
                p={4}
                border="1px solid"
                borderColor="gray.200"
                borderRadius={4}
                bg="white"
                _hover={{ bg: "gray.50" }}
                transition="all 0.5s"
            >
                <Flex>
                    <Avatar
                        src={author.imageUrl || "/images/noImage.jpg"}
                        size="lg"
                    />
                    <VStack align="flex-start" ml={8}>
                        <Text noOfLines={1} fontWeight={600}>
                            {author.name}
                        </Text>
                        <Text noOfLines={2} fontSize={14} color="gray.400">
                            {author.bio}
                        </Text>
                    </VStack>
                </Flex>
            </Box>
        </Link>
    );
};
export default AuthorSnippetHorizontalItem;
