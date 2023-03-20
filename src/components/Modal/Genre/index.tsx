import { UNKNOWN_ERROR } from "@/constants/errors";
import { firebaseRoute } from "@/constants/firebaseRoutes";
import { ValidationError } from "@/constants/validation";
import { fireStore } from "@/firebase/clientApp";
import useModal from "@/hooks/useModal";
import { Genre, GenreSnippet } from "@/models/Genre";
import ModelUtils from "@/utils/ModelUtils";
import { validateCreateGenre } from "@/validation/genreValidation";
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

type GenreModalProps = {
    setGenres: (value: GenreSnippet) => void;
};

const defaultGenreFormState: Genre = {
    name: "",
    description: "",
    numberOfBooks: 0,
};

const GenreModal: React.FC<GenreModalProps> = ({ setGenres }) => {
    const { view, isOpen, closeModal } = useModal();
    const [genreForm, setGenreForm] = useState<Genre>(defaultGenreFormState);
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
        try {
            setLoading(true);
            const valRes = await validateCreateGenre(genreForm);
            if (!valRes.result) {
                setErrors(valRes.errors);
            } else {
                const genresDocRef = collection(
                    fireStore,
                    firebaseRoute.getAllGenreRoute()
                );
                const res = await addDoc(genresDocRef, {
                    name: genreForm.name,
                    description: genreForm.description,
                    numberOfBooks: genreForm.numberOfBooks,
                });
                if (res) {
                    setGenres(
                        ModelUtils.toGenreSnippet({
                            id: res.id,
                            ...genreForm,
                        })
                    );
                    setGenreForm(defaultGenreFormState);
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
        setGenreForm(
            (prev) =>
                ({
                    ...prev,
                    [event.target.name]: event.target.value,
                } as Genre)
        );
    };

    return (
        <>
            <Modal
                isOpen={isOpen && view === "createGenre"}
                onClose={closeModal}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader textAlign={"center"}>Tạo thể loại</ModalHeader>
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
                                    placeholder="Tên thể loại"
                                    type="text"
                                    value={genreForm?.name}
                                    onChange={onChange}
                                />
                                <ErrorText
                                    error={
                                        errors.find(
                                            (err) => err.field === "name"
                                        )?.message
                                    }
                                />
                                <ModalInputItem
                                    required={true}
                                    name="description"
                                    placeholder="Mô tả"
                                    type="text"
                                    value={genreForm?.description}
                                    onChange={onChange}
                                    isMultipleLine={true}
                                />
                                <ErrorText
                                    error={
                                        errors.find(
                                            (err) => err.field === "description"
                                        )?.message
                                    }
                                />
                                <ErrorText
                                    error={
                                        errors.find(
                                            (err) => err.field === "all"
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
export default GenreModal;
