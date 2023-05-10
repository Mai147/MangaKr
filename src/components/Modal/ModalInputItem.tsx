import {
    Input,
    InputGroup,
    InputRightElement,
    Textarea,
} from "@chakra-ui/react";
import React, { ReactNode } from "react";

type ModalInputItemProps = {
    required?: boolean;
    name?: string;
    placeholder?: string;
    type?: string;
    value?: string;
    onChange?: (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void;
    rightElement?: ReactNode;
    isInvalid?: boolean;
    isMultipleLine?: boolean;
};

const ModalInputItem: React.FC<ModalInputItemProps> = ({
    required,
    isInvalid,
    name,
    placeholder,
    type,
    value,
    onChange,
    rightElement,
    isMultipleLine,
}) => {
    return (
        <InputGroup>
            {isMultipleLine ? (
                <Textarea
                    required={required}
                    isInvalid={isInvalid}
                    name={name}
                    placeholder={placeholder}
                    mb={2}
                    value={value}
                    onChange={onChange}
                    fontSize="10pt"
                    _placeholder={{ color: "gray.500" }}
                    _hover={{
                        bg: "white",
                        border: "1px solid",
                        borderColor: "secondary.400",
                    }}
                    _focus={{
                        outline: "none",
                        bg: "white",
                        border: "1px solid",
                        borderColor: "secondary.400",
                    }}
                    bg="gray.50"
                    resize="none"
                />
            ) : (
                <Input
                    required={required}
                    isInvalid={isInvalid}
                    name={name}
                    placeholder={placeholder}
                    type={type}
                    mb={2}
                    value={value}
                    onChange={onChange}
                    fontSize="10pt"
                    _placeholder={{ color: "gray.500" }}
                    _hover={{
                        bg: "white",
                        border: "1px solid",
                        borderColor: "secondary.400",
                    }}
                    _focus={{
                        outline: "none",
                        bg: "white",
                        border: "1px solid",
                        borderColor: "secondary.400",
                    }}
                    bg="gray.50"
                />
            )}
            {rightElement && <InputRightElement children={rightElement} />}
        </InputGroup>
    );
};

export default ModalInputItem;
