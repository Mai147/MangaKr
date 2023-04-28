import useBookCreate from "@/hooks/useBookCreate";
import { Button, Icon, VStack } from "@chakra-ui/react";
import React, { useState } from "react";
import { BiPlus } from "react-icons/bi";
import CharacterInput from "./CharacterInput";
import CharacterItem from "./CharacterItem";

type BookFormCharacterTabProps = {};

const BookFormCharacterTab: React.FC<BookFormCharacterTabProps> = ({}) => {
    const { characters, isOpenAddCharacter, openAddCharacter } =
        useBookCreate();
    return (
        <VStack spacing={2} align="flex-start" w="100%">
            {characters.map((char, idx) => (
                <CharacterItem key={char.id || idx} character={char} />
            ))}
            {isOpenAddCharacter && <CharacterInput />}
            {!isOpenAddCharacter && (
                <Button variant="outline" onClick={openAddCharacter}>
                    <Icon as={BiPlus} mr={1} fontSize={20} />
                    Thêm nhân vật mới
                </Button>
            )}
        </VStack>
    );
};
export default BookFormCharacterTab;
