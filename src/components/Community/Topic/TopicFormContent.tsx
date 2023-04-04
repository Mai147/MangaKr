import InputText from "@/components/Input/InputText";
import ErrorText from "@/components/Modal/Auth/ErrorText";
import { ValidationError } from "@/constants/validation";
import { Box, Spinner, VStack } from "@chakra-ui/react";
import React, { useState } from "react";

type TopicFormContentProps = {
    title: string;
    description: string;
    setTitle: (value: string) => void;
    setDescription: (value: string) => void;
    errors: ValidationError[];
};

const TopicFormContent: React.FC<TopicFormContentProps> = ({
    title,
    description,
    setTitle,
    setDescription,
    errors,
}) => {
    const [loading, setLoading] = useState(false);
    return (
        <>
            {loading && <Spinner />}
            <VStack spacing={4} w="100%" align="flex-start" flexGrow={1}>
                <VStack w="100%" align="flex-start" spacing={1}>
                    <InputText
                        value={title}
                        name="title"
                        placeholder="Chủ đề"
                        onInputChange={(event) => setTitle(event.target.value)}
                    />
                    <ErrorText
                        error={
                            errors.find((err) => err.field === "caption")
                                ?.message
                        }
                    />
                </VStack>
                <VStack w="100%" align="flex-start" spacing={1} flexGrow={1}>
                    <Box w="100%" flexGrow={1}>
                        <InputText
                            value={description}
                            name="description"
                            placeholder="Mô tả"
                            onInputChange={(event) =>
                                setDescription(event.target.value)
                            }
                            isMultipleLine
                            height="200px"
                        />
                    </Box>
                    <ErrorText
                        error={
                            errors.find((err) => err.field === "description")
                                ?.message
                        }
                    />
                </VStack>
            </VStack>
        </>
    );
};
export default TopicFormContent;
