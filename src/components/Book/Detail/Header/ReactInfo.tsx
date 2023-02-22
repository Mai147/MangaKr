import { Flex, Icon, Text } from "@chakra-ui/react";
import React from "react";
import { IconType } from "react-icons";

type ReactInfoProps = {
    title: string;
    value?: number;
    icon?: IconType;
    subChild?: any;
};

const ReactInfo: React.FC<ReactInfoProps> = ({
    icon,
    title,
    value,
    subChild,
}) => {
    return (
        <Flex align="center" ml={6}>
            <Text color="gray.600" fontSize={18} mr={2}>
                {value || 0} {title}
            </Text>
            {icon ? (
                <Icon as={icon} fontSize={20} color="gray.300" />
            ) : (
                subChild
            )}
        </Flex>
    );
};
export default ReactInfo;
