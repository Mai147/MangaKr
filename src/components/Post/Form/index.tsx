import ImageMultipleUpload from "@/components/ImageUpload/ImageMultipleUpload";
import TabItem from "@/components/Tab/TabItem";
import { routes } from "@/constants/routes";
import { toastOption } from "@/constants/toast";
import { ValidationError } from "@/constants/validation";
import useSelectFile from "@/hooks/useSelectFile";
import { Community } from "@/models/Community";
import { defaultPostForm, Post } from "@/models/Post";
import { UserModel } from "@/models/User";
import PostService from "@/services/PostService";
import { validateCreatePost } from "@/validation/postValidation";
import { Flex, Button, Divider, Text, useToast, Link } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { IoImageOutline, IoDocument } from "react-icons/io5";
import PostFormContent from "./Content";

type PostFormProps = {
    community?: Community;
    user: UserModel;
};

const formTab = [
    {
        title: "Hình ảnh",
        icon: IoImageOutline,
    },
    {
        title: "Nội dung",
        icon: IoDocument,
    },
];

const PostForm: React.FC<PostFormProps> = ({ community, user }) => {
    const [postForm, setPostForm] = useState<Post>({
        ...defaultPostForm,
        creatorId: user.uid,
        creatorDisplayName: user.displayName!,
        creatorImageUrl: user.photoURL,
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<ValidationError[]>([]);
    const [selectedTab, setSelectedTab] = useState(formTab[0].title);
    const { onSelectMultipleFile, selectedListFile, setSelectedListFile } =
        useSelectFile();
    const toast = useToast();

    useEffect(() => {
        setPostForm((prev) => ({
            ...prev,
            imageUrls: selectedListFile,
        }));
    }, [selectedListFile]);

    const onSubmit = async () => {
        try {
            setLoading(true);
            if (errors) setErrors([]);
            const res = validateCreatePost(postForm);
            if (!res.result) {
                setErrors(res.errors);
                toast({
                    ...toastOption,
                    title: "Nhập thiếu thông tin, vui lòng thử lại",
                    status: "error",
                });
                setLoading(false);
                return;
            }
            await PostService.create({ postForm, community });
            setPostForm({
                ...defaultPostForm,
                creatorId: user.uid,
                creatorDisplayName: user.displayName!,
                creatorImageUrl: user.photoURL,
            });
            setSelectedListFile([]);
            toast({
                ...toastOption,
                title: "Đăng bài thành công!",
                status: "success",
            });
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const handleChange = (field: string, value: any) => {
        setPostForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };
    return (
        <Flex direction="column" bg="white" borderRadius={4} mt={2}>
            <Flex direction="column">
                <Flex align="center">
                    <Text fontSize={24} fontWeight={600}>
                        Tạo bài viết
                    </Text>
                    <Button
                        w={28}
                        ml={8}
                        isLoading={loading}
                        onClick={onSubmit}
                    >
                        Lưu
                    </Button>
                    {community && (
                        <Link
                            ml={4}
                            href={routes.getCommunityDetailPage(community.id!)}
                            _hover={{ textDecoration: "none" }}
                        >
                            <Button variant="outline">
                                Quay lại cộng đồng
                            </Button>
                        </Link>
                    )}
                </Flex>
                <Divider my={4} />
                <Flex width="100%">
                    {formTab.map((item) => (
                        <TabItem
                            key={item.title}
                            item={item}
                            selected={item.title === selectedTab}
                            setSelectedTab={setSelectedTab}
                        />
                    ))}
                </Flex>
            </Flex>
            <Flex p={4}>
                {selectedTab === formTab[0].title && (
                    <ImageMultipleUpload
                        onSelectMultipleFile={onSelectMultipleFile}
                        setSelectedListFile={setSelectedListFile}
                        selectedListFile={selectedListFile}
                    />
                )}
                {selectedTab === formTab[1].title && (
                    <PostFormContent
                        caption={postForm.caption}
                        description={postForm.description || ""}
                        setCaption={(value) => {
                            handleChange("caption", value);
                        }}
                        setDescription={(value) => {
                            handleChange("description", value);
                        }}
                        errors={errors}
                    />
                )}
            </Flex>
        </Flex>
    );
};
export default PostForm;
