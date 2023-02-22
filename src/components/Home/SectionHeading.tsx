import { Flex, HStack, Icon, Link, Text } from "@chakra-ui/react";
import React from "react";
import { IoIosArrowForward } from "react-icons/io";

type SectionHeadingProps = {
    title: string;
    href?: string;
};

const SectionHeading: React.FC<SectionHeadingProps> = ({ title, href }) => {
    return (
        <Flex justify="space-between" w={"100%"} align="flex-end">
            <Text fontSize={24} fontWeight={600}>
                {title}
            </Text>
            <Link
                href={href}
                fontSize={20}
                fontStyle="italic"
                color="gray.400"
                _hover={{ textDecoration: "none", color: "brand.100" }}
                transition="all 0.3s"
            >
                <HStack spacing={2}>
                    <Text>Xem thêm</Text>
                    <Icon as={IoIosArrowForward} />
                </HStack>
            </Link>
        </Flex>
    );
};
export default SectionHeading;
