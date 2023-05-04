import { Flex, HStack, Link, Text } from "@chakra-ui/react";
import React from "react";

type SectionHeadingProps = {
    title: string;
    href?: string;
};

const SectionHeading: React.FC<SectionHeadingProps> = ({ title, href }) => {
    return (
        <Flex
            justify="space-between"
            w={"100%"}
            align={{ base: "flex-start", sm: "flex-end" }}
            // px={{ base: 0, sm: 2 }}
            direction={{ base: "column", sm: "row" }}
        >
            <Text
                fontSize={{ base: 20, sm: 24 }}
                fontWeight={600}
                color="gray.700"
            >
                {title}
            </Text>
            {href && (
                <Link
                    href={href}
                    fontSize={16}
                    fontStyle="italic"
                    color="gray.400"
                    _hover={{ textDecoration: "none", color: "brand.100" }}
                    transition="all 0.3s"
                >
                    <HStack spacing={1}>
                        <Text>Xem thêm...</Text>
                        {/* <Icon as={IoIosArrowForward} /> */}
                    </HStack>
                </Link>
            )}
        </Flex>
    );
};
export default SectionHeading;
