import { firebaseRoute } from "@/constants/firebaseRoutes";
import { fireStore, storage } from "@/firebase/clientApp";
import { Author, AuthorSnippet } from "@/models/Author";
import AuthorUtils from "@/utils/AuthorUtils";
import FileUtils from "@/utils/FileUtils";
import { triGram } from "@/utils/StringUtils";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    serverTimestamp,
    Timestamp,
    where,
    writeBatch,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";

class AuthorService {
    static getAll = async ({
        userId,
        isSnippet = false,
    }: {
        userId?: string;
        isSnippet?: boolean;
    }) => {
        const authorDocsRef = collection(
            fireStore,
            firebaseRoute.getAllAuthorRoute()
        );
        const authorConstraints = [];
        if (userId) {
            authorConstraints.push(where("creatorId", "==", userId));
        }
        const authorQuery = query(authorDocsRef, ...authorConstraints);
        const authorDocs = await getDocs(authorQuery);
        const authors = AuthorUtils.fromDocs(authorDocs.docs, isSnippet);
        return authors;
    };
    static get = async ({
        authorId,
        isSnippet = false,
    }: {
        authorId: string;
        isSnippet?: boolean;
    }): Promise<Author | AuthorSnippet | undefined> => {
        const authorDocRef = doc(
            fireStore,
            firebaseRoute.getAllAuthorRoute(),
            authorId
        );
        const authorDoc = await getDoc(authorDocRef);
        if (authorDoc.exists()) {
            const author = AuthorUtils.fromDoc(authorDoc, isSnippet);
            return author;
        }
    };
    static create = async ({ authorForm }: { authorForm: Author }) => {
        try {
            const batch = writeBatch(fireStore);
            const authorsDocRef = doc(
                collection(fireStore, firebaseRoute.getAllAuthorRoute())
            );
            const authorImageUrl = await FileUtils.uploadFile({
                imageRoute: firebaseRoute.getAuthorImageRoute(authorsDocRef.id),
                imageUrl: authorForm.imageUrl,
            });
            const trigramName = triGram(authorForm.name);
            batch.set(authorsDocRef, {
                ...authorForm,
                trigramName: trigramName.obj,
                createdAt: serverTimestamp() as Timestamp,
            });
            if (authorImageUrl) {
                batch.update(authorsDocRef, {
                    imageUrl: authorImageUrl,
                });
            }
            await batch.commit();
            return authorsDocRef.id;
        } catch (error: any) {
            console.log(error);
        }
    };
    static update = async ({
        author,
        authorForm,
    }: {
        authorForm: Author;
        author: Author;
    }) => {
        try {
            const batch = writeBatch(fireStore);
            const authorDocRef = doc(
                fireStore,
                firebaseRoute.getAllAuthorRoute(),
                author.id!
            );
            let authorImageUrl;
            if (
                authorForm.imageUrl &&
                authorForm.imageUrl !== author?.imageUrl
            ) {
                authorImageUrl = await FileUtils.uploadFile({
                    imageRoute: firebaseRoute.getAuthorImageRoute(author?.id!),
                    imageUrl: authorForm.imageUrl,
                });
            } else if (!authorForm.imageUrl && author?.imageUrl) {
                const imageRef = ref(
                    storage,
                    firebaseRoute.getAuthorImageRoute(author.id!)
                );
                await deleteObject(imageRef);
            }
            const trigramName = triGram(authorForm.name);
            batch.update(authorDocRef, {
                ...authorForm,
                trigramName: trigramName.obj,
            });
            // Update image
            if (authorForm.imageUrl !== author?.imageUrl) {
                batch.update(
                    doc(
                        fireStore,
                        firebaseRoute.getAllAuthorRoute(),
                        author?.id!
                    ),
                    {
                        imageUrl: authorImageUrl,
                    }
                );
            }
            await batch.commit();
        } catch (error) {
            console.log(error);
        }
    };
    static delete = async ({ author }: { author: Author }) => {
        try {
            const authorBookDocsRef = collection(
                fireStore,
                firebaseRoute.getAllBookRoute()
            );
            const authorBookQuery = query(
                authorBookDocsRef,
                where("authorIds", "array-contains", author.id)
            );
            const authorDocs = await getDocs(authorBookQuery);
            if (authorDocs.docs.length > 0) {
                return false;
            } else {
                const batch = writeBatch(fireStore);
                // Delete image
                if (author.imageUrl) {
                    const imageRef = ref(
                        storage,
                        firebaseRoute.getAuthorImageRoute(author.id!)
                    );
                    await deleteObject(imageRef);
                }
                const authorDocRef = doc(
                    collection(fireStore, firebaseRoute.getAllAuthorRoute()),
                    author.id
                );
                batch.delete(authorDocRef);
                await batch.commit();
                return true;
            }
        } catch (error) {
            console.log(error);
        }
    };
}

export default AuthorService;
