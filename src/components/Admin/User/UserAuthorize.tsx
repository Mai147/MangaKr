import ConfirmModal from "@/components/Modal/ConfirmModal";
import Pagination from "@/components/Pagination";
import TableHeader, { TableInfoHeader } from "@/components/Table/TableHeader";
import { USER_PAGE_COUNT } from "@/constants/pagination";
import { ADMIN_ROLE, Role } from "@/constants/roles";
import { routes } from "@/constants/routes";
import useAuth from "@/hooks/useAuth";
import useDebounce from "@/hooks/useDebounce";
import useModal from "@/hooks/useModal";
import usePagination, {
    defaultPaginationInput,
    defaultPaginationOutput,
    PaginationOutput,
    UserPaginationInput,
} from "@/hooks/usePagination";
import { UserRoleSnippet } from "@/models/User";
import UserService from "@/services/UserService";
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
import AdminUserAuthorizeItem from "./UserAuthorizeItem";

type AdminUserAuthorizeProps = {};

type AdminUserAuthorizeState = {
    reload: boolean;
    paginationInput: UserPaginationInput;
    paginationOutput: PaginationOutput;
    loading: boolean;
};

const defaultAdminUserAuthorizeState: AdminUserAuthorizeState = {
    reload: false,
    paginationInput: {
        ...defaultPaginationInput,
        pageCount: USER_PAGE_COUNT,
    },
    paginationOutput: defaultPaginationOutput,
    loading: true,
};

type RoleInfo = {
    user: UserRoleSnippet;
    role: Role;
    label: string;
};

export const userHeaderList: TableInfoHeader[] = [
    {
        title: "Avatar",
        width: "80px",
    },
    {
        title: "Email",
        width: "300px",
    },
    {
        title: "Tên",
        width: "300px",
    },
    {
        title: "Vai trò",
        isCenter: true,
    },
];

const AdminUserAuthorize: React.FC<AdminUserAuthorizeProps> = () => {
    const { user } = useAuth();
    const [adminUserAuthorizeState, setAdminUserAuthorizeState] =
        useState<AdminUserAuthorizeState>(defaultAdminUserAuthorizeState);
    const { getUsers } = usePagination();
    const debouncedSearch = useDebounce(
        adminUserAuthorizeState.paginationInput.searchValue || "",
        300
    );
    const [selectedRole, setSelectedRole] = useState<RoleInfo | undefined>();
    const { toggleView, closeModal } = useModal();
    const router = useRouter();

    const getListUsers = async () => {
        setAdminUserAuthorizeState((prev) => ({
            ...prev,
            loading: true,
        }));
        const input: UserPaginationInput = {
            ...adminUserAuthorizeState.paginationInput,
            page: adminUserAuthorizeState.reload
                ? 1
                : adminUserAuthorizeState.paginationInput.page,
            isFirst: adminUserAuthorizeState.reload
                ? true
                : adminUserAuthorizeState.paginationInput.isFirst,
            setDocValue: (docValue) => {
                setAdminUserAuthorizeState((prev) => ({
                    ...prev,
                    paginationInput: {
                        ...prev.paginationInput,
                        docValue,
                    },
                }));
            },
        };
        const res = await getUsers(input);
        if (res) {
            setAdminUserAuthorizeState((prev) => ({
                ...prev,
                paginationInput: {
                    ...prev.paginationInput,
                    isFirst: false,
                },
                reload: false,
                paginationOutput: res,
            }));
        }
        setAdminUserAuthorizeState((prev) => ({
            ...prev,
            loading: false,
        }));
    };

    const handleChangeRole = async () => {
        await UserService.changeUserRole({
            userId: selectedRole?.user.id!,
            newRole: selectedRole?.role!,
        });
        setAdminUserAuthorizeState((prev) => ({
            ...prev,
            paginationOutput: {
                ...prev.paginationOutput,
                list: prev.paginationOutput.list.map((item: UserRoleSnippet) =>
                    item.id !== selectedRole?.user.id
                        ? item
                        : {
                              ...item,
                              role: selectedRole?.role,
                          }
                ),
            },
        }));
        setSelectedRole(undefined);
        closeModal();
    };

    useEffect(() => {
        setAdminUserAuthorizeState((prev) => ({
            ...prev,
            paginationInput: {
                ...prev.paginationInput,
                page: 1,
            },
        }));
    }, [debouncedSearch]);

    useEffect(() => {
        getListUsers();
    }, [adminUserAuthorizeState.paginationInput.page, debouncedSearch]);

    return (
        <Flex direction="column" flexGrow={1} justify="space-between">
            <ConfirmModal
                title="Phân quyền người dùng"
                content={`Bạn chắc chắn muốn thay đổi thành viên ${selectedRole?.user.displayName} thành vai trò ${selectedRole?.label}?`}
                status="info"
                onSubmit={handleChangeRole}
            />
            <VStack spacing={0} align="flex-start">
                <Box p={4} w="100%" fontSize={20} fontWeight={600}>
                    <Flex justify="space-between">
                        <Text>Phân quyền người dùng</Text>
                        <HStack spacing={2} align="center">
                            <Link
                                href={routes.getAdminPage()}
                                _hover={{ textDecoration: "none" }}
                            >
                                <Button>Quay lại</Button>
                            </Link>
                        </HStack>
                    </Flex>
                    <InputGroup mt={4}>
                        <InputLeftElement
                            pointerEvents="none"
                            children={<FiSearch color="gray.300" />}
                        />
                        <Input
                            type="text"
                            placeholder="Tìm kiếm người dùng..."
                            borderColor="gray.400"
                            onChange={(e) =>
                                setAdminUserAuthorizeState((prev) => ({
                                    ...prev,
                                    paginationInput: {
                                        ...prev.paginationInput,
                                        searchValue: e.target.value,
                                    },
                                }))
                            }
                        />
                    </InputGroup>
                </Box>
                <Divider borderColor="gray.300" />
                <TableHeader list={userHeaderList} />
                <Divider borderColor="gray.300" />
                {adminUserAuthorizeState.loading ? (
                    <Flex align="center" justify="center" w="100%" p={10}>
                        <Spinner />
                    </Flex>
                ) : adminUserAuthorizeState.paginationOutput.list &&
                  adminUserAuthorizeState.paginationOutput.list.length > 0 ? (
                    adminUserAuthorizeState.paginationOutput.list.map(
                        (u: UserRoleSnippet) =>
                            u.role === ADMIN_ROLE || u.id === user?.uid ? (
                                <Box key={u.id}></Box>
                            ) : (
                                <Box key={u.id} w="100%">
                                    <AdminUserAuthorizeItem
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
                        <Text>Không có tài khoản nào</Text>
                    </Flex>
                )}
            </VStack>
            <Flex align="center" py={6} justify="center" w="100%">
                <Pagination
                    page={adminUserAuthorizeState.paginationOutput.page}
                    totalPage={
                        adminUserAuthorizeState.paginationOutput.totalPage
                    }
                    onNext={() =>
                        setAdminUserAuthorizeState((prev) => ({
                            ...prev,
                            paginationInput: {
                                ...prev.paginationInput,
                                page: prev.paginationInput.page + 1,
                                isNext: true,
                            },
                        }))
                    }
                    onPrev={() =>
                        setAdminUserAuthorizeState((prev) => ({
                            ...prev,
                            paginationInput: {
                                ...prev.paginationInput,
                                page: prev.paginationInput.page - 1,
                                isNext: false,
                            },
                        }))
                    }
                />
            </Flex>
        </Flex>
    );
};
export default AdminUserAuthorize;
