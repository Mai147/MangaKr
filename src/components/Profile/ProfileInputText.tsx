import {
    Flex,
    InputGroup,
    Input,
    InputRightElement,
    Text,
    Box,
    Textarea,
} from "@chakra-ui/react";
import React from "react";

type ProfileInputTextProps = {
    label: string;
    name: string;
    value: string;
    type?: string;
    required?: boolean;
    readonly?: boolean;
    isMultipleLine?: boolean;
    onChange: (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void;
};

const ProfileInputText: React.FC<ProfileInputTextProps> = ({
    label,
    name,
    value,
    required,
    readonly,
    type,
    isMultipleLine,
    onChange,
}) => {
    return (
        <Flex
            alignItems={{ base: "flex-start", md: "flex-end" }}
            py={2}
            direction={{ base: "column", md: "row" }}
        >
            <Text width={{ base: "150px", md: "200px", lg: "250px" }}>
                {label}
            </Text>
            <InputGroup>
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
                    />
                )}
                <InputRightElement display={required ? "flex" : "none"}>
                    <Text color="red" fontWeight={700}>
                        *
                    </Text>
                </InputRightElement>
            </InputGroup>
        </Flex>
    );
};
export default ProfileInputText;
