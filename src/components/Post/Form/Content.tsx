import InputText from "@/components/Input/InputText";
import ErrorText from "@/components/Modal/Auth/ErrorText";
import { ValidationError } from "@/constants/validation";
import { Box, Spinner, VStack } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import React, { useState } from "react";

type PostFormContentProps = {
    caption: string;
    description: string;
    setCaption: (value: string) => void;
    setDescription: (value: string) => void;
    errors: ValidationError[];
};

const Editor = dynamic(() => import("@/components/Editor"), {
    ssr: false,
});

const PostFormContent: React.FC<PostFormContentProps> = ({
    caption,
    description,
    setCaption,
    setDescription,
    errors,
}) => {
    const [loading, setLoading] = useState(false);
    return (
        <>
            {loading && <Spinner />}
            <VStack spacing={4} w="100%" align="flex-start">
                <VStack w="100%" align="flex-start" spacing={1}>
                    <InputText
                        value={caption}
                        name="caption"
                        placeholder="Caption"
                        onInputChange={(event) =>
                            setCaption(event.target.value)
                        }
                    />
                    <ErrorText
                        error={
                            errors.find((err) => err.field === "caption")
                                ?.message
                        }
                    />
                </VStack>
                <VStack w="100%" align="flex-start" spacing={1}>
                    <Box w="100%">
                        <Editor
                            value={description}
                            onChange={(data) => {
                                setDescription(data);
                            }}
                            height="300px"
                            setLoading={(value) => {
                                setLoading(value);
                            }}
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
export default PostFormContent;
