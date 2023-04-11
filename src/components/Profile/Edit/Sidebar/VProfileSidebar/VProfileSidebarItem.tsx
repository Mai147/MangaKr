import { Flex, Icon, Text } from "@chakra-ui/react";
import React from "react";
import { ItemProps } from "..";

const ProfileSidebarItem: React.FC<ItemProps> = ({
    id,
    title,
    icon,
    isActive,
    setTab,
}) => {
    return (
        <Flex
            width="100%"
            px={4}
            py={2}
            align="center"
            fontWeight={600}
            color={isActive ? "brand.100" : "gray.700"}
            _hover={{ color: "brand.400" }}
            cursor="pointer"
            transition="all 0.3s"
            onClick={() => {
                setTab(id);
            }}
        >
            <Icon as={icon} mr={2} />
            <Text>{title}</Text>
        </Flex>
    );
};
export default ProfileSidebarItem;
