import { Box, Flex, Link, Text } from "@chakra-ui/react";
import React from "react";

type BookDetailSectionProps = {
    title: string;
    children: any;
    seeMoreHref?: string;
};

const BookDetailSection: React.FC<BookDetailSectionProps> = ({
    children,
    title,
    seeMoreHref,
}) => {
    return (
        <Box>
            <Flex justify="space-between">
                <Text fontSize={24} fontWeight={600}>
                    {title}
                </Text>
                {seeMoreHref && (
                    <Link
                        href={seeMoreHref}
                        fontStyle="italic"
                        _hover={{ textDecoration: "none", color: "brand.100" }}
                    >
                        Xem thêm
                    </Link>
                )}
            </Flex>
            {children}
        </Box>
    );
};
export default BookDetailSection;
