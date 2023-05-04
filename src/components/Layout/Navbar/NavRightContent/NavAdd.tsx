import { WRITER_ROLE } from "@/constants/roles";
import { routes } from "@/constants/routes";
import useAuth from "@/hooks/useAuth";
import useModal from "@/hooks/useModal";
import { Stack } from "@chakra-ui/react";
import React from "react";
import { AiOutlineTags } from "react-icons/ai";
import { BsFillFileEarmarkPostFill } from "react-icons/bs";
import { FiBook } from "react-icons/fi";
import { HiOutlineUserGroup } from "react-icons/hi";
import { IoPersonOutline } from "react-icons/io5";
import NavItem, { NavItemProps } from "../NavItem";

type NavAddProps = {};

const defaultNavList: NavItemProps[] = [
    {
        label: "Tạo cộng đồng",
        leftIcon: HiOutlineUserGroup,
        onClick: () => {},
    },
    {
        label: "Tạo bài viết",
        leftIcon: BsFillFileEarmarkPostFill,
        href: routes.getPostCreatePage(),
    },
];

const writerNavList: NavItemProps[] = [
    {
        label: "Thêm tác giả",
        leftIcon: IoPersonOutline,
        href: routes.getAuthorCreatePage(),
        divider: true,
    },
    {
        label: "Thêm thể loại",
        leftIcon: AiOutlineTags,
        href: routes.getGenreCreatePage(),
    },
    {
        label: "Viết Manga",
        leftIcon: FiBook,
        href: routes.getBookCreatePage(),
    },
    // {
    //     label: "Viết tin tức",
    //     leftIcon: AiOutlineTags,
    //     // href: `${GENRE_PAGE}/create`,
    // },
];

const NavAdd: React.FC<NavAddProps> = () => {
    const { user } = useAuth();
    const { toggleView } = useModal();
    return (
        <Stack>
            {defaultNavList.map((item, idx) => {
                return (
                    <NavItem
                        key={item.label}
                        {...item}
                        onClick={
                            idx === 0
                                ? () => toggleView("createCommunity")
                                : undefined
                        }
                    />
                );
            })}
            {user && user.role === WRITER_ROLE && (
                <>
                    {writerNavList.map((item) => (
                        <NavItem key={item.label} {...item} />
                    ))}
                </>
            )}
        </Stack>
    );
};
export default NavAdd;
