import {
    InputGroup,
    Input,
    InputRightElement,
    Text,
    Textarea,
} from "@chakra-ui/react";
import React from "react";

type InputTextProps = {
    name?: string;
    value?: string;
    type?: string;
    required?: boolean;
    readonly?: boolean;
    isMultipleLine?: boolean;
    height?: string;
    onChange: (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void;
};

const InputText: React.FC<InputTextProps> = ({
    name,
    value,
    required,
    readonly,
    type,
    isMultipleLine,
    height,
    onChange,
}) => {
    return (
        <InputGroup flexGrow={1} width={{ base: "100%", md: 0 }}>
            {isMultipleLine ? (
                <Textarea
                    isReadOnly={readonly}
                    required={required}
                    borderColor="gray.400"
                    flexGrow={1}
                    name={name}
                    value={value}
                    resize="none"
                    onChange={onChange}
                    h={height}
                    bg="white"
                />
            ) : (
                <Input
                    isReadOnly={readonly}
                    required={required}
                    borderColor="gray.400"
                    flexGrow={1}
                    name={name}
                    type={type}
                    value={value}
                    resize="none"
                    onChange={onChange}
                    bg="white"
                />
            )}
            <InputRightElement display={required ? "flex" : "none"}>
                <Text color="red" fontWeight={700}>
                    *
                </Text>
            </InputRightElement>
        </InputGroup>
    );
};
export default InputText;
