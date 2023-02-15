import { Text } from "@chakra-ui/react";
import React from "react";

type InputLabelProps = {
    label?: string;
};

const InputLabel: React.FC<InputLabelProps> = ({ label }) => {
    return (
        <Text width={{ base: "100px", md: "145px", lg: "195px" }}>{label}</Text>
    );
};
export default InputLabel;
