import { Flex, Icon, Text } from "@chakra-ui/react";
import React from "react";
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";

type PaginationProps = {
    page: number;
    setPage?: React.Dispatch<React.SetStateAction<number>>;
    totalPage: number;
    onNext: () => void;
    onPrev: () => void;
};

const Pagination: React.FC<PaginationProps> = ({
    onNext,
    onPrev,
    page,
    setPage,
    totalPage,
}) => {
    return (
        <Flex justify="center">
            <Flex w="fit-content" bg="white">
                {page > 1 && (
                    <Flex
                        w={10}
                        h={10}
                        justify="center"
                        align="center"
                        border="1px solid"
                        borderColor="gray.300"
                        borderTopLeftRadius={4}
                        borderBottomLeftRadius={4}
                        cursor="pointer"
                        _hover={{ bg: "gray.100", opacity: "0.95" }}
                        transition="all 0.3s"
                        onClick={() => {
                            setPage && setPage((prev) => prev - 1);
                            onPrev();
                        }}
                    >
                        <Icon as={MdArrowBackIosNew} fontSize={18} />
                    </Flex>
                )}
                {totalPage > 0 && (
                    <Flex
                        w={16}
                        h={10}
                        justify="center"
                        align="center"
                        border="1px solid"
                        borderColor="gray.300"
                    >
                        <Text fontWeight={500} fontSize={18} color="brand.100">
                            {page}/
                        </Text>
                        <Text color="gray.400" fontWeight={500} fontSize={18}>
                            {totalPage}
                        </Text>
                    </Flex>
                )}
                {page < totalPage && (
                    <Flex
                        w={10}
                        h={10}
                        justify="center"
                        align="center"
                        border="1px solid"
                        borderColor="gray.300"
                        borderTopRightRadius={4}
                        borderBottomRightRadius={4}
                        cursor="pointer"
                        _hover={{ bg: "gray.100", opacity: "0.95" }}
                        transition="all 0.3s"
                        onClick={() => {
                            setPage && setPage((prev) => prev + 1);
                            onNext();
                        }}
                    >
                        <Icon as={MdArrowForwardIos} fontSize={18} />
                    </Flex>
                )}
            </Flex>
        </Flex>
    );
};
export default Pagination;
