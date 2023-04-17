import { Box } from "@chakra-ui/react";
import React from "react";
import { IconType } from "react-icons";
import { FiUser } from "react-icons/fi";
import { RiLockPasswordLine } from "react-icons/ri";
import { TbSettings } from "react-icons/tb";
import HProfileSidebar from "./HProfileSidebar";
import VProfileSidebar from "./VProfileSidebar";

export interface ProfileSidebarItemProps {
    id: number;
    title: string;
    icon: IconType;
}

export interface ItemProps extends ProfileSidebarItemProps {
    isActive?: boolean;
    setTab: (value: number) => void;
}

const profileSideBar: ProfileSidebarItemProps[] = [
    {
        id: 0,
        title: "Thông tin cá nhân",
        icon: FiUser,
    },
    {
        id: 1,
        title: "Mật khẩu",
        icon: RiLockPasswordLine,
    },
    {
        id: 2,
        title: "Cài đặt",
        icon: TbSettings,
    },
];

type ProfileSidebarProps = {
    tab: number;
    setTab: (value: number) => void;
};

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ tab, setTab }) => {
    return (
        <Box>
            <Box display={{ base: "none", md: "flex" }}>
                <VProfileSidebar
                    list={profileSideBar}
                    tab={tab}
                    setTab={setTab}
                />
            </Box>
            <Box display={{ base: "flex", md: "none" }} width="100%">
                <HProfileSidebar
                    list={profileSideBar}
                    tab={tab}
                    setTab={setTab}
                />
            </Box>
        </Box>
    );
};

export default ProfileSidebar;
