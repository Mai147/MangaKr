import { MenuItem, Icon } from "@chakra-ui/react";
import React from "react";
import { IconType } from "react-icons";

type NavUserMenuItemProps = {
    icon: IconType;
    title: string;
    href?: string;
    onClick?: (event: React.MouseEvent) => void;
};

const NavUserMenuItem: React.FC<NavUserMenuItemProps> = ({
    icon,
    title,
    href,
    onClick,
}) => {
    return (
        <MenuItem
            onClick={onClick}
            display="flex"
            alignItems="center"
            as="a"
            href={href}
            cursor="pointer"
        >
            <Icon as={icon} fontSize={20} mr={2} />
            {title}
        </MenuItem>
    );
};
export default NavUserMenuItem;
