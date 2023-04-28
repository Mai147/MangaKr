import { Box, Flex, Icon } from "@chakra-ui/react";
import { MultiSelect, Option } from "chakra-multiselect";
import React from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";

type SelectFieldProps = {
    options?: any[];
    value: string[];
    onChange: (data: any) => void;
    onAdd?: () => void;
};

const SelectField: React.FC<SelectFieldProps> = ({
    options,
    value,
    onChange,
    onAdd,
}) => {
    return (
        <Flex flexGrow={1} alignItems="center" w={{ base: "100%", md: "auto" }}>
            <Box flexGrow={1}>
                <MultiSelect
                    options={options?.map(
                        (option) =>
                            ({
                                label: option.name,
                                value: option.name,
                            } as Option)
                    )}
                    value={value}
                    onChange={onChange}
                />
            </Box>
            <Icon
                as={AiOutlinePlusCircle}
                fontSize={36}
                color="brand.400"
                ml={2}
                cursor="pointer"
                onClick={onAdd}
            />
        </Flex>
    );
};
export default SelectField;
