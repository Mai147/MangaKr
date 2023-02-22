import BookSnippetItem from "@/components/Book/Snippet/BookSnippetItem";
import BookSnippetSkeleton from "@/components/Book/Snippet/BookSnippetSkeleton";
import BookCarousel from "@/components/Book/Snippet/Carousel";
import Carousel from "@/components/Test/carousel";
import ConfirmModal from "@/components/Modal/ConfirmModal";
import { firebaseRoute } from "@/constants/firebaseRoutes";
import { getEditBookPage, HOME_PAGE } from "@/constants/routes";
import { fireStore, storage } from "@/firebase/clientApp";
import useAuth from "@/hooks/useAuth";
import useModal from "@/hooks/useModal";
import { BookSnippet } from "@/models/Book";
import { UserModel } from "@/models/User";
import {
    Box,
    Button,
    Divider,
    Flex,
    Spinner,
    Text,
    useToast,
    VStack,
} from "@chakra-ui/react";
import {
    collection,
    doc,
    getDocs,
    increment,
    writeBatch,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { GetServerSidePropsContext } from "next";
import cookies from "next-cookies";
import React, { useEffect, useState } from "react";

type ProfileLibaryPageProps = {};

const ProfileLibraryPage: React.FC<ProfileLibaryPageProps> = () => {
    const { toggleView, closeModal } = useModal();
    const toast = useToast();
    const { user, setNeedAuth, setDefaultPath } = useAuth();
    const [writingBooks, setWritingBooks] = useState<BookSnippet[]>([]);
    const [writingBooksLoading, setWritingBooksLoading] = useState(false);
    const [selectedBook, setSelectedBook] = useState<BookSnippet>();

    const getWritingBook = async (user: UserModel) => {
        setWritingBooksLoading(true);
        const writingBookRef = collection(
            fireStore,
            firebaseRoute.getUserWritingBookSnippetRoute(user.uid)
        );
        const writingBookDocs = await getDocs(writingBookRef);
        setWritingBooks(
            writingBookDocs.docs.map(
                (doc) =>
                    ({
                        id: doc.id,
                        ...doc.data(),
                    } as BookSnippet)
            )
        );
        setWritingBooksLoading(false);
    };

    useEffect(() => {
        setNeedAuth(true);
        setDefaultPath(HOME_PAGE);
    }, []);

    useEffect(() => {
        if (user) {
            getWritingBook(user);
        }
    }, [user]);

    if (!user) {
        return (
            <Flex align="center" justify="center">
                <Spinner />
            </Flex>
        );
    }

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
            {writingBooks.length > 0 && (
                <ConfirmModal
                    title="Xác nhận xóa truyện"
                    content="Bạn chắc chắn muốn xóa truyện này?"
                    onSubmit={() => handleDeleteBook(selectedBook!)}
                />
            )}
            <VStack spacing={2} align="flex-start">
                <Text fontWeight={600} fontSize={28}>
                    Library
                </Text>
                <Divider />
                {/* {writingBooksLoading && (
                            <Flex>
                                {[1, 2, 3].map((idx) => (
                                    <BookSnippetSkeleton
                                        key={idx}
                                        loading={writingBooksLoading}
                                    />
                                ))}
                            </Flex>
                        )} */}
            </VStack>
            <VStack spacing={2} align="flex-start">
                <Text fontWeight={600} fontSize={28}>
                    Writed
                </Text>
                <Divider />
                {writingBooksLoading ? (
                    <Flex>
                        {[1, 2, 3].map((idx) => (
                            <BookSnippetSkeleton
                                key={idx}
                                loading={writingBooksLoading}
                            />
                        ))}
                    </Flex>
                ) : (
                    <BookCarousel length={writingBooks.length}>
                        {writingBooks.map((book) => (
                            <Box key={book.id}>
                                <Flex direction="column" align="center">
                                    <Flex direction="column" w="95%">
                                        <BookSnippetItem
                                            book={book}
                                            href={getEditBookPage(book.id!)}
                                        />
                                        <Button
                                            mt={4}
                                            onClick={() => {
                                                setSelectedBook(book);
                                                toggleView("confirmModal");
                                            }}
                                        >
                                            Xóa
                                        </Button>
                                    </Flex>
                                </Flex>
                            </Box>
                        ))}
                    </BookCarousel>
                )}
            </VStack>
        </Box>
    );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { token } = cookies(context) || null;
    if (token) {
        return {
            props: {},
        };
    } else {
        context.res.writeHead(302, { Location: HOME_PAGE });
        context.res.end();
    }
}

export default ProfileLibraryPage;
