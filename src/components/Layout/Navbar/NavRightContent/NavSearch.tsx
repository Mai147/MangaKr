import { routes } from "@/constants/routes";
import { InputGroup, InputLeftElement, Input } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useRef } from "react";
import { FiSearch } from "react-icons/fi";

type NavSearchProps = {};

const NavSearch: React.FC<NavSearchProps> = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const rounter = useRouter();
    return (
        <InputGroup>
            <InputLeftElement
                pointerEvents="none"
                children={<FiSearch color="gray.300" />}
            />
            <Input
                type="text"
                placeholder="Tìm kiếm manga, tin tức..."
                ref={inputRef}
                onKeyUp={(event) => {
                    if (event.key === "Enter") {
                        if (inputRef.current) {
                            rounter.push(
                                `${routes.getSearchPage()}?q=${
                                    inputRef.current.value
                                }`
                            );
                            inputRef.current.blur();
                        }
                    }
                }}
            />
        </InputGroup>
    );
};
export default NavSearch;
