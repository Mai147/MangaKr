import type { ComponentStyleConfig } from "@chakra-ui/theme";

export const Button: ComponentStyleConfig = {
    baseStyle: {
        borderRadius: "12px",
        fontSize: "10pt",
        fontWeight: 700,
        _focus: {
            boxShadow: "none",
        },
        transition: "all 0.3s",
    },
    sizes: {
        sm: {
            fontSize: "8pt",
        },
        md: {
            fontSize: "10pt",
        },
    },
    variants: {
        solid: {
            color: "white",
            bg: "brand.100",
            _hover: {
                bg: "brand.400",
            },
        },
        outline: {
            color: "brand.100",
            border: "1px solid",
            borderColor: "brand.400",
            _hover: {
                bg: "gray.50",
            },
        },
        oauth: {
            height: "34px",
            border: "1px solid",
            borderColor: "gray.300",
            _hover: {
                bg: "gray.50",
            },
        },
    },
};
