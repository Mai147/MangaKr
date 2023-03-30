import { Character, CharacterSnippet } from "@/models/Character";

let CharacterUtils = {};

const toCharacterSnippet = (character: Character): CharacterSnippet => {
    return {
        id: character.id,
        name: character.name,
        imageUrl: character.imageUrl,
        role: character.role,
        bio: character.bio,
    };
};

export default CharacterUtils = {
    toCharacterSnippet,
};
