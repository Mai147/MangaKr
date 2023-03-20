import { getRequiredError } from "@/constants/errors";
import { firebaseRoute } from "@/constants/firebaseRoutes";
import { ValidationError } from "@/constants/validation";
import { fireStore } from "@/firebase/clientApp";
import useAuth from "@/hooks/useAuth";
import useModal from "@/hooks/useModal";
import { Book, BookStatus } from "@/models/Book";
import ModelUtils from "@/utils/ModelUtils";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    Flex,
    Button,
    VStack,
    Text,
    useToast,
} from "@chakra-ui/react";
import { MultiSelect } from "chakra-multiselect";
import { collection, doc, increment, writeBatch } from "firebase/firestore";
import React, { useState } from "react";
import ErrorText from "../Auth/ErrorText";
import ModalInputItem from "../ModalInputItem";

type AddLibraryModalProps = {
    book: Book;
    setIsInLibrary: React.Dispatch<React.SetStateAction<boolean>>;
};

type BookStatusOption = {
    label: string;
    value: BookStatus;
};

const bookStatusOptions: BookStatusOption[] = [
    {
        label: "Hoàn thành",
        value: "DONE",
    },
    {
        label: "Chưa hoàn thành",
        value: "GOING",
    },
    {
        label: "Đã bỏ",
        value: "DROP",
    },
];

const AddLibraryModal: React.FC<AddLibraryModalProps> = ({
    book,
    setIsInLibrary,
}) => {
    const { user } = useAuth();
    const { isOpen, view, toggleView, closeModal } = useModal();
    const [status, setStatus] = useState("");
    const [chap, setChap] = useState("");
    const [errors, setErrors] = useState<ValidationError[]>([]);
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        if (!user) {
            toggleView("login");
        } else {
            if (errors) setErrors([]);
            if (!status) {
                const error: ValidationError = {
                    field: "status",
                    message: getRequiredError("trạng thái"),
                };
                setErrors((prev) => [...prev, error]);
                setLoading(false);
                return;
            }
            try {
                const batch = writeBatch(fireStore);
                const userReadingBookDocRef = doc(
                    collection(
                        fireStore,
                        firebaseRoute.getUserReadingBookSnippetRoute(user.uid)
                    ),
                    book.id!
                );
                const bookDocRef = doc(
                    collection(fireStore, firebaseRoute.getAllBookRoute()),
                    book.id!
                );
                batch.set(userReadingBookDocRef, {
                    ...ModelUtils.toBookSnippet(book),
                    status,
                    chap,
                });
                batch.update(bookDocRef, {
                    popularity: increment(1),
                });
                await batch.commit();
                setIsInLibrary((prev) => !prev);
                closeModal();
                toast({
                    title: "Thêm thành công",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "top-right",
                });
            } catch (error) {
                console.log(error);
            }
            setLoading(false);
        }
    };
    return (
        <>
            <Modal
                isOpen={isOpen && view === "addToLibrary"}
                onClose={() => {
                    setStatus("");
                    setChap("");
                    setErrors([]);
                    closeModal();
                }}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader textAlign={"center"}>
                        Thêm vào thư viện
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        pb={6}
                    >
                        <Flex
                            direction="column"
                            align="center"
                            justify="center"
                            width="90%"
                        >
                            <form onSubmit={onSubmit} style={{ width: "100%" }}>
                                <MultiSelect
                                    options={bookStatusOptions}
                                    value={status}
                                    label="Trạng thái"
                                    onChange={(value) => {
                                        setStatus(value as string);
                                        setErrors([]);
                                    }}
                                    required
                                    single
                                />
                                <ErrorText
                                    error={
                                        errors.find(
                                            (error) => error.field === "status"
                                        )?.message
                                    }
                                />
                                <VStack mt={2} spacing={0} align="flex-start">
                                    <Text fontWeight={600}>Chap</Text>
                                    <ModalInputItem
                                        name="chap"
                                        type="text"
                                        value={chap}
                                        onChange={(e) => {
                                            setChap(e.target.value);
                                        }}
                                    />
                                </VStack>
                                <Flex justify="flex-end">
                                    <Button
                                        w={{ base: 20, md: 28 }}
                                        size={{ base: "sm", md: "md" }}
                                        height="36px"
                                        mt={2}
                                        mb={2}
                                        variant="outline"
                                        mr={3}
                                        onClick={closeModal}
                                    >
                                        Đóng
                                    </Button>
                                    <Button
                                        w={{ base: 20, md: 28 }}
                                        size={{ base: "sm", md: "md" }}
                                        height="36px"
                                        mt={2}
                                        mb={2}
                                        type="submit"
                                        isLoading={loading}
                                    >
                                        Thêm
                                    </Button>
                                </Flex>
                            </form>
                        </Flex>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};
export default AddLibraryModal;
