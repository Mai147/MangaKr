import { Flex, HStack, ResponsiveValue, Text } from "@chakra-ui/react";
import React from "react";

export type TableInfoHeader = {
    title: string;
    width?: ResponsiveValue<string>;
    isCenter?: boolean;
    display?: ResponsiveValue<string>;
};

type TableHeaderProps = {
    list: TableInfoHeader[];
};

const TableHeader: React.FC<TableHeaderProps> = ({ list }) => {
    return (
        <HStack
            spacing={4}
            flexGrow={1}
            w={"100%"}
            p={{ base: 2, md: 4 }}
            py={4}
            fontWeight={500}
        >
            {list.map((item) =>
                item.isCenter ? (
                    <Flex
                        key={item.title}
                        w={item.width}
                        flexGrow={item.width ? undefined : 1}
                        flexShrink={0}
                        align="center"
                        justify="center"
                        display={item.display}
                    >
                        <Text>{item.title}</Text>
                    </Flex>
                ) : (
                    <Text
                        w={item.width}
                        flexShrink={0}
                        key={item.title}
                        flexGrow={item.width ? undefined : 1}
                        display={item.display}
                    >
                        {item.title}
                    </Text>
                )
            )}
        </HStack>
    );
};
export default TableHeader;
