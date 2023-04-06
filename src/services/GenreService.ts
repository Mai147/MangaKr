import { firebaseRoute } from "@/constants/firebaseRoutes";
import { fireStore } from "@/firebase/clientApp";
import { Genre, GenreSnippet } from "@/models/Genre";
import GenreUtils from "@/utils/GenreUtils";
import { triGram } from "@/utils/StringUtils";
import {
    addDoc,
    collection,
    collectionGroup,
    doc,
    getDoc,
    getDocs,
    query,
    serverTimestamp,
    Timestamp,
    where,
    WriteBatch,
    writeBatch,
} from "firebase/firestore";

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
    static get = async ({
        genreId,
        isSnippet = false,
    }: {
        genreId: string;
        isSnippet?: boolean;
    }): Promise<Genre | GenreSnippet | undefined> => {
        const genreDocRef = doc(
            fireStore,
            firebaseRoute.getAllGenreRoute(),
            genreId
        );
        const genreDoc = await getDoc(genreDocRef);
        if (genreDoc.exists()) {
            const genre = GenreUtils.fromDoc(genreDoc, isSnippet);
            return genre;
        }
    };
    static create = async ({ genreForm }: { genreForm: Genre }) => {
        try {
            const genresDocRef = collection(
                fireStore,
                firebaseRoute.getAllGenreRoute()
            );
            const trigramName = triGram(genreForm.name);
            await addDoc(genresDocRef, {
                ...genreForm,
                trigramName: trigramName.obj,
                createdAt: serverTimestamp() as Timestamp,
            });
            return genresDocRef.id;
        } catch (error: any) {
            console.log(error);
        }
    };
    static update = async ({ genreForm }: { genreForm: Genre }) => {
        try {
            const batch = writeBatch(fireStore);
            const genreDocRef = doc(
                fireStore,
                firebaseRoute.getAllGenreRoute(),
                genreForm.id!
            );
            const trigramName = triGram(genreForm.name);
            batch.update(genreDocRef, {
                ...genreForm,
                trigramName: trigramName.obj,
            });
            await this.updateSnippet({
                batch,
                route: "genreSnippets",
                newValue: {
                    name: genreForm.name,
                },
                genreId: genreForm.id!,
            });
            await batch.commit();
        } catch (error) {
            console.log(error);
        }
    };
    static delete = async ({ genre }: { genre: Genre }) => {
        try {
            const genreBookDocsRef = collection(
                fireStore,
                firebaseRoute.getAllBookRoute()
            );
            const genreBookQuery = query(
                genreBookDocsRef,
                where("genreIds", "array-contains", genre.id)
            );
            const genreDocs = await getDocs(genreBookQuery);
            if (genreDocs.docs.length > 0) {
                return false;
            } else {
                const batch = writeBatch(fireStore);
                const genreDocRef = doc(
                    fireStore,
                    firebaseRoute.getAllGenreRoute(),
                    genre.id!
                );
                batch.delete(genreDocRef);
                await batch.commit();
                return true;
            }
        } catch (error) {
            console.log(error);
        }
    };
    private static updateSnippet = async ({
        batch,
        route,
        newValue,
        idField = "id",
        genreId,
    }: {
        batch: WriteBatch;
        route: string;
        newValue: {
            [x: string]: any;
        };
        idField?: string;
        genreId: string;
    }) => {
        const docsRef = collectionGroup(fireStore, route);
        const docsQuery = query(docsRef, where(idField, "==", genreId));
        const docs = await getDocs(docsQuery);
        docs.docs.forEach((doc) => {
            if (doc.exists()) {
                batch.update(doc.ref, newValue);
            }
        });
    };
}

export default GenreService;
