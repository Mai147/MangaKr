import { VStack } from "@chakra-ui/react";
import React from "react";
import { ProfileSidebarItemProps } from "..";
import VProfileSidebarItem from "./VProfileSidebarItem";

type ProfileSidebarProps = {
    list: ProfileSidebarItemProps[];
    tab: number;
    setTab: (value: number) => void;
};

const VProfileSidebar: React.FC<ProfileSidebarProps> = ({
    list,
    tab,
    setTab,
}) => {
    return (
        <VStack
            align="flex-start"
            bg="white"
            borderRadius={4}
            width={"250px"}
            py={2}
            mr={8}
        >
            {list.map((item) => (
                <VProfileSidebarItem
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    icon={item.icon}
                    setTab={setTab}
                    isActive={tab === item.id}
                />
            ))}
            ;
        </VStack>
    );
};

export default VProfileSidebar;
