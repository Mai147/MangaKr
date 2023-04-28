import InputField from "@/components/Input/InputField";
import InputText from "@/components/Input/InputText";
import ErrorText from "@/components/Modal/Auth/ErrorText";
import { routes } from "@/constants/routes";
import { toastOption } from "@/constants/toast";
import { ValidationError } from "@/constants/validation";
import useAuth from "@/hooks/useAuth";
import { defaultGenreForm, Genre } from "@/models/Genre";
import GenreService from "@/services/GenreService";
import { validateCreateGenre } from "@/validation/genreValidation";
import { Divider, Flex, useToast, VStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import FormFooter from "../Footer";
import FormHeader from "../Header";

type GenreFormProps = {
    genre?: Genre;
};

const GenreForm: React.FC<GenreFormProps> = ({ genre }) => {
    const { user } = useAuth();
    const [genreForm, setGenreForm] = useState<Genre>(defaultGenreForm);
    const [errors, setErrors] = useState<ValidationError[]>([]);
    const toast = useToast();

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

    const onSubmit = async () => {
        try {
            if (errors.length > 0) {
                setErrors([]);
            }
            if (!user) {
                return;
            }
            const res = await validateCreateGenre(genreForm, genre?.name);
            if (!res.result) {
                setErrors(res.errors);
                toast({
                    ...toastOption,
                    title: "Có lỗi xảy ra! Vui lòng thử lại.",
                    status: "error",
                });
                return;
            }
            if (!genre) {
                await GenreService.create({ genreForm });
                setGenreForm({
                    ...defaultGenreForm,
                    creatorId: user.uid,
                    creatorDisplayName: user.displayName!,
                });
                toast({
                    ...toastOption,
                    title: !genre
                        ? "Tạo thể loại thành công"
                        : "Sửa thể loại thành công",
                    status: "success",
                });
            } else {
                await GenreService.update({ genreForm });
                toast({
                    ...toastOption,
                    title: "Sửa thành công!",
                    status: "success",
                });
            }
        } catch (error) {
            toast({
                ...toastOption,
                title: "Có lỗi xảy ra! Vui lòng thử lại",
                status: "error",
            });
            console.log(error);
        }
    };

    useEffect(() => {
        if (user) {
            setGenreForm((prev) => ({
                ...prev,
                creatorId: user.uid,
                creatorDisplayName: user.displayName!,
            }));
        }
    }, [user]);

    useEffect(() => {
        if (genre) {
            setGenreForm(genre);
        }
    }, []);

    return (
        <Flex
            direction="column"
            bg="white"
            borderRadius={4}
            mt={2}
            flexGrow={1}
        >
            <Flex direction="column" flexGrow={1}>
                <FormHeader
                    title={!genre ? "Tạo thể loại" : "Sửa thể loại"}
                    backTitle={"Quay lại"}
                    backHref={routes.getWriterPage()}
                />
                <Divider my={4} />
                <Flex align="flex-start" flexGrow={1} direction="column">
                    <VStack align="flex-start" w="100%">
                        <InputField label="Tên thể loại" required>
                            <Flex
                                direction="column"
                                flexGrow={1}
                                w="100%"
                                align="flex-start"
                            >
                                <InputText
                                    name="name"
                                    onInputChange={onChange}
                                    value={genreForm.name}
                                    required
                                    type="text"
                                />
                                <ErrorText
                                    error={
                                        errors.find(
                                            (error) => error.field === "name"
                                        )?.message
                                    }
                                />
                            </Flex>
                        </InputField>
                        <InputField label="Mô tả:" required>
                            <Flex
                                direction="column"
                                flexGrow={1}
                                w="100%"
                                align="flex-start"
                            >
                                <InputText
                                    name="description"
                                    onInputChange={onChange}
                                    value={genreForm.description}
                                    required
                                    type="text"
                                    isMultipleLine
                                    flexGrow={1}
                                />
                                <ErrorText
                                    error={
                                        errors.find(
                                            (error) =>
                                                error.field === "description"
                                        )?.message
                                    }
                                />
                            </Flex>
                        </InputField>
                    </VStack>
                </Flex>
                <FormFooter onSubmit={onSubmit} />
            </Flex>
        </Flex>
    );
};
export default GenreForm;
