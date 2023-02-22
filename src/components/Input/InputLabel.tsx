import { Flex, Text } from "@chakra-ui/react";
import React from "react";

type InputLabelProps = {
    label?: string;
    isFull?: boolean;
    isHalf?: boolean;
    required?: boolean;
};

const InputLabel: React.FC<InputLabelProps> = ({
    label,
    isFull = true,
    isHalf,
    required = false,
}) => {
    return (
        <>
            {isFull && (
                <Flex
                    width={{ base: "100px", md: "145px", xl: "195px" }}
                    flexShrink={0}
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
                <Flex mr={{ md: 0, lg: 4 }} w={{ md: "145px", lg: "80px" }}>
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
