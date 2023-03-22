import InputField from "@/components/Input/InputField";
import InputText from "@/components/Input/InputText";
import ErrorText from "@/components/Modal/Auth/ErrorText";
import { firebaseRoute } from "@/constants/firebaseRoutes";
import { ValidationError } from "@/constants/validation";
import { fireStore, storage } from "@/firebase/clientApp";
import useAuth from "@/hooks/useAuth";
import useSelectFile from "@/hooks/useSelectFile";
import { Author, defaultAuthorForm } from "@/models/Author";
import { validateCreateAuthor } from "@/validation/authorValidation";
import {
    Avatar,
    Box,
    Button,
    Divider,
    Flex,
    Icon,
    Spinner,
    Text,
    useToast,
    VStack,
} from "@chakra-ui/react";
import { collection, doc, writeBatch } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import dynamic from "next/dynamic";
import React, { useEffect, useRef, useState } from "react";
import { AiFillEdit } from "react-icons/ai";

type AuthorFormProps = {
    author?: Author;
};

const Editor = dynamic(() => import("@/components/Editor"), {
    ssr: false,
});

const AuthorForm: React.FC<AuthorFormProps> = ({ author }) => {
    const { user } = useAuth();
    const [ckeditorLoading, setCkeditorLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [authorForm, setAuthorForm] = useState<Author>(defaultAuthorForm);
    const [errors, setErrors] = useState<ValidationError[]>([]);
    const { selectedFile, onSelectFile, onUploadFile, setSelectedFile } =
        useSelectFile();
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
        setLoading(true);
        if (errors.length > 0) {
            setErrors([]);
        }
        if (!user) {
            return;
        }
        if (author) {
            await onUpdate();
        } else {
            await onCreate();
        }
        setLoading(false);
    };

    const onCreate = async () => {
        try {
            const res = await validateCreateAuthor(authorForm);
            if (!res.result) {
                setErrors(res.errors);
                toast({
                    title: "Có lỗi xảy ra! Vui lòng thử lại.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "top-right",
                });
                setLoading(false);
                return;
            } else {
                const batch = writeBatch(fireStore);
                const authorsDocRef = doc(
                    collection(fireStore, firebaseRoute.getAllAuthorRoute())
                );
                const authorImageUrl = await onUploadFile(
                    firebaseRoute.getAuthorImageRoute(authorsDocRef.id)
                );
                const nameLowerCase = authorForm.name.toLowerCase();
                batch.set(authorsDocRef, {
                    name: authorForm.name,
                    bio: authorForm.bio,
                    creatorId: authorForm.creatorId,
                    nameLowerCase,
                    numberOfBooks: authorForm.numberOfBooks,
                    numberOfLikes: authorForm.numberOfLikes,
                    numberOfDislikes: authorForm.numberOfDislikes,
                });
                if (authorImageUrl) {
                    batch.update(authorsDocRef, {
                        imageUrl: authorImageUrl,
                    });
                }
                await batch.commit();
                setAuthorForm(defaultAuthorForm);
                setSelectedFile(undefined);
                toast({
                    title: "Tạo tác giả thành công",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "top-right",
                });
            }
        } catch (error: any) {
            console.log(error);
        }
    };

    const onUpdate = async () => {
        try {
            const res = await validateCreateAuthor(authorForm, author?.name);
            if (!res.result) {
                setErrors(res.errors);
                toast({
                    title: "Có lỗi xảy ra! Vui lòng thử lại.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "top-right",
                });
                setLoading(false);
                return;
            } else {
                const batch = writeBatch(fireStore);
                const authorDocRef = doc(
                    fireStore,
                    firebaseRoute.getAllAuthorRoute(),
                    author?.id!
                );
                let authorImageUrl;
                if (
                    authorForm.imageUrl &&
                    authorForm.imageUrl !== author?.imageUrl
                ) {
                    authorImageUrl = await onUploadFile(
                        firebaseRoute.getAuthorImageRoute(author?.id!)
                    );
                } else if (!authorForm.imageUrl && author?.imageUrl) {
                    const imageRef = ref(
                        storage,
                        firebaseRoute.getAuthorImageRoute(author.id!)
                    );
                    await deleteObject(imageRef);
                }
                const nameLowerCase = authorForm.name.toLowerCase();
                batch.update(authorDocRef, {
                    ...authorForm,
                    nameLowerCase,
                });
                // Update image
                if (authorForm.imageUrl !== author?.imageUrl) {
                    batch.update(
                        doc(
                            fireStore,
                            firebaseRoute.getAllAuthorRoute(),
                            author?.id!
                        ),
                        {
                            imageUrl: authorImageUrl,
                        }
                    );
                }
                await batch.commit();
                toast({
                    title: "Sửa thành công!",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "top-right",
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (user) {
            setAuthorForm((prev) => ({
                ...prev,
                creatorId: user.uid,
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
        <Flex direction="column">
            <Flex>
                <Text fontSize={24} fontWeight={600}>
                    Tạo tác giả
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
                        w="8"
                        h="8"
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
                                height="500px"
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
        </Flex>
    );
};
export default AuthorForm;
