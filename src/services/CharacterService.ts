import { firebaseRoute } from "@/constants/firebaseRoutes";
import { fireStore, storage } from "@/firebase/clientApp";
import { Character } from "@/models/Character";
import CharacterUtils from "@/utils/CharacterUtils";
import FileUtils from "@/utils/FileUtils";
import { doc, collection, writeBatch, getDoc } from "firebase/firestore";
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
            let charImageUrl;
            let charImageRef;
            if (character.imageUrl) {
                const res = await FileUtils.uploadFile({
                    imageRoute: firebaseRoute.getCharacterImageRoute(
                        characterDocRef.id!
                    ),
                    imageUrl: character.imageUrl,
                });
                charImageUrl = res?.downloadUrl;
                charImageRef = res?.downloadRef;
            }

            const { id, ...info } = character;
            batch.set(characterDocRef, {
                ...info,
                id: characterDocRef.id,
                bookId,
                imageUrl: charImageUrl,
                imageRef: charImageRef,
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
                imageUrl: charImageUrl,
                imageRef: charImageRef,
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
            if (character.imageUrl !== oldCharacter?.imageUrl) {
                if (character.imageUrl) {
                    const res = await FileUtils.uploadFile({
                        imageRoute: firebaseRoute.getCharacterImageRoute(
                            character.id!
                        ),
                        imageUrl: character.imageUrl,
                    });
                }
                if (oldCharacter.imageRef) {
                    await deleteObject(ref(storage, oldCharacter.imageRef));
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
            const characterDocRef = doc(
                fireStore,
                firebaseRoute.getAllCharacterRoute(),
                id
            );
            // Delete image
            const characterDoc = await getDoc(characterDocRef);
            if (characterDoc.exists()) {
                const { imageRef } = characterDoc.data();
                if (imageRef) {
                    await deleteObject(imageRef);
                }
            }
            // Delete character
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
