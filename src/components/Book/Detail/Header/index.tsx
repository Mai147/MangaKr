import AddLibraryModal from "@/components/Modal/Book/AddLibraryModal";
import RatingBar from "@/components/RatingBar";
import useModal from "@/hooks/useModal";
import { Book } from "@/models/Book";
import { UserModel } from "@/models/User";
import BookService from "@/services/BookService";
import { Button, Flex, Heading, Icon, VStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { BsBookHalf } from "react-icons/bs";
import { FaRegComment } from "react-icons/fa";
import { IoAdd, IoRemoveOutline } from "react-icons/io5";
import { MdOutlineRateReview } from "react-icons/md";
import ReactInfo from "./ReactInfo";

type BookDetailHeaderProps = {
    book: Book;
    user?: UserModel | null;
};

const BookDetailHeader: React.FC<BookDetailHeaderProps> = ({ book, user }) => {
    const { toggleView } = useModal();
    const [isInLibrary, setIsInLibrary] = useState(false);
    const [loadingBookLibrary, setLoadingBookLibrary] = useState(false);

    const getBookLibrary = async (userId: string) => {
        setLoadingBookLibrary(true);
        const res = await BookService.isInLibrary({ bookId: book.id!, userId });
        setIsInLibrary(res);
        setLoadingBookLibrary(false);
    };

    useEffect(() => {
        if (user) {
            getBookLibrary(user.uid);
        }
    }, [user]);

    const handleRemoveLibrary = async () => {
        if (!user) {
            toggleView("login");
        } else {
            setLoadingBookLibrary(true);
            try {
                await BookService.removeOutLibrary({
                    bookId: book.id!,
                    userId: user.uid,
                });
                setIsInLibrary((prev) => !prev);
            } catch (error) {
                console.log(error);
            }
            setLoadingBookLibrary(false);
        }
    };

    return (
        <VStack spacing={2} align="stretch">
            <AddLibraryModal book={book} setIsInLibrary={setIsInLibrary} />
            <Heading as="h3">{book.name}</Heading>
            <Flex align="center" justify="space-between">
                <Button
                    isLoading={loadingBookLibrary}
                    onClick={() => {
                        if (!isInLibrary) toggleView("addToLibrary");
                        else {
                            handleRemoveLibrary();
                        }
                    }}
                >
                    {!isInLibrary ? (
                        <>
                            <Icon as={IoAdd} fontSize={20} mr={2} />
                            Thêm vào thư viện
                        </>
                    ) : (
                        <>
                            <Icon as={IoRemoveOutline} fontSize={20} mr={2} />
                            Xóa khỏi thư viện
                        </>
                    )}
                </Button>
                <ReactInfo
                    title="bình chọn"
                    value={book.numberOfRates}
                    subChild={
                        <RatingBar rate={book.rating / 2} size={20} readonly />
                    }
                />
                <ReactInfo
                    icon={BsBookHalf}
                    title="người đọc"
                    value={book.popularity}
                />
                <ReactInfo
                    icon={FaRegComment}
                    title="bình luận"
                    value={book.numberOfComments}
                />
                <ReactInfo
                    icon={MdOutlineRateReview}
                    title="bài đánh giá"
                    value={book.numberOfReviews}
                />
            </Flex>
        </VStack>
    );
};
export default BookDetailHeader;
