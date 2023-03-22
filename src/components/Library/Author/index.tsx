import AuthorSnippetItem from "@/components/Author/Snippet/AuthorSnippetItem";
import BookCarousel from "@/components/Book/Snippet/Carousel";
import VerticalSkeleton from "@/components/Skeleton/VerticalSkeleton";
import { firebaseRoute } from "@/constants/firebaseRoutes";
import { getEditAuthorPage } from "@/constants/routes";
import { fireStore, storage } from "@/firebase/clientApp";
import useAuth from "@/hooks/useAuth";
import useModal from "@/hooks/useModal";
import { Author } from "@/models/Author";
import { Flex, Text, useToast } from "@chakra-ui/react";
import {
    collection,
    doc,
    getDocs,
    query,
    where,
    writeBatch,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
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
            const authorDocsRef = collection(
                fireStore,
                firebaseRoute.getAllAuthorRoute()
            );
            const authorQuery = query(
                authorDocsRef,
                where("creatorId", "==", userId)
            );
            const authorDocs = await getDocs(authorQuery);
            const authors = authorDocs.docs.map(
                (doc) =>
                    ({
                        id: doc.id,
                        ...doc.data(),
                    } as Author)
            );
            setAuthors(authors);
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const handleDeleteAuthor = async (author: Author) => {
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
                closeModal();
                toast({
                    title: "Không thể xóa tác giả này!",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "top-right",
                });
                return;
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
                setAuthors((prev) =>
                    prev.filter((item) => item.id !== author.id)
                );
                closeModal();
                toast({
                    title: "Xóa thành công!",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "top-right",
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
