import AddLibraryModal from "@/components/Modal/Book/AddLibraryModal";
import useModal from "@/hooks/useModal";
import { Book } from "@/models/Book";
import { UserModel } from "@/models/User";
import BookService from "@/services/BookService";
import { Button, Icon } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { IoAdd, IoRemoveOutline } from "react-icons/io5";

type AddLibraryButtonProps = {
    book: Book;
    user?: UserModel | null;
};

const AddLibraryButton: React.FC<AddLibraryButtonProps> = ({ book, user }) => {
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
        <>
            <AddLibraryModal book={book} setIsInLibrary={setIsInLibrary} />
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
        </>
    );
};
export default AddLibraryButton;
