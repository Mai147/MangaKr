import { getRequiredError } from "@/constants/errors";
import { toastOption } from "@/constants/toast";
import { ValidationError } from "@/constants/validation";
import useAuth from "@/hooks/useAuth";
import useModal from "@/hooks/useModal";
import {
    Book,
    BookStatus,
    bookStatusList,
    defaultReadingBookSnippet,
    ReadingBookSnippet,
} from "@/models/Book";
import BookService from "@/services/BookService";
import BookUtils from "@/utils/BookUtils";
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
import React, { useEffect, useState } from "react";
import ErrorText from "../Auth/ErrorText";
import ModalInputItem from "../ModalInputItem";

type AddLibraryModalProps = {
    book: Book;
    setIsInLibrary: React.Dispatch<React.SetStateAction<boolean>>;
};

const AddLibraryModal: React.FC<AddLibraryModalProps> = ({
    book,
    setIsInLibrary,
}) => {
    const { user } = useAuth();
    const { isOpen, view, toggleView, closeModal } = useModal();
    const [readingBookSnippetForm, setReadingBookSnippetForm] =
        useState<ReadingBookSnippet>(defaultReadingBookSnippet);
    const [errors, setErrors] = useState<ValidationError[]>([]);
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    useEffect(() => {
        setReadingBookSnippetForm({
            ...BookUtils.toBookSnippet(book),
            status: defaultReadingBookSnippet.status,
            chap: defaultReadingBookSnippet.chap,
        });
    }, [book]);

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        if (!user) {
            toggleView("login");
        } else {
            if (errors) setErrors([]);
            if (!readingBookSnippetForm.status) {
                const error: ValidationError = {
                    field: "status",
                    message: getRequiredError("trạng thái"),
                };
                setErrors((prev) => [...prev, error]);
                setLoading(false);
                return;
            }
            try {
                await BookService.addToLibrary({
                    readingBookSnippetForm,
                    userId: user.uid,
                });
                setIsInLibrary((prev) => !prev);
                closeModal();
                toast({
                    ...toastOption,
                    title: "Thêm thành công",
                    status: "success",
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
                    setReadingBookSnippetForm({
                        ...BookUtils.toBookSnippet(book),
                        status: defaultReadingBookSnippet.status,
                        chap: defaultReadingBookSnippet.chap,
                    });
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
                                    options={bookStatusList}
                                    value={readingBookSnippetForm.status}
                                    label="Trạng thái"
                                    onChange={(value) => {
                                        setReadingBookSnippetForm((prev) => ({
                                            ...prev,
                                            status: value as BookStatus,
                                        }));
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
                                        value={readingBookSnippetForm.chap}
                                        onChange={(e) => {
                                            setReadingBookSnippetForm(
                                                (prev) => ({
                                                    ...prev,
                                                    chap: e.target.value,
                                                })
                                            );
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
