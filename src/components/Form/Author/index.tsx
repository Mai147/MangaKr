import InputField from "@/components/Input/InputField";
import InputText from "@/components/Input/InputText";
import ErrorText from "@/components/Modal/Auth/ErrorText";
import { routes } from "@/constants/routes";
import { toastOption } from "@/constants/toast";
import { ValidationError } from "@/constants/validation";
import useAuth from "@/hooks/useAuth";
import useSelectFile from "@/hooks/useSelectFile";
import { Author, defaultAuthorForm } from "@/models/Author";
import AuthorService from "@/services/AuthorService";
import { validateCreateAuthor } from "@/validation/authorValidation";
import {
    Avatar,
    Box,
    Divider,
    Flex,
    Icon,
    Spinner,
    useToast,
    VStack,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import React, { useEffect, useRef, useState } from "react";
import { AiFillEdit } from "react-icons/ai";
import FormFooter from "../Footer";
import FormHeader from "../Header";

type AuthorFormProps = {
    author?: Author;
};

const Editor = dynamic(() => import("@/components/Editor"), {
    ssr: false,
});

const AuthorForm: React.FC<AuthorFormProps> = ({ author }) => {
    const { user } = useAuth();
    const [ckeditorLoading, setCkeditorLoading] = useState(false);
    const [authorForm, setAuthorForm] = useState<Author>(defaultAuthorForm);
    const [errors, setErrors] = useState<ValidationError[]>([]);
    const { selectedFile, onSelectFile, setSelectedFile } = useSelectFile();
    const selectedFileRef = useRef<HTMLInputElement>(null);
    const toast = useToast();

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

    const onSubmit = async () => {
        if (errors.length > 0) {
            setErrors([]);
        }
        if (!user) {
            return;
        }
        const res = await validateCreateAuthor(authorForm, author?.name);
        if (!res.result) {
            setErrors(res.errors);
            toast({
                ...toastOption,
                title: "Có lỗi xảy ra! Vui lòng thử lại.",
                status: "error",
            });
            return;
        }
        if (!author) {
            await AuthorService.create({ authorForm });
            setAuthorForm({
                ...defaultAuthorForm,
                creatorId: user.uid,
                creatorDisplayName: user.displayName!,
            });
            setSelectedFile(undefined);
            toast({
                ...toastOption,
                title: "Tạo tác giả thành công",
                status: "success",
            });
        } else {
            await AuthorService.update({ author, authorForm });
            toast({
                ...toastOption,
                title: "Sửa thành công!",
                status: "success",
            });
        }
    };

    useEffect(() => {
        if (user) {
            setAuthorForm((prev) => ({
                ...prev,
                creatorId: user.uid,
                creatorDisplayName: user.displayName!,
            }));
        }
    }, [user]);

    useEffect(() => {
        if (author) {
            setAuthorForm(author);
            if (author.imageUrl) {
                setSelectedFile(author.imageUrl);
            }
        }
    }, []);

    useEffect(() => {
        setAuthorForm((prev) => ({
            ...prev,
            imageUrl: selectedFile,
        }));
    }, [selectedFile]);

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
                    title={!author ? "Tạo tác giả" : "Sửa tác giả"}
                    backTitle={"Quay lại"}
                    backHref={routes.getWriterPage()}
                />
                <Divider my={4} />
                <Flex align="flex-start">
                    <Box
                        position="relative"
                        cursor="pointer"
                        onClick={() => {
                            selectedFileRef.current?.click();
                        }}
                        mr={8}
                    >
                        <Avatar size="2xl" src={selectedFile} />
                        <Flex
                            w="10"
                            h="10"
                            borderRadius="50%"
                            bg="gray.700"
                            border="3px solid white"
                            position="absolute"
                            bottom={-4}
                            left="50%"
                            translateX={"-50%"}
                            transform={"auto"}
                            align="center"
                            justify="center"
                        >
                            <Icon as={AiFillEdit} color="white" />
                        </Flex>
                        <input
                            type="file"
                            hidden
                            ref={selectedFileRef}
                            onChange={onSelectFile}
                            accept="image/*"
                        />
                    </Box>
                    <VStack align="flex-start" flexGrow={1}>
                        <InputField label="Tên tác giả" required>
                            <Flex
                                direction="column"
                                flexGrow={1}
                                w="100%"
                                align="flex-start"
                            >
                                <InputText
                                    name="name"
                                    onInputChange={onChange}
                                    value={authorForm.name}
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
                        <InputField label="Mô tả:">
                            <Box flexGrow={1} w={{ base: "100%", md: "auto" }}>
                                {ckeditorLoading && <Spinner />}
                                <Editor
                                    height="400px"
                                    value={authorForm.bio}
                                    onChange={(value) =>
                                        setAuthorForm((prev) => ({
                                            ...prev,
                                            bio: value,
                                        }))
                                    }
                                    setLoading={(value) =>
                                        setCkeditorLoading(value)
                                    }
                                />
                                <ErrorText
                                    error={
                                        errors.find(
                                            (error) => error.field === "bio"
                                        )?.message
                                    }
                                />
                            </Box>
                        </InputField>
                    </VStack>
                </Flex>
                <FormFooter onSubmit={onSubmit} />
            </Flex>
        </Flex>
    );
};
export default AuthorForm;
