import { CharacterSnippet } from "@/models/Character";
import {
    AspectRatio,
    Box,
    Flex,
    Image,
    Link,
    Text,
    VStack,
} from "@chakra-ui/react";
import React from "react";

type CharacterSnippetItemProps = {
    character: CharacterSnippet;
    href?: string;
};

const CharacterSnippetItem: React.FC<CharacterSnippetItemProps> = ({
    character,
    href,
}) => {
    return (
        <Link _hover={{ textDecoration: "none" }} href={href}>
            <VStack
                border="1px solid"
                borderColor="gray.400"
                bg="white"
                p={2}
                borderRadius={4}
                direction="column"
                align="center"
                spacing={2}
                _hover={{ bg: "gray.50" }}
                transition="all 0.5s"
            >
                <AspectRatio ratio={1} w="100%">
                    <Image
                        src={character.imageUrl || "/images/noImage.jpg"}
                        objectFit="cover"
                        borderRadius={4}
                    />
                </AspectRatio>
                <Flex direction="column" align="center" wordBreak="break-word">
                    <Text fontWeight={600} noOfLines={1} lineHeight={1}>
                        {character.name}
                    </Text>
                    <Text noOfLines={1} color="gray.400">
                        {character.role}
                    </Text>
                </Flex>
            </VStack>
        </Link>
    );
};
export default CharacterSnippetItem;
