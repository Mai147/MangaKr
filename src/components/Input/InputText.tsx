import {
    InputGroup,
    Input,
    InputRightElement,
    Text,
    Textarea,
    FlexProps,
} from "@chakra-ui/react";
import React from "react";

interface InputTextProps extends FlexProps {
    name?: string;
    value?: string;
    type?: string;
    placeholder?: string;
    required?: boolean;
    readonly?: boolean;
    isMultipleLine?: boolean;
    height?: string;
    isInvalid?: boolean;
    onInputChange: (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void;
}

const InputText: React.FC<InputTextProps> = ({
    name,
    value,
    required,
    placeholder,
    readonly,
    type,
    isMultipleLine,
    height,
    isInvalid,
    onInputChange,
    ...rest
}) => {
    return (
        <InputGroup flexGrow={1} {...rest}>
            {isMultipleLine ? (
                <Textarea
                    isReadOnly={readonly}
                    required={required}
                    isInvalid={isInvalid}
                    borderColor="gray.400"
                    flexGrow={1}
                    h={height}
                    bg={readonly ? "gray.200" : undefined}
                    name={name}
                    value={value}
                    placeholder={placeholder}
                    resize="none"
                    onChange={onInputChange}
                />
            ) : (
                <Input
                    isReadOnly={readonly}
                    required={required}
                    isInvalid={isInvalid}
                    borderColor="gray.400"
                    flexGrow={1}
                    bg={readonly ? "gray.200" : undefined}
                    name={name}
                    type={type}
                    value={value}
                    placeholder={placeholder}
                    resize="none"
                    onChange={onInputChange}
                />
            )}
            {/* <InputRightElement display={required ? "flex" : "none"}>
                <Text color="red" fontWeight={700}>
                    *
                </Text>
            </InputRightElement> */}
        </InputGroup>
    );
};
export default InputText;
