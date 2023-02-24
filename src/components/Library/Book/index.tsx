import BookLibraryCarousel from "@/components/Book/Snippet/BookLibraryCarousel";
import ConfirmModal from "@/components/Modal/ConfirmModal";
import { firebaseRoute } from "@/constants/firebaseRoutes";
import { BOOK_PAGE, getEditBookPage } from "@/constants/routes";
import { fireStore, storage } from "@/firebase/clientApp";
import useAuth from "@/hooks/useAuth";
import useModal from "@/hooks/useModal";
import { Book } from "@/models/Book";
import { Divider, Box, Flex, Spinner, useToast } from "@chakra-ui/react";
import {
    collection,
    getDocs,
    getDoc,
    doc,
    writeBatch,
    increment,
} from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import React, { useEffect, useState } from "react";
import LibrarySection from "../Section";

type LibraryBookProps = {};

const LibraryBook: React.FC<LibraryBookProps> = () => {
    const { toggleView, closeModal } = useModal();
    const toast = useToast();
    const { user } = useAuth();
    const [writingBooks, setWritingBooks] = useState<Book[]>([]);
    const [readingBooks, setReadingBooks] = useState<Book[]>([]);
    const [writingBooksLoading, setWritingBooksLoading] = useState(false);
    const [readingBooksLoading, setReadingBooksLoading] = useState(false);
    const [confirmTitle, setConfirmTitle] = useState("");
    const [confirmContent, setConfirmContent] = useState("");
    const [confirmSubmitFunc, setConfirmSubmitFunc] = useState<
        () => () => Promise<void>
    >(() => async () => {});

    const getWritingBook = async (userId: string) => {
        setWritingBooksLoading(true);
        const writingBookIdDocRef = collection(
            fireStore,
            firebaseRoute.getUserWritingBookIdRoute(userId)
        );
        const bookDocsRef = collection(
            fireStore,
            firebaseRoute.getAllBookRoute()
        );
        const writingBookIdDocs = await getDocs(writingBookIdDocRef);
        const writingBookDocs = await Promise.all(
            writingBookIdDocs.docs.map((d) => getDoc(doc(bookDocsRef, d.id)))
        );
        const books = writingBookDocs
            .filter((doc) => doc.exists())
            .map(
                (doc) =>
                    ({
                        id: doc.id,
                        ...doc.data(),
                    } as Book)
            );
        setWritingBooks(books);
        setWritingBooksLoading(false);
    };

    const getReadingBook = async (userId: string) => {
        setReadingBooksLoading(true);
        const readingBookIdDocRef = collection(
            fireStore,
            firebaseRoute.getUserReadingBookIdRoute(userId)
        );
        const bookDocsRef = collection(
            fireStore,
            firebaseRoute.getAllBookRoute()
        );
        const readingBookIdDocs = await getDocs(readingBookIdDocRef);
        const readingBookDocs = await Promise.all(
            readingBookIdDocs.docs.map((d) => getDoc(doc(bookDocsRef, d.id)))
        );
        const books = readingBookDocs
            .filter((doc) => doc.exists())
            .map(
                (doc) =>
                    ({
                        id: doc.id,
                        ...doc.data(),
                    } as Book)
            );
        setReadingBooks(books);
        setReadingBooksLoading(false);
    };

    useEffect(() => {
        if (user) {
            Promise.all([
                getWritingBook(user.uid),
                getReadingBook(user.uid),
            ]).catch((error) => console.log(error));
        }
    }, [user]);

    if (!user) {
        return (
            <Flex align="center" justify="center">
                <Spinner />
            </Flex>
        );
    }

    const handleDeleteReadingBook = async (book: Book) => {
        try {
            if (!user) {
                throw Error("Not authenticated");
            }
            const batch = writeBatch(fireStore);
            const bookDocRef = doc(
                collection(fireStore, firebaseRoute.getAllBookRoute()),
                book.id
            );
            const userReadingDocRef = doc(
                collection(
                    fireStore,
                    firebaseRoute.getUserReadingBookIdRoute(user.uid)
                ),
                book.id
            );
            batch.delete(userReadingDocRef);
            const bookDoc = await getDoc(bookDocRef);
            if (bookDoc.exists()) {
                batch.update(bookDocRef, {
                    popularity: increment(-1),
                });
            }
            await batch.commit();
            setReadingBooks((prev) => prev.filter((b) => b.id !== book.id));
            closeModal();
            toast({
                title: "Xóa thành công",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "top-right",
            });
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteBook = async (book: Book) => {
        try {
            const batch = writeBatch(fireStore);
            // Delete Book image
            if (book.imageUrl) {
                const imageRef = ref(
                    storage,
                    firebaseRoute.getBookImageRoute(book.id!)
                );
                await deleteObject(imageRef);
            }
            // Decrease author and genre number
            book.authorIds?.forEach((id) => {
                const authorRef = doc(
                    fireStore,
                    firebaseRoute.getAllAuthorRoute(),
                    id
                );
                batch.update(authorRef, {
                    numberOfBooks: increment(-1),
                });
            });
            book.genreIds?.forEach((id) => {
                const genreRef = doc(
                    fireStore,
                    firebaseRoute.getAllGenreRoute(),
                    id
                );
                batch.update(genreRef, {
                    numberOfBooks: increment(-1),
                });
            });

            // Delete author and genre sub collection
            const bookAuthorDocsRef = collection(
                fireStore,
                firebaseRoute.getBookAuthorIdRoute(book.id!)
            );
            const bookAuthorDocs = await getDocs(bookAuthorDocsRef);
            bookAuthorDocs.docs.forEach((d) => {
                batch.delete(doc(bookAuthorDocsRef, d.id));
            });
            const bookGenreDocsRef = collection(
                fireStore,
                firebaseRoute.getBookGenreIdRoute(book.id!)
            );
            const bookGenreDocs = await getDocs(bookGenreDocsRef);
            bookGenreDocs.docs.forEach((d) => {
                batch.delete(doc(bookGenreDocsRef, d.id));
            });

            // Delete Book
            const bookRef = doc(
                fireStore,
                firebaseRoute.getAllBookRoute(),
                book.id!
            );
            batch.delete(bookRef);

            // Delete BookSnippet in user
            const userBookRef = doc(
                fireStore,
                firebaseRoute.getUserWritingBookIdRoute(user.uid),
                book.id!
            );
            batch.delete(userBookRef);
            await batch.commit();

            // Set writing book state
            setWritingBooks((prev) =>
                prev.filter((item) => item.id !== book.id)
            );
            closeModal();
            toast({
                title: "Xóa thành công",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "top-right",
            });
        } catch (error) {
            toast({
                title: "Có lỗi xảy ra. Vui lòng thử lại",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top-right",
            });
            console.log(error);
        }
    };
    return (
        <Box>
            <ConfirmModal
                title={confirmTitle}
                content={confirmContent}
                onSubmit={async () => {
                    confirmSubmitFunc();
                }}
            />
            <LibrarySection title="Danh sách đọc">
                <BookLibraryCarousel
                    books={readingBooks}
                    loading={readingBooksLoading}
                    onDelete={(book) => {
                        setConfirmTitle("Xác nhận xóa truyện");
                        setConfirmContent(
                            "Bạn chắc chắn muốn xóa truyện này khỏi danh sách đọc?"
                        );
                        setConfirmSubmitFunc(
                            () => () => handleDeleteReadingBook(book)
                        );
                        toggleView("confirmModal");
                    }}
                    noBookText="Chưa có manga nào trong danh sách đọc"
                    href={(bookId) => `${BOOK_PAGE}/${bookId}`}
                />
            </LibrarySection>
            <Divider my={4} />
            <LibrarySection title="Manga đã viết">
                <BookLibraryCarousel
                    books={writingBooks}
                    loading={writingBooksLoading}
                    onDelete={(book) => {
                        setConfirmTitle("Xác nhận xóa truyện");
                        setConfirmContent("Bạn chắc chắn muốn xóa truyện này?");
                        setConfirmSubmitFunc(
                            () => () => handleDeleteBook(book)
                        );
                        toggleView("confirmModal");
                    }}
                    noBookText="Bạn chưa viết manga nào"
                    href={getEditBookPage}
                />
            </LibrarySection>
        </Box>
    );
};
export default LibraryBook;
