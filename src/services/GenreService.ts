import { firebaseRoute } from "@/constants/firebaseRoutes";
import { fireStore } from "@/firebase/clientApp";
import { Genre } from "@/models/Genre";
import GenreUtils from "@/utils/GenreUtils";
import { addDoc, collection, getDocs } from "firebase/firestore";

class GenreService {
    static getAll = async ({ isSnippet = false }: { isSnippet?: boolean }) => {
        const genresDocRef = collection(
            fireStore,
            firebaseRoute.getAllGenreRoute()
        );
        const genresDocs = await getDocs(genresDocRef);
        const genres = GenreUtils.fromDocs(genresDocs.docs, isSnippet);
        return genres;
    };
    static create = async ({ genreForm }: { genreForm: Genre }) => {
        try {
            const genresDocRef = collection(
                fireStore,
                firebaseRoute.getAllGenreRoute()
            );
            await addDoc(genresDocRef, genreForm);
            return genresDocRef.id;
        } catch (error: any) {
            console.log(error);
        }
    };
}

export default GenreService;
