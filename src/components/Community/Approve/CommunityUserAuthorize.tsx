import ConfirmModal from "@/components/Modal/ConfirmModal";
import Pagination from "@/components/Pagination";
import UserHorizontalSnippetItem from "@/components/User/Snippet/UserHorizontalSnippetItem";
import { USER_PAGE_COUNT } from "@/constants/pagination";
import {
    CommunityRole,
    COMMUNITY_SUPER_ADMIN_ROLE,
    COMMUNITY_USER_ROLE,
} from "@/constants/roles";
import { COMMUNITY_PAGE } from "@/constants/routes";
import useAuth from "@/hooks/useAuth";
import useCommunity from "@/hooks/useCommunity";
import useDebounce from "@/hooks/useDebounce";
import useModal from "@/hooks/useModal";
import usePagination, {
    defaultPaginationInput,
    PaginationInput,
} from "@/hooks/usePagination";
import { Community } from "@/models/Community";
import { CommunityUserSnippet } from "@/models/User";
import CommunityService from "@/services/CommunityService";
import {
    Box,
    Button,
    Divider,
    Flex,
    HStack,
    Input,
    InputGroup,
    InputLeftElement,
    Link,
    Spinner,
    Text,
    VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import CommunityLeftSideBarAction from "../LeftSideBar/Action";
import CommunityUserSnippetAuthorizeItem from "./CommunityUserSnippetAuthorizeItem";

type CommunityUserAuthorizeProps = {
    community: Community;
};

interface CommunityUserPaginationInput extends PaginationInput {
    communityId: string;
    searchValue: string;
    reload: boolean;
}

const defaultCommunityUserPaginationInput: CommunityUserPaginationInput = {
    ...defaultPaginationInput,
    pageCount: USER_PAGE_COUNT,
    communityId: "",
    reload: false,
    searchValue: "",
};

type RoleInfo = {
    user: CommunityUserSnippet;
    role: CommunityRole;
    label: string;
};

const CommunityUserAuthorize: React.FC<CommunityUserAuthorizeProps> = ({
    community,
}) => {
    const { user } = useAuth();
    const [userPaginationInput, setUserPaginationInput] =
        useState<CommunityUserPaginationInput>(
            defaultCommunityUserPaginationInput
        );
    const [userList, setUserList] = useState<CommunityUserSnippet[]>([]);
    const [searchValue, setSearchValue] = useState("");
    const { getUsers } = usePagination();
    const debouncedSearch = useDebounce(searchValue, 300);
    const [selectedRole, setSelectedRole] = useState<RoleInfo | undefined>();
    const { toggleView, closeModal } = useModal();
    const { communityAction } = useCommunity();
    const router = useRouter();

    const getCommunityUsers = async () => {
        setUserPaginationInput((prev) => ({
            ...prev,
            loading: true,
        }));
        const res = await getUsers({
            ...userPaginationInput,
            page: userPaginationInput.reload ? 1 : userPaginationInput.page,
            isFirst: userPaginationInput.reload
                ? true
                : userPaginationInput.isFirst,
            communityId: community.id,
        });
        setUserList(res.users);
        setUserPaginationInput((prev) => ({
            ...prev,
            isFirst: false,
            loading: false,
            page: prev.reload ? 1 : prev.page,
            totalPage: res.totalPage || 0,
            reload: false,
        }));
    };

    const handleChangeRole = async () => {
        await CommunityService.changeUserRole({
            communityId: community.id!,
            userId: selectedRole?.user.id!,
            newRole: selectedRole?.role!,
        });
        if (selectedRole?.role === COMMUNITY_SUPER_ADMIN_ROLE) {
            await communityAction.toUserRole();
            closeModal();
            router.push(`${COMMUNITY_PAGE}/${community.id!}`);
            return;
        }
        setUserList((prev) =>
            prev.map((us) =>
                us.id !== selectedRole?.user.id
                    ? us
                    : {
                          ...us,
                          role: selectedRole.role,
                      }
            )
        );
        setSelectedRole(undefined);
        closeModal();
    };

    useEffect(() => {
        setUserPaginationInput((prev) => ({
            ...prev,
            page: 1,
            searchValue,
        }));
    }, [debouncedSearch]);

    useEffect(() => {
        getCommunityUsers();
    }, [userPaginationInput.page, userPaginationInput.searchValue]);

    return (
        <Flex direction="column" flexGrow={1} justify="space-between">
            <ConfirmModal
                title="Thêm cộng tác viên"
                content={`Bạn chắc chắn muốn thay đổi thành viên ${selectedRole?.user.displayName} thành vai trò ${selectedRole?.label}?`}
                subContent={
                    selectedRole?.role === COMMUNITY_SUPER_ADMIN_ROLE
                        ? "Bạn sẽ trở thành thành viên của cộng đồng sau khi thay đổi!"
                        : ""
                }
                status="info"
                onSubmit={handleChangeRole}
            />
            <VStack spacing={0} align="flex-start">
                <Box p={4} w="100%" fontSize={20} fontWeight={600}>
                    <Flex justify="space-between">
                        <Text>Thêm cộng tác viên</Text>
                        <HStack spacing={2} align="center">
                            <Link
                                href={`${COMMUNITY_PAGE}/${community.id!}`}
                                _hover={{ textDecoration: "none" }}
                            >
                                <Button>Quay lại cộng đồng</Button>
                            </Link>
                            <CommunityLeftSideBarAction />
                        </HStack>
                    </Flex>
                    <InputGroup mt={4}>
                        <InputLeftElement
                            pointerEvents="none"
                            children={<FiSearch color="gray.300" />}
                        />
                        <Input
                            type="text"
                            placeholder="Tìm kiếm thành viên..."
                            borderColor="gray.400"
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                    </InputGroup>
                </Box>
                <Divider borderColor="gray.300" />
                <HStack
                    spacing={4}
                    flexGrow={1}
                    w="100%"
                    p={4}
                    fontWeight={500}
                >
                    <Text w="100px" flexShrink={0}>
                        Avatar
                    </Text>
                    <Text w="200px" flexShrink={0}>
                        Tên
                    </Text>
                    <Text w="150px" flexShrink={0}>
                        Ngày yêu cầu
                    </Text>
                    <Flex
                        w="100px"
                        flexShrink={0}
                        align="center"
                        justify="center"
                    >
                        <Text>Trạng thái</Text>
                    </Flex>
                    <Flex flexGrow={1} align="center" justify="center">
                        <Text>Vai trò</Text>
                    </Flex>
                </HStack>
                <Divider borderColor="gray.300" />
                {userPaginationInput.loading ? (
                    <Flex align="center" justify="center" w="100%" p={10}>
                        <Spinner />
                    </Flex>
                ) : userList && userList.length > 0 ? (
                    userList.map((u) =>
                        u.role === COMMUNITY_SUPER_ADMIN_ROLE ||
                        u.id === user?.uid ? (
                            <Box key={u.id}></Box>
                        ) : (
                            <Box key={u.id} w="100%">
                                <CommunityUserSnippetAuthorizeItem
                                    user={u}
                                    onChangeRole={(user, role, label) => {
                                        setSelectedRole({
                                            user,
                                            label,
                                            role,
                                        });
                                        toggleView("confirmModal");
                                    }}
                                />
                                <Divider borderColor="gray.300" />
                            </Box>
                        )
                    )
                ) : (
                    <Flex align="center" justify="center" w="100%" py={10}>
                        <Text>Không có thành viên nào</Text>
                    </Flex>
                )}
            </VStack>
            <Flex align="center" py={6} justify="center" w="100%">
                <Pagination
                    page={userPaginationInput.page}
                    totalPage={userPaginationInput.totalPage}
                    onNext={() =>
                        setUserPaginationInput((prev) => ({
                            ...prev,
                            page: prev.page + 1,
                            isNext: true,
                        }))
                    }
                    onPrev={() =>
                        setUserPaginationInput((prev) => ({
                            ...prev,
                            page: prev.page - 1,
                            isNext: false,
                        }))
                    }
                />
            </Flex>
        </Flex>
    );
};
export default CommunityUserAuthorize;
