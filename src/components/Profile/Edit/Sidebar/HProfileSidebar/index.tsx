import { HStack, VStack } from "@chakra-ui/react";
import React from "react";
import { ProfileSidebarItemProps } from "..";
import HProfileSidebarItem from "./HProfileSidebarItem";

type HProfileSidebarProps = {
    list: ProfileSidebarItemProps[];
    tab: number;
    setTab: (value: number) => void;
};

const HProfileSidebar: React.FC<HProfileSidebarProps> = ({
    list,
    tab,
    setTab,
}) => {
    return (
        <HStack spacing={0} mb={4}>
            {list.map((item) => (
                <HProfileSidebarItem
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    icon={item.icon}
                    isActive={tab === item.id}
                    setTab={setTab}
                />
            ))}
        </HStack>
    );
};

export default HProfileSidebar;
