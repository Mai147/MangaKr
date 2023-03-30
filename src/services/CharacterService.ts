import { firebaseRoute } from "@/constants/firebaseRoutes";
import { fireStore, storage } from "@/firebase/clientApp";
import { Character } from "@/models/Character";
import CharacterUtils from "@/utils/CharacterUtils";
import { doc, collection, writeBatch } from "firebase/firestore";
import {
    ref,
    uploadString,
    getDownloadURL,
    deleteObject,
} from "firebase/storage";

class CharacterService {
    static create = async ({
        character,
        bookId,
    }: {
        character: Character;
        bookId: string;
    }) => {
        try {
            const batch = writeBatch(fireStore);
            // Upload image
            const characterDocRef = doc(
                collection(fireStore, firebaseRoute.getAllCharacterRoute())
            );
            let charImage;
            if (character.imageUrl) {
                const imageRef = ref(
                    storage,
                    firebaseRoute.getCharacterImageRoute(characterDocRef.id)
                );
                await uploadString(imageRef, character.imageUrl, "data_url");
                charImage = await getDownloadURL(imageRef);
            }

            const { id, ...info } = character;
            batch.set(characterDocRef, {
                ...info,
                id: characterDocRef.id,
                bookId,
                imageUrl: charImage,
            });
            const characterSnippetRef = doc(
                collection(
                    fireStore,
                    firebaseRoute.getBookCharacterSnippetRoute(bookId)
                ),
                characterDocRef.id
            );
            batch.set(characterSnippetRef, {
                ...CharacterUtils.toCharacterSnippet(character),
                id: characterDocRef.id,
                imageUrl: charImage,
            });
            await batch.commit();
            return characterDocRef.id;
        } catch (error) {
            console.log(error);
        }
    };
    static update = async ({
        character,
        oldCharacter,
        bookId,
    }: {
        character: Character;
        oldCharacter: Character;
        bookId: string;
    }) => {
        try {
            const batch = writeBatch(fireStore);
            // Change image
            let charImage;
            if (character.imageUrl !== oldCharacter?.imageUrl) {
                const imageRef = ref(
                    storage,
                    firebaseRoute.getCharacterImageRoute(character.id!)
                );
                if (character.imageUrl) {
                    await uploadString(
                        imageRef,
                        character.imageUrl,
                        "data_url"
                    );
                    charImage = await getDownloadURL(imageRef);
                } else {
                    await deleteObject(imageRef);
                }
            }
            // Update character
            const characterDocRef = doc(
                fireStore,
                firebaseRoute.getAllCharacterRoute(),
                character.id!
            );
            batch.update(characterDocRef, { ...character });
            // Insert snippet
            const characterSnippetDocRef = doc(
                fireStore,
                firebaseRoute.getBookCharacterSnippetRoute(bookId),
                character.id!
            );
            batch.update(characterSnippetDocRef, {
                ...CharacterUtils.toCharacterSnippet(character),
            });
            await batch.commit();
            return characterDocRef.id;
        } catch (error) {
            console.log(error);
        }
    };
    static delete = async ({ id, bookId }: { id: string; bookId: string }) => {
        try {
            const batch = writeBatch(fireStore);
            // Delete image
            const imageRef = ref(
                storage,
                firebaseRoute.getCharacterImageRoute(id)
            );
            await deleteObject(imageRef);
            // Delete character
            const characterDocRef = doc(
                fireStore,
                firebaseRoute.getAllCharacterRoute(),
                id
            );
            batch.delete(characterDocRef);
            // Delete Book Character snippet
            const bookCharacterSnippetDocRef = doc(
                fireStore,
                firebaseRoute.getBookCharacterSnippetRoute(bookId),
                id
            );
            batch.delete(bookCharacterSnippetDocRef);
            await batch.commit();
        } catch (error) {
            console.log(error);
        }
    };
}

export default CharacterService;
