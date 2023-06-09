import { Flex, Icon, Text } from "@chakra-ui/react";
import React from "react";
import { IconType } from "react-icons";

export type TabItem = {
    title: string;
    icon: IconType;
};

type TabItemProps = {
    item: TabItem;
    selected: boolean;
    setSelectedTab: (value: string) => void;
};

const TabItem: React.FC<TabItemProps> = ({
    item,
    selected,
    setSelectedTab,
}) => {
    return (
        <Flex
            justify="center"
            align="center"
            flexGrow={1}
            p={4}
            cursor="pointer"
            _hover={{ bg: "gray.50" }}
            color={selected ? "secondary.400" : "gray.500"}
            borderWidth={selected ? "0px 1px 2px 0" : "0px 1px 1px 0px"}
            borderBottomColor={selected ? "secondary.400" : "gray.300"}
            borderRightColor="gray.300"
            onClick={() => setSelectedTab(item.title)}
        >
            <Flex align="center" height="20px" mr={2}>
                <Icon as={item.icon} />
            </Flex>
            <Text fontSize="10pt" fontWeight={600}>
                {item.title}
            </Text>
        </Flex>
    );
};

export default TabItem;
