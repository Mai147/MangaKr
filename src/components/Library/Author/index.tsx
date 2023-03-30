import AuthorSnippetItem from "@/components/Author/Snippet/AuthorSnippetItem";
import BookCarousel from "@/components/Book/Snippet/Carousel";
import VerticalSkeleton from "@/components/Skeleton/VerticalSkeleton";
import { getEditAuthorPage } from "@/constants/routes";
import { toastOption } from "@/constants/toast";
import useAuth from "@/hooks/useAuth";
import useModal from "@/hooks/useModal";
import { Author } from "@/models/Author";
import AuthorService from "@/services/AuthorService";
import { Flex, Text, useToast } from "@chakra-ui/react";
import React, { SetStateAction, useEffect, useState } from "react";
import LibrarySection from "../Section";

type LibraryAuthorProps = {
    setConfirmTitle: React.Dispatch<SetStateAction<string>>;
    setConfirmContent: React.Dispatch<SetStateAction<string>>;
    setConfirmSubContent: React.Dispatch<SetStateAction<string>>;
    setConfirmSubmitFunc: React.Dispatch<
        SetStateAction<() => () => Promise<void>>
    >;
};

const LibraryAuthor: React.FC<LibraryAuthorProps> = ({
    setConfirmContent,
    setConfirmSubContent,
    setConfirmSubmitFunc,
    setConfirmTitle,
}) => {
    const { user } = useAuth();
    const { toggleView, closeModal } = useModal();
    const [authors, setAuthors] = useState<Author[]>([]);
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const getAuthors = async (userId: string) => {
        setLoading(true);
        try {
            const authors = await AuthorService.getAll({ userId });
            if (authors) {
                setAuthors(authors as Author[]);
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const handleDeleteAuthor = async (author: Author) => {
        try {
            const res = await AuthorService.delete({ author });
            if (res) {
                setAuthors((prev) =>
                    prev.filter((item) => item.id !== author.id)
                );
                closeModal();
                toast({
                    ...toastOption,
                    title: "Xóa thành công!",
                    status: "success",
                });
            } else {
                closeModal();
                toast({
                    ...toastOption,
                    title: "Không thể xóa tác giả này!",
                    status: "error",
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (user) {
            getAuthors(user.uid);
        }
    }, [user]);

    return (
        <LibrarySection title="Tác giả">
            {loading ? (
                <Flex>
                    {[1, 2, 3].map((item) => (
                        <VerticalSkeleton key={item} />
                    ))}
                </Flex>
            ) : authors.length <= 0 ? (
                <Text fontSize={18}>Chưa có tác giả nào</Text>
            ) : (
                <BookCarousel length={authors.length} type="characterSnippet">
                    {authors.map((author) => (
                        <AuthorSnippetItem
                            key={author.id}
                            author={author}
                            href={getEditAuthorPage(author.id!)}
                            h="100%"
                            onDelete={(author) => {
                                setConfirmTitle("Xác nhận xóa tác giả");
                                setConfirmContent(
                                    "Bạn chắc chắn muốn xóa tác giả này?"
                                );
                                setConfirmSubContent(
                                    "Lưu ý: Bạn không thể xóa nếu tác giả này có Manga!"
                                );
                                setConfirmSubmitFunc(
                                    () => () => handleDeleteAuthor(author)
                                );
                                toggleView("confirmModal");
                            }}
                        />
                    ))}
                </BookCarousel>
            )}
        </LibrarySection>
    );
};
export default LibraryAuthor;
