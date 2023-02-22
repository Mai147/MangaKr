import { Box, Text } from "@chakra-ui/react";
import React from "react";

type BookDetailSectionProps = {
    title: string;
    children: any;
};

const BookDetailSection: React.FC<BookDetailSectionProps> = ({
    children,
    title,
}) => {
    return (
        <Box>
            <Text fontSize={24} fontWeight={600}>
                {title}
            </Text>
            {children}
        </Box>
    );
};
export default BookDetailSection;
