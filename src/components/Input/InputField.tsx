import { Box, Flex } from "@chakra-ui/react";
import React from "react";
import InputLabel from "./InputLabel";

type InputFieldProps = {
    label?: string;
    children: any;
    isFull?: boolean;
    isHalf?: boolean;
    required?: boolean;
    maxWidth?: boolean;
};

const InputField: React.FC<InputFieldProps> = ({
    label,
    isFull,
    isHalf,
    children,
    required = false,
    maxWidth,
}) => {
    return (
        <Flex
            alignItems="flex-start"
            py={2}
            direction={{ base: "column", md: "row" }}
            flexGrow={1}
            w="100%"
        >
            <InputLabel
                label={label}
                isFull={isFull}
                isHalf={isHalf}
                required={required}
                maxWidth={maxWidth}
            />
            {children}
        </Flex>
    );
};
export default InputField;
