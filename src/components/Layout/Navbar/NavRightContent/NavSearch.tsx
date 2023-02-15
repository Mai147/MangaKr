import { InputGroup, InputLeftElement, Input } from "@chakra-ui/react";
import React from "react";
import { FiSearch } from "react-icons/fi";

type NavSearchProps = {};

const NavSearch: React.FC<NavSearchProps> = () => {
    return (
        <InputGroup>
            <InputLeftElement
                pointerEvents="none"
                children={<FiSearch color="gray.300" />}
            />
            <Input type="text" placeholder="Find book..." />
        </InputGroup>
    );
};
export default NavSearch;
