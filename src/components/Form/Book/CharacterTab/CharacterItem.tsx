import useBookCreate from "@/hooks/useBookCreate";
import { Character } from "@/models/Character";
import {
    Flex,
    VStack,
    AspectRatio,
    Image,
    Text,
    IconButton,
} from "@chakra-ui/react";
import React from "react";
import { FaTimes } from "react-icons/fa";

type CharacterItemProps = {
    character: Character;
};

const CharacterItem: React.FC<CharacterItemProps> = ({ character }) => {
    const { handleDeleteCharacter } = useBookCreate();
    return (
        <Flex
            w="100%"
            border="1px solid"
            borderColor="gray.300"
            p={4}
            borderRadius={4}
            mb={6}
            position="relative"
        >
            <Flex justify="center" flexShrink={0}>
                <VStack spacing={4} mr={8} top={4} align="stretch">
                    <AspectRatio w="150px" ratio={3 / 4}>
                        <Image
                            src={character.imageUrl || "/images/noImage.jpg"}
                        />
                    </AspectRatio>
                </VStack>
            </Flex>
            <VStack spacing={2} flexGrow={1} align="flex-start">
                <Flex align="center">
                    <Text fontSize={18} fontWeight={500}>
                        {character.name}
                    </Text>
                    <Text mx={2}>-</Text>
                    <Text fontSize={14} fontWeight={500} color="gray.400">
                        {character.role || "Chưa có vai trò"}
                    </Text>
                </Flex>
                <div
                    dangerouslySetInnerHTML={{ __html: character.bio || "" }}
                    className="ck ck-content"
                ></div>
            </VStack>
            <IconButton
                position="absolute"
                top={-4}
                right={-4}
                size="md"
                aria-label="Delete button"
                bg="brand.400"
                borderRadius="full"
                icon={<FaTimes />}
                _hover={{ bg: "brand.100" }}
                transition="all 0.3s"
                onClick={() => handleDeleteCharacter(character.id!)}
            />
        </Flex>
    );
};
export default CharacterItem;
