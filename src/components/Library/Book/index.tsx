import BookLibraryCarousel from "@/components/Book/Snippet/BookLibraryCarousel";
import { routes } from "@/constants/routes";
import { toastOption } from "@/constants/toast";
import useAuth from "@/hooks/useAuth";
import useModal from "@/hooks/useModal";
import { BookSnippet } from "@/models/Book";
import BookService from "@/services/BookService";
import { Divider, Box, Flex, Spinner, useToast } from "@chakra-ui/react";
import React, { SetStateAction, useEffect, useState } from "react";
import LibrarySection from "../Section";

type LibraryBookProps = {
    setConfirmTitle: React.Dispatch<SetStateAction<string>>;
    setConfirmContent: React.Dispatch<SetStateAction<string>>;
    setConfirmSubContent: React.Dispatch<SetStateAction<string>>;
    setConfirmSubmitFunc: React.Dispatch<
        SetStateAction<() => () => Promise<void>>
    >;
};

const LibraryBook: React.FC<LibraryBookProps> = ({
    setConfirmContent,
    setConfirmSubContent,
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

    const getWritingBook = async (userId: string) => {
        setWritingBooksLoading(true);
        const writingBooks = await BookService.getUserSnippetBook({
            userId,
            type: "writing",
        });

        setWritingBooks(writingBooks);
        setWritingBooksLoading(false);
    };

    const getReadingBook = async (userId: string) => {
        setReadingBooksLoading(true);
        const readingBooks = await BookService.getUserSnippetBook({
            userId,
            type: "reading",
        });
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
            await BookService.deleteReadingSnippet({ book, userId: user.uid });
            setReadingBooks((prev) => prev.filter((b) => b.id !== book.id));
            closeModal();
            toast({
                ...toastOption,
                title: "Xóa thành công",
                status: "success",
            });
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteBook = async (book: BookSnippet) => {
        try {
            if (user.uid !== book.writerId) {
                return;
            }
            await BookService.delete({ book });

            // Set writing book state
            setWritingBooks((prev) =>
                prev.filter((item) => item.id !== book.id)
            );
            closeModal();
            toast({
                ...toastOption,
                title: "Xóa thành công",
                status: "success",
            });
        } catch (error) {
            toast({
                ...toastOption,
                title: "Có lỗi xảy ra. Vui lòng thử lại",
                status: "error",
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
                    href={routes.getBookDetailPage}
                />
            </LibrarySection>
            <Divider my={4} borderColor="gray.400" />
            <LibrarySection title="Manga đã viết">
                <BookLibraryCarousel
                    length={writingBooks.length}
                    books={writingBooks}
                    loading={writingBooksLoading}
                    onDelete={(book) => {
                        setConfirmTitle("Xác nhận xóa truyện");
                        setConfirmContent("Bạn chắc chắn muốn xóa truyện này?");
                        setConfirmSubContent("");
                        setConfirmSubmitFunc(() => async () => {
                            await handleDeleteBook(book);
                        });
                        toggleView("confirmModal");
                    }}
                    noBookText="Bạn chưa viết manga nào"
                    href={routes.getBookEditPage}
                />
            </LibrarySection>
        </Box>
    );
};
export default LibraryBook;
