import InputText from "@/components/Input/InputText";
import ErrorText from "@/components/Modal/Auth/ErrorText";
import { ValidationError } from "@/constants/validation";
import { Box, Flex, Spinner, VStack } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import React, { useState } from "react";

type ReviewFormContentProps = {
    title: string;
    content: string;
    setTitle: (value: string) => void;
    setContent: (value: string) => void;
    errors: ValidationError[];
};

const Editor = dynamic(() => import("@/components/Editor"), {
    ssr: false,
});

const ReviewFormContent: React.FC<ReviewFormContentProps> = ({
    title,
    content,
    setTitle,
    setContent,
    errors,
}) => {
    const [loading, setLoading] = useState(false);
    return (
        <>
            {loading && <Spinner />}
            <VStack spacing={4} w="100%" align="flex-start">
                <VStack w="100%" align="flex-start" spacing={1}>
                    <InputText
                        value={title}
                        name="title"
                        placeholder="Tên bài viết"
                        onInputChange={(event) => setTitle(event.target.value)}
                    />
                    <ErrorText
                        error={
                            errors.find((err) => err.field === "title")?.message
                        }
                    />
                </VStack>
                <VStack w="100%" align="flex-start" spacing={1}>
                    <Box w="100%">
                        <Editor
                            value={content}
                            onChange={(data) => {
                                setContent(data);
                            }}
                            height="500px"
                            setLoading={(value) => {
                                setLoading(value);
                            }}
                        />
                    </Box>
                    <ErrorText
                        error={
                            errors.find((err) => err.field === "content")
                                ?.message
                        }
                    />
                </VStack>
            </VStack>
        </>
    );
};
export default ReviewFormContent;
