import { FIREBASE_ERRORS } from "@/firebase/errors";
import { Text } from "@chakra-ui/react";
import React from "react";

type ErrorTextProps = {
    error?: string;
    userError?: Error;
};

const ErrorText: React.FC<ErrorTextProps> = ({ error, userError }) => {
    return (
        <Text textAlign="center" color="red" fontSize="10pt">
            {error ||
                FIREBASE_ERRORS[
                    userError?.message as keyof typeof FIREBASE_ERRORS
                ]}
        </Text>
    );
};
export default ErrorText;
