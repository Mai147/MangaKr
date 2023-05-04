import { Flex, Text } from "@chakra-ui/react";
import React from "react";

type InputLabelProps = {
    label?: string;
    isFull?: boolean;
    isHalf?: boolean;
    required?: boolean;
    maxWidth?: boolean;
};

const InputLabel: React.FC<InputLabelProps> = ({
    label,
    isFull = true,
    isHalf,
    required = false,
    maxWidth = true,
}) => {
    return (
        <>
            {isFull && (
                <Flex
                    width={
                        maxWidth
                            ? { base: "130px", md: "150px", xl: "170px" }
                            : "auto"
                    }
                    flexShrink={0}
                    mb={{ base: 2, md: 0 }}
                >
                    <Text>{label}</Text>
                    {required && (
                        <Text color="red" ml={2}>
                            *
                        </Text>
                    )}
                </Flex>
            )}
            {isHalf && (
                <Flex
                    mr={{ md: 0, lg: 4 }}
                    w={maxWidth ? { md: "145px", lg: "80px" } : "auto"}
                    mb={{ base: 2, md: 0 }}
                >
                    <Text>{label}</Text>
                    {required && (
                        <Text color="red" ml={2}>
                            *
                        </Text>
                    )}
                </Flex>
            )}
        </>
    );
};
export default InputLabel;
