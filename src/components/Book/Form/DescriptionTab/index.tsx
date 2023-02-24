import InputField from "@/components/Input/InputField";
import InputText from "@/components/Input/InputText";
import ErrorText from "@/components/Modal/Auth/ErrorText";
import { ValidationError } from "@/constants/validation";
import { Flex, VStack } from "@chakra-ui/react";
import React from "react";

type BookFormDescriptionTabProps = {
    bookName: string;
    description: string;
    errors: ValidationError[];
    onChange: (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void;
};

const BookFormDescriptionTab: React.FC<BookFormDescriptionTabProps> = ({
    bookName,
    description,
    onChange,
    errors,
}) => {
    return (
        <VStack spacing={4} w="100%" align="flex-start">
            <InputField label="Tên Manga" required>
                <Flex
                    direction="column"
                    flexGrow={1}
                    w="100%"
                    align="flex-start"
                >
                    <InputText
                        name="name"
                        onInputChange={onChange}
                        value={bookName}
                        required
                        type="text"
                    />
                    <ErrorText
                        error={
                            errors.find((error) => error.field === "name")
                                ?.message
                        }
                    />
                </Flex>
            </InputField>
            <InputField label="Mô tả">
                <Flex
                    direction="column"
                    flexGrow={1}
                    w="100%"
                    align="flex-start"
                >
                    <InputText
                        name="description"
                        onInputChange={onChange}
                        value={description}
                        isMultipleLine
                        type="text"
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
    );
};
export default BookFormDescriptionTab;
