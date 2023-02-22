import { UNKNOWN_ERROR } from "@/constants/errors";
import { firebaseRoute } from "@/constants/firebaseRoutes";
import { ValidationError } from "@/constants/validation";
import { fireStore } from "@/firebase/clientApp";
import useModal from "@/hooks/useModal";
import { Author, AuthorSnippet } from "@/models/Author";
import { validateCreateAuthor } from "@/validation/authorValidation";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    Button,
    Flex,
} from "@chakra-ui/react";
import { addDoc, collection } from "firebase/firestore";
import React, { useState } from "react";
import ErrorText from "../Auth/ErrorText";
import ModalInputItem from "../ModalInputItem";

type AuthorModalProps = {
    setAuthors: (value: AuthorSnippet) => void;
};

const defaultAuthorFormState: Author = {
    name: "",
    numberOfBooks: 0,
    numberOfLikes: 0,
    numberOfDislikes: 0,
};

const AuthorModal: React.FC<AuthorModalProps> = ({ setAuthors }) => {
    const { view, isOpen, closeModal } = useModal();
    const [authorForm, setAuthorForm] = useState<Author>(
        defaultAuthorFormState
    );
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<ValidationError[]>([]);
    const [firebaseError, setFirebaseError] = useState<Error>();

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (errors) {
            setErrors([]);
        }
        if (firebaseError) {
            setFirebaseError(undefined);
        }
        setLoading(true);
        try {
            const res = await validateCreateAuthor(authorForm);
            if (!res.result) {
                setErrors(res.errors);
            } else {
                const authorsDocRef = collection(
                    fireStore,
                    firebaseRoute.getAllAuthorRoute()
                );
                const res = await addDoc(authorsDocRef, {
                    name: authorForm.name,
                    numberOfBooks: authorForm.numberOfBooks,
                    numberOfLikes: authorForm.numberOfLikes,
                    numberOfDislikes: authorForm.numberOfDislikes,
                });
                if (res) {
                    setAuthors({
                        id: res.id,
                        name: authorForm.name,
                    });
                    setAuthorForm(defaultAuthorFormState);
                    closeModal();
                } else {
                    setErrors([
                        {
                            field: "all",
                            message: UNKNOWN_ERROR,
                        },
                    ]);
                }
            }
        } catch (error: any) {
            console.log(error);
            setFirebaseError(firebaseError);
        }
        setLoading(false);
    };

    const onChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setAuthorForm(
            (prev) =>
                ({
                    ...prev,
                    [event.target.name]: event.target.value,
                } as Author)
        );
    };

    return (
        <>
            <Modal
                isOpen={isOpen && view === "createAuthor"}
                onClose={closeModal}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader textAlign={"center"}>Tạo tác giả</ModalHeader>
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
                                <ModalInputItem
                                    required={true}
                                    name="name"
                                    placeholder="Tên tác giả"
                                    type="text"
                                    value={authorForm?.name}
                                    onChange={onChange}
                                />

                                <ErrorText
                                    error={
                                        errors.find(
                                            (error) => error.field === "name"
                                        )?.message
                                    }
                                />
                                <ErrorText
                                    error={
                                        errors.find(
                                            (error) => error.field === "all"
                                        )?.message
                                    }
                                />
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
                                        Tạo
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
export default AuthorModal;
