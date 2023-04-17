import { VStack, Divider, Button } from "@chakra-ui/react";
import React, { useState } from "react";

type FormFooterProps = {
    onSubmit: () => Promise<void>;
};

const FormFooter: React.FC<FormFooterProps> = ({ onSubmit }) => {
    const [loading, setLoading] = useState(false);
    return (
        <VStack>
            <Divider my={4} borderColor="gray.400" />
            <Button
                w={28}
                ml={8}
                alignSelf="flex-end"
                isLoading={loading}
                onClick={async () => {
                    setLoading(true);
                    await onSubmit();
                    setLoading(false);
                }}
            >
                Lưu
            </Button>
        </VStack>
    );
};
export default FormFooter;
