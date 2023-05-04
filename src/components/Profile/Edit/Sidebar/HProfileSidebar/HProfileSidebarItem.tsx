import TabItem from "@/components/Tab/TabItem";
import { Box, Flex, Icon, Text, VStack } from "@chakra-ui/react";
import React from "react";
import { ItemProps } from "..";

const HProfileSidebarItem: React.FC<ItemProps> = ({
    id,
    title,
    icon,
    isActive,
    setTab,
}) => {
    return (
        <Flex
            alignItems="center"
            px={{ base: 6, md: 2 }}
            py={2}
            borderBottom="3px solid"
            borderColor={isActive ? "brand.100" : "gray.300"}
            color={isActive ? "brand.100" : "gray.700"}
            fontWeight={600}
            cursor="pointer"
            transition="all 0.3s"
            onClick={() => {
                setTab(id);
            }}
        >
            <Icon as={icon} fontSize={{ base: 24, md: 20 }} />
            <Text ml={2} display={{ base: "none", sm: "unset" }}>
                {title}
            </Text>
        </Flex>
    );
};
export default HProfileSidebarItem;
