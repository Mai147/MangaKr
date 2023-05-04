import { Flex, Text } from "@chakra-ui/react";
import React from "react";

type BookDetailSidebarItemProps = {
    title: string;
    children: any;
};

const BookDetailSidebarItem: React.FC<BookDetailSidebarItemProps> = ({
    children,
    title,
}) => {
    return (
        <Flex
            align="flex-start"
            wordBreak={{ base: "normal", xl: "break-word" }}
        >
            <Text mr={2} fontWeight={500} flexShrink={{ base: 1, xl: 0 }}>
                {title}
            </Text>
            {children}
        </Flex>
    );
};
export default BookDetailSidebarItem;
