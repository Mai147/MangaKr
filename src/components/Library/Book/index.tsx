import BookLibraryCarousel from "@/components/Book/Snippet/BookLibraryCarousel";
import { firebaseRoute } from "@/constants/firebaseRoutes";
import { BOOK_PAGE, getEditBookPage } from "@/constants/routes";
import { fireStore, storage } from "@/firebase/clientApp";
import useAuth from "@/hooks/useAuth";
import useModal from "@/hooks/useModal";
import usePagination from "@/hooks/usePagination";
import { Book, BookSnippet, ReadingBookSnippet } from "@/models/Book";
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
import React, { SetStateAction, useEffect, useState } from "react";
import LibrarySection from "../Section";

// interface PaginationInfo {
//     page: number;
//     totalPage: number;
//     pageCount: number;
//     isNext: boolean;
//     loading: boolean;
// }

// interface BookPaginationInfo extends PaginationInfo {
//     books: BookSnippet[];
// }

// const defaultPaginationInfoState: PaginationInfo = {
//     page: 1,
//     totalPage: 1,
//     isNext: true,
//     loading: false,
//     pageCount: 0,
// };

// const defaultBookPaginationState: BookPaginationInfo = {
//     ...defaultPaginationInfoState,
//     books: [],
//     pageCount: 5,
// };

type LibraryBookProps = {
    setConfirmTitle: React.Dispatch<SetStateAction<string>>;
    setConfirmContent: React.Dispatch<SetStateAction<string>>;
    setConfirmSubmitFunc: React.Dispatch<
        SetStateAction<() => () => Promise<void>>
    >;
};

const LibraryBook: React.FC<LibraryBookProps> = ({
    setConfirmContent,
    setConfirmSubmitFunc,
    setConfirmTitle,
}) => {
    const { toggleView, closeModal } = useModal();
    const toast = useToast();
    const { user } = useAuth();
    const [writingBooks, setWritingBooks] = useState<BookSnippet[]>([]);
    const [readingBooks, setReadingBooks] = useState<BookSnippet[]>([]);
    const [writingBooksLoading, setWritingBooksLoading] = useState(false);
    const [readingBooksLoading, setReadingBooksLoading] = useState(false);
    // const [writingBooks, setWritingBooks] = useState<BookPaginationInfo>(
    //     defaultBookPaginationState
    // );
    // const [readingBooks, setReadingBooks] = useState<BookPaginationInfo>(
    //     defaultBookPaginationState
    // );
    // const { getWritingBookSnippets, getReadingBookSnippets } = usePagination();

    // const getWritingBook = async (userId: string) => {
    //     setWritingBooks((prev) => ({
    //         ...prev,
    //         loading: true,
    //     }));
    //     const res = await getWritingBookSnippets({
    //         page: writingBooks.page,
    //         isNext: writingBooks.isNext,
    //         pageCount: writingBooks.pageCount,
    //         userId,
    //     });
    //     console.log(res);
    //     setWritingBooks((prev) => ({
    //         ...prev,
    //         books: [...prev.books, ...res?.books],
    //         totalPage: res?.totalPage || 0,
    //         loading: false,
    //     }));
    // };

    // const getReadingBook = async (userId: string) => {
    //     setReadingBooks((prev) => ({
    //         ...prev,
    //         loading: true,
    //     }));
    //     const res = await getReadingBookSnippets({
    //         page: readingBooks.page,
    //         isNext: readingBooks.isNext,
    //         pageCount: readingBooks.pageCount,
    //         userId,
    //     });
    //     setReadingBooks((prev) => ({
    //         ...prev,
    //         books: res?.books,
    //         totalPage: res?.totalPage || 0,
    //         loading: false,
    //     }));
    // };

    const getWritingBook = async (userId: string) => {
        setWritingBooksLoading(true);
        const writingBookSnippetDocRef = collection(
            fireStore,
            firebaseRoute.getUserWritingBookSnippetRoute(userId)
        );
        const writingBookSnippetDocs = await getDocs(writingBookSnippetDocRef);
        const writingBooks = writingBookSnippetDocs.docs.map(
            (doc) =>
                ({
                    ...doc.data(),
                    id: doc.id,
                } as BookSnippet)
        );

        setWritingBooks(writingBooks);
        setWritingBooksLoading(false);
    };

    const getReadingBook = async (userId: string) => {
        setReadingBooksLoading(true);
        const readingBookSnippetDocRef = collection(
            fireStore,
            firebaseRoute.getUserReadingBookSnippetRoute(userId)
        );
        const readingBookSnippetDocs = await getDocs(readingBookSnippetDocRef);
        const readingBooks = readingBookSnippetDocs.docs.map(
            (doc) =>
                ({
                    id: doc.id,
                    ...doc.data(),
                } as BookSnippet)
        );
        setReadingBooks(readingBooks);
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

    const handleDeleteReadingBook = async (book: BookSnippet) => {
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
                    firebaseRoute.getUserReadingBookSnippetRoute(user.uid)
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
            // setReadingBooks((prev) => prev.filter((b) => b.id !== book.id));
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

    const handleDeleteBook = async (book: BookSnippet) => {
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

            // Delete character
            if (book.characterIds) {
                for (const id of book.characterIds) {
                    const characterDocRef = doc(
                        fireStore,
                        firebaseRoute.getAllCharacterRoute(),
                        id!
                    );
                    const imageRef = ref(
                        storage,
                        firebaseRoute.getCharacterImageRoute(id!)
                    );
                    await deleteObject(imageRef);
                    batch.delete(characterDocRef);
                }
            }

            // Delete author, genre, character sub collection
            const bookAuthorDocsRef = collection(
                fireStore,
                firebaseRoute.getBookAuthorSnippetsRoute(book.id!)
            );
            const bookAuthorDocs = await getDocs(bookAuthorDocsRef);
            bookAuthorDocs.docs.forEach((d) => {
                batch.delete(doc(bookAuthorDocsRef, d.id));
            });
            const bookGenreDocsRef = collection(
                fireStore,
                firebaseRoute.getBookGenreSnippetsRoute(book.id!)
            );
            const bookGenreDocs = await getDocs(bookGenreDocsRef);
            bookGenreDocs.docs.forEach((d) => {
                batch.delete(doc(bookGenreDocsRef, d.id));
            });
            const bookCharacterDocsRef = collection(
                fireStore,
                firebaseRoute.getBookCharacterSnippetRoute(book.id!)
            );
            const bookCharacterDocs = await getDocs(bookCharacterDocsRef);
            bookCharacterDocs.forEach((d) => {
                batch.delete(doc(bookCharacterDocsRef, d.id));
            });
            const bookCommentsDocsRef = collection(
                fireStore,
                firebaseRoute.getBookCommentRoute(book.id!)
            );
            const bookCommentsDocs = await getDocs(bookCommentsDocsRef);
            bookCommentsDocs.forEach((d) => {
                batch.delete(doc(bookCommentsDocsRef, d.id));
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
                firebaseRoute.getUserWritingBookSnippetRoute(user.uid),
                book.id!
            );
            batch.delete(userBookRef);
            await batch.commit();

            // Set writing book state
            // setWritingBooks((prev) =>
            //     prev.filter((item) => item.id !== book.id)
            // );
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
            <LibrarySection title="Danh sách đọc">
                <BookLibraryCarousel
                    length={readingBooks.length}
                    books={readingBooks}
                    loading={readingBooksLoading}
                    onDelete={(book) => {
                        setConfirmTitle("Xác nhận xóa truyện");
                        setConfirmContent(
                            "Bạn chắc chắn muốn xóa truyện này khỏi danh sách đọc?"
                        );
                        setConfirmSubmitFunc(() => async () => {
                            handleDeleteReadingBook(book);
                        });
                        toggleView("confirmModal");
                    }}
                    noBookText="Chưa có manga nào trong danh sách đọc"
                    href={(bookId) => `${BOOK_PAGE}/${bookId}`}
                />
            </LibrarySection>
            <Divider my={4} />
            <LibrarySection title="Manga đã viết">
                <BookLibraryCarousel
                    length={writingBooks.length}
                    books={writingBooks}
                    loading={writingBooksLoading}
                    onDelete={(book) => {
                        setConfirmTitle("Xác nhận xóa truyện");
                        setConfirmContent("Bạn chắc chắn muốn xóa truyện này?");
                        setConfirmSubmitFunc(() => async () => {
                            await handleDeleteBook(book);
                        });
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
