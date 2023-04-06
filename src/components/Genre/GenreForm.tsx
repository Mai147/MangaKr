import InputField from "@/components/Input/InputField";
import InputText from "@/components/Input/InputText";
import ErrorText from "@/components/Modal/Auth/ErrorText";
import { toastOption } from "@/constants/toast";
import { ValidationError } from "@/constants/validation";
import useAuth from "@/hooks/useAuth";
import { defaultGenreForm, Genre } from "@/models/Genre";
import GenreService from "@/services/GenreService";
import { validateCreateGenre } from "@/validation/genreValidation";
import {
    Button,
    Divider,
    Flex,
    Text,
    useToast,
    VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

type GenreFormProps = {
    genre?: Genre;
};

const GenreForm: React.FC<GenreFormProps> = ({ genre }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
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
            setLoading(true);
            if (errors.length > 0) {
                setErrors([]);
            }
            if (!user) {
                setLoading(false);
                return;
            }
            const res = await validateCreateGenre(genreForm);
            if (!res.result) {
                setErrors(res.errors);
                toast({
                    ...toastOption,
                    title: "Có lỗi xảy ra! Vui lòng thử lại.",
                    status: "error",
                });
                setLoading(false);
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
            setLoading(false);
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
        <Flex direction="column">
            <Flex>
                <Text fontSize={24} fontWeight={600}>
                    {!genre ? "Tạo thể loại" : "Sửa thể loại"}
                </Text>
                <Button
                    w={28}
                    ml={8}
                    isLoading={loading}
                    onClick={async () => {
                        setLoading(true);
                        await onSubmit();
                        setLoading(false);
                    }}
                >
                    Lưu
                </Button>
            </Flex>
            <Divider my={4} />
            <Flex align="flex-start">
                <VStack align="flex-start" flexGrow={1}>
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
                            />
                            <ErrorText
                                error={
                                    errors.find(
                                        (error) => error.field === "description"
                                    )?.message
                                }
                            />
                        </Flex>
                    </InputField>
                </VStack>
            </Flex>
        </Flex>
    );
};
export default GenreForm;
