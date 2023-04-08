import SearchDropdown from "@/components/Search/Dropdown";
import { ValidationError } from "@/constants/validation";
import useAuth from "@/hooks/useAuth";
import useModal from "@/hooks/useModal";
import useTestPagination, {
    BookPaginationInput,
    defaultPaginationInput,
    defaultPaginationOutput,
    PaginationOutput,
} from "@/hooks/useTestPagination";
import { Book } from "@/models/Book";
import {
    Community,
    communityTypeList,
    defaultCommunityForm,
} from "@/models/Community";
import CommunityService from "@/services/CommunityService";
import { validateCreateCommunity } from "@/validation/communityValidation";
import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Box,
    Divider,
    Text,
    Input,
    Stack,
    Checkbox,
    Flex,
    Icon,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { BsFillEyeFill, BsFillPersonFill } from "react-icons/bs";
import { HiLockClosed } from "react-icons/hi";

const MAX_NAME_LENGTH = 36;

const listType = [
    {
        name: communityTypeList[0].value,
        title: communityTypeList[0].label,
        subTitle:
            "Bất kì ai đều có thể xem, đăng tải và bình luận các bài viết",
        icon: BsFillPersonFill,
    },
    {
        name: communityTypeList[1].value,
        title: communityTypeList[1].label,
        subTitle:
            "Bất kì ai đều có thể xem các bài viết, nhưng chỉ có thành viên mới được quyền đăng tải nội dung",
        icon: BsFillEyeFill,
    },
    {
        name: communityTypeList[2].value,
        title: communityTypeList[2].label,
        subTitle: "Chỉ có thành viên mới được xem và đăng tải các bài viết",
        icon: HiLockClosed,
    },
];

const CreateCommunityModal: React.FC = () => {
    const { user } = useAuth();
    const { view, isOpen, closeModal, toggleView } = useModal();
    const [communityForm, setCommunityForm] =
        useState<Community>(defaultCommunityForm);
    const [charRemaining, setCharRemaining] = useState(MAX_NAME_LENGTH);
    const [errors, setErrors] = useState<ValidationError[]>([]);
    const [loading, setLoading] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    const [bookPaginationInput, setBookPaginationInput] =
        useState<BookPaginationInput>({
            ...defaultPaginationInput,
            pageCount: 10,
        });
    const [bookPaginationOutput, setBookPaginationOutput] =
        useState<PaginationOutput>(defaultPaginationOutput);
    const { getBooks } = useTestPagination();

    const getSearchBooks = async () => {
        const input: BookPaginationInput = {
            ...bookPaginationInput,
            setDocValue: (docValue) => {
                setBookPaginationInput((prev) => ({
                    ...prev,
                    docValue,
                }));
            },
        };
        const res = await getBooks(input);
        if (res) {
            setBookPaginationOutput(res);
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value.length > MAX_NAME_LENGTH) return;
        setCommunityForm(
            (prev) =>
                ({
                    ...prev,
                    name: event.target.value,
                } as Community)
        );
        setCharRemaining(MAX_NAME_LENGTH - event.target.value.length);
    };

    const onCommunityTypeChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setCommunityForm(
            (prev) =>
                ({
                    ...prev,
                    privacyType: event.target.name,
                } as Community)
        );
    };

    const handleCreateCommunity = async () => {
        // Validate community name
        if (errors) setErrors([]);
        if (!user) {
            toggleView("login");
            return;
        }
        const res = await validateCreateCommunity(communityForm);
        if (!res.result) {
            setErrors(res.errors);
            return;
        }

        setLoading(true);

        try {
            await CommunityService.create({ communityForm, user });
            closeModal();
        } catch (err: any) {
            console.log("Create community Error", err);
        }

        setLoading(false);
    };

    return (
        <Modal
            isOpen={isOpen && view === "createCommunity"}
            onClose={closeModal}
            size="lg"
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader
                    display="flex"
                    flexDirection="column"
                    fontSize={15}
                    padding={3}
                >
                    Tạo lập cộng đồng
                </ModalHeader>
                <Box pl={3} pr={3}>
                    <Divider />
                    <ModalCloseButton />
                    <ModalBody
                        display="flex"
                        flexDirection="column"
                        padding="10px 0"
                    >
                        <Text fontWeight={600} fontSize={15}>
                            Tên
                        </Text>
                        <Input
                            position="relative"
                            value={communityForm?.name}
                            size="sm"
                            onChange={handleChange}
                        />
                        <Text
                            fontSize="9pt"
                            color={charRemaining === 0 ? "red" : "gray.500"}
                        >
                            {charRemaining} Kí tự còn lại cho phép
                        </Text>
                        <Text fontSize={12} color="red">
                            {
                                errors.find((err) => err.field === "name")
                                    ?.message
                            }
                        </Text>

                        <Text fontWeight={600} fontSize={15} mt={2}>
                            Manga
                        </Text>

                        <SearchDropdown
                            options={
                                bookPaginationOutput.list?.map(
                                    (book: Book) => ({
                                        label: book.name,
                                        value: book.id!,
                                    })
                                ) || []
                            }
                            size="sm"
                            onSearch={getSearchBooks}
                            search={bookPaginationInput.searchValue || ""}
                            isSearching={isSearching}
                            setIsSearching={setIsSearching}
                            setSearch={(value: string) => {
                                setBookPaginationInput((prev) => ({
                                    ...prev,
                                    searchValue: value,
                                }));
                                setCommunityForm((prev) => ({
                                    ...prev,
                                    bookName: value,
                                }));
                            }}
                            setSelected={(value: string) => {
                                setCommunityForm((prev) => ({
                                    ...prev,
                                    bookId: value,
                                }));
                            }}
                        />
                        <Text fontSize={12} color="red" mt={1}>
                            {
                                errors.find((err) => err.field === "bookId")
                                    ?.message
                            }
                        </Text>

                        <Box mt={2} mb={4}>
                            <Text fontSize={15} fontWeight={600}>
                                Chế độ
                            </Text>
                            <Stack spacing={2}>
                                {listType.map((t, idx) => (
                                    <Checkbox
                                        key={idx}
                                        name={t.name}
                                        isChecked={
                                            communityForm?.privacyType ===
                                            t.name
                                        }
                                        size="md"
                                        onChange={onCommunityTypeChange}
                                    >
                                        <Flex align="center">
                                            <Icon
                                                as={t.icon}
                                                mr={2}
                                                color="gray.500"
                                            ></Icon>
                                            <Text
                                                fontSize="10pt"
                                                w={20}
                                                flexShrink={0}
                                            >
                                                {t.title}
                                            </Text>
                                            <Text
                                                fontSize="8pt"
                                                color="gray.500"
                                            >
                                                {t.subTitle}
                                            </Text>
                                        </Flex>
                                    </Checkbox>
                                ))}
                            </Stack>
                        </Box>
                    </ModalBody>
                </Box>

                <ModalFooter bg="gray.100" borderRadius="0px 0px 10px 10px">
                    <Button
                        height="30px"
                        variant="outline"
                        mr={3}
                        onClick={closeModal}
                    >
                        Hủy
                    </Button>
                    <Button
                        isLoading={loading}
                        height="30px"
                        onClick={handleCreateCommunity}
                    >
                        Tạo cộng đồng
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default CreateCommunityModal;
