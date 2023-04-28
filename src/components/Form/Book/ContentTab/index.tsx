import InputField from "@/components/Input/InputField";
import { Box, Spinner, VStack } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import React, { useState } from "react";

type BookFormContentTabProps = {
    plot: string;
    characterContent: string;
    onChange: (data: string, field: string) => void;
};

const Editor = dynamic(() => import("@/components/Editor"), {
    ssr: false,
});

const BookFormContentTab: React.FC<BookFormContentTabProps> = ({
    plot,
    characterContent,
    onChange,
}) => {
    const [ckeditorLoading, setCkeditorLoading] = useState<boolean[]>([
        true,
        true,
    ]);
    return (
        <VStack spacing={2} align="flex-start" w="100%">
            <InputField label="Tóm tắt nội dung:">
                <Box flexGrow={1} w={{ base: "100%", md: "auto" }}>
                    {ckeditorLoading[0] && <Spinner />}
                    <Editor
                        height="500px"
                        value={plot}
                        onChange={(data) => onChange(data, "plot")}
                        setLoading={(value) => {
                            setCkeditorLoading((prev) => [value, prev[1]]);
                        }}
                    />
                </Box>
            </InputField>
            <InputField label="Tóm tắt nhân vật:">
                {ckeditorLoading[1] && <Spinner />}
                <Box flexGrow={1} w={{ base: "100%", md: "auto" }}>
                    <Editor
                        value={characterContent}
                        onChange={(data) => onChange(data, "characters")}
                        height="500px"
                        setLoading={(value) => {
                            setCkeditorLoading((prev) => [prev[0], value]);
                        }}
                    />
                </Box>
            </InputField>
        </VStack>
    );
};
export default BookFormContentTab;
