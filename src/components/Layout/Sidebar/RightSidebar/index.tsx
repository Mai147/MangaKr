import { Book } from "@/models/Book";
import { Box, Flex, Icon, Text } from "@chakra-ui/react";
import React from "react";
import { IoStar, IoStarHalf, IoStarOutline } from "react-icons/io5";
import RightSidebarItem from "./RightSidebarItem";

type RightSidebarProps = {
    books?: Book[];
};

const RightSidebar: React.FC<RightSidebarProps> = ({ books }) => {
    return (
        <Flex direction="column">
            <Box
                borderTopLeftRadius={8}
                borderTopRightRadius={8}
                bg="brand.100"
                px={4}
                py={2}
            >
                <Text color="white">Top book</Text>
            </Box>
            {/* <Box
                borderBottomLeftRadius={8}
                borderBottomRightRadius={8}
                bg="white"
                p={2}
            >
                {books.map((book) => (
                    <RightSidebarItem
                        key={book.id}
                        title={book.name}
                        imageUrl={book.imageUrl}
                        sub={<BookRatingBar rate={book.rating / 2} readonly />}
                    />
                ))}
            </Box> */}
        </Flex>
    );
};

export default RightSidebar;
