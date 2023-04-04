import { Flex, HStack, Text } from "@chakra-ui/react";
import React from "react";

export type TableInfoHeader = {
    title: string;
    width?: string;
    isCenter?: boolean;
};

type TableHeaderProps = {
    list: TableInfoHeader[];
};

const TableHeader: React.FC<TableHeaderProps> = ({ list }) => {
    return (
        <HStack spacing={4} flexGrow={1} w="100%" p={4} fontWeight={500}>
            {list.map((item) =>
                item.isCenter ? (
                    <Flex
                        key={item.title}
                        w={item.width}
                        flexShrink={0}
                        align="center"
                        justify="center"
                    >
                        <Text>{item.title}</Text>
                    </Flex>
                ) : (
                    <Text w={item.width} flexShrink={0} key={item.title}>
                        {item.title}
                    </Text>
                )
            )}
        </HStack>
    );
};
export default TableHeader;
