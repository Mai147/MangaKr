import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import React, { ReactNode } from "react";

type AuthInputItemProps = {
    required?: boolean;
    name?: string;
    placeholder?: string;
    type?: string;
    value?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    rightElement?: ReactNode;
    isInvalid?: boolean;
};

const AuthInputItem: React.FC<AuthInputItemProps> = ({
    required,
    isInvalid,
    name,
    placeholder,
    type,
    value,
    onChange,
    rightElement,
}) => {
    return (
        <InputGroup>
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
                    borderColor: "blue.500",
                }}
                _focus={{
                    outline: "none",
                    bg: "white",
                    border: "1px solid",
                    borderColor: "blue.500",
                }}
                bg="gray.50"
            />
            {rightElement && <InputRightElement children={rightElement} />}
        </InputGroup>
    );
};

export default AuthInputItem;
