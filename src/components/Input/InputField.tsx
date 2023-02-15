import { Flex } from "@chakra-ui/react";
import React from "react";
import InputLabel from "./InputLabel";

type InputFieldProps = {
    label?: string;
    children: any;
};

const InputField: React.FC<InputFieldProps> = ({ label, children }) => {
    return (
        <Flex
            alignItems={{ base: "flex-start", md: "flex-end" }}
            py={2}
            direction={{ base: "column", md: "row" }}
        >
            <InputLabel label={label} />
            {children}
        </Flex>
    );
};
export default InputField;
