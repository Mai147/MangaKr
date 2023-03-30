import { UNKNOWN_ERROR } from "@/constants/errors";
import { ValidationError } from "@/constants/validation";
import useAuth from "@/hooks/useAuth";
import useModal from "@/hooks/useModal";
import { Author, AuthorSnippet, defaultAuthorForm } from "@/models/Author";
import AuthorService from "@/services/AuthorService";
import AuthorUtils from "@/utils/AuthorUtils";
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
import React, { useEffect, useState } from "react";
import ErrorText from "../Auth/ErrorText";
import ModalInputItem from "../ModalInputItem";

type AuthorModalProps = {
    setAuthors: (value: AuthorSnippet) => void;
};

const AuthorModal: React.FC<AuthorModalProps> = ({ setAuthors }) => {
    const { user } = useAuth();
    const { view, isOpen, closeModal } = useModal();
    const [authorForm, setAuthorForm] = useState<Author>(defaultAuthorForm);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<ValidationError[]>([]);
    const [firebaseError, setFirebaseError] = useState<Error>();

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (errors.length > 0) {
            setErrors([]);
        }
        if (firebaseError) {
            setFirebaseError(undefined);
        }
        if (!user) {
            return;
        }
        setLoading(true);
        try {
            const res = await validateCreateAuthor(authorForm);
            if (!res.result) {
                setErrors(res.errors);
            } else {
                const res = await AuthorService.create({ authorForm });
                if (res) {
                    setAuthors(
                        AuthorUtils.toAuthorSnippet({
                            id: res,
                            ...authorForm,
                        })
                    );
                    setAuthorForm(defaultAuthorForm);
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

    useEffect(() => {
        if (user) {
            setAuthorForm((prev) => ({
                ...prev,
                creatorId: user.uid,
            }));
        }
    }, [user]);

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
