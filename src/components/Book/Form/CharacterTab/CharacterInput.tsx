import InputField from "@/components/Input/InputField";
import InputText from "@/components/Input/InputText";
import ErrorText from "@/components/Modal/Auth/ErrorText";
import { getRequiredError } from "@/constants/errors";
import { ValidationError } from "@/constants/validation";
import useBookCreate from "@/hooks/useBookCreate";
import useSelectFile from "@/hooks/useSelectFile";
import { Character } from "@/models/Character";
import {
    AspectRatio,
    Box,
    Button,
    Flex,
    HStack,
    Icon,
    Image,
    Spinner,
    VStack,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineUpload } from "react-icons/ai";
import { BiEditAlt } from "react-icons/bi";

type CharacterInputProps = {};

const Editor = dynamic(() => import("@/components/Editor"), {
    ssr: false,
});

const CharacterInput: React.FC<CharacterInputProps> = ({}) => {
    const imageRef = useRef<HTMLInputElement>(null);
    const { onSelectFile, selectedFile } = useSelectFile();
    const [ckeditorLoading, setCkeditorLoading] = useState(false);
    const { characterForm, setCharacterForm, handleAddCharacter } =
        useBookCreate();
    const [errors, setErrors] = useState<ValidationError[]>([]);

    useEffect(() => {
        setCharacterForm((prev) => ({
            ...prev,
            imageUrl: selectedFile,
        }));
    }, [selectedFile]);

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setCharacterForm(
            (prev) =>
                ({
                    ...prev,
                    [event.target.name]: event.target.value,
                } as Character)
        );
    };

    const validate = () => {
        if (errors) setErrors([]);
        if (!characterForm.name) {
            const error: ValidationError = {
                field: "name",
                message: getRequiredError("tên nhân vật"),
            };
            setErrors((prev) => [...prev, error]);
            return false;
        }
        return true;
    };

    return (
        <Flex
            w="100%"
            border="1px solid"
            borderColor="gray.200"
            borderRadius={4}
            p={4}
        >
            <Flex justify="center" flexShrink={0}>
                <VStack spacing={4} mr={8} top={4} align="stretch">
                    <AspectRatio w="150px" ratio={3 / 4}>
                        <Image src={selectedFile || "/images/noImage.jpg"} />
                    </AspectRatio>
                    <Button
                        variant="outline"
                        onClick={() => imageRef.current?.click()}
                    >
                        <Icon as={AiOutlineUpload} fontSize={20} />
                    </Button>
                    <input
                        type="file"
                        hidden
                        ref={imageRef}
                        onChange={onSelectFile}
                        accept="image/*"
                    />
                </VStack>
            </Flex>
            <VStack spacing={2} flexGrow={1} justify="space-between">
                <VStack spacing={2} w="100%">
                    <Flex direction={{ base: "column", lg: "row" }} w="100%">
                        <HStack spacing={4} flexGrow={1} align="flex-start">
                            <InputField
                                label="Tên nhân vật"
                                isFull={false}
                                isHalf={true}
                            >
                                <Flex
                                    direction="column"
                                    w="100%"
                                    align="flex-start"
                                >
                                    <InputText
                                        name="name"
                                        value={characterForm.name}
                                        onInputChange={handleChange}
                                        type="text"
                                    />
                                    <ErrorText
                                        error={
                                            errors.find(
                                                (err) => err.field === "name"
                                            )?.message
                                        }
                                    />
                                </Flex>
                            </InputField>
                            <InputField
                                label="Vai trò"
                                isFull={false}
                                isHalf={true}
                            >
                                <InputText
                                    name="role"
                                    value={characterForm.role}
                                    onInputChange={handleChange}
                                    type="text"
                                />
                            </InputField>
                        </HStack>
                    </Flex>
                    <InputField label="Mô tả nhân vật:">
                        <Box flexGrow={1} w={{ base: "100%", md: "auto" }}>
                            {ckeditorLoading && <Spinner />}
                            <Editor
                                value={characterForm?.bio}
                                onChange={(data) =>
                                    setCharacterForm(
                                        (prev) =>
                                            ({
                                                ...prev,
                                                bio: data,
                                            } as Character)
                                    )
                                }
                                setLoading={(value) => {
                                    setCkeditorLoading(value);
                                }}
                            />
                        </Box>
                    </InputField>
                </VStack>
                <Button
                    alignSelf="flex-end"
                    variant="outline"
                    w={28}
                    onClick={() => {
                        const res = validate();
                        if (res) {
                            handleAddCharacter();
                        }
                    }}
                >
                    <Icon as={BiEditAlt} fontSize={20} mr={1} />
                    Lưu
                </Button>
            </VStack>
        </Flex>
    );
};
export default CharacterInput;
