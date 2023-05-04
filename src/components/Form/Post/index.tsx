import ImageMultipleUpload from "@/components/ImageUpload/ImageMultipleUpload";
import VideoUpload from "@/components/ImageUpload/VideoUpload";
import TabItem from "@/components/Tab/TabItem";
import { CommunityRole } from "@/constants/roles";
import { routes } from "@/constants/routes";
import { toastOption } from "@/constants/toast";
import { ValidationError } from "@/constants/validation";
import useSelectFile from "@/hooks/useSelectFile";
import useSelectVideo from "@/hooks/useSelectVideo";
import { Community } from "@/models/Community";
import { defaultPostForm, Post } from "@/models/Post";
import { UserModel } from "@/models/User";
import PostService from "@/services/PostService";
import { validateCreatePost } from "@/validation/postValidation";
import { Flex, Divider, useToast } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { AiOutlineEye } from "react-icons/ai";
import { BsCameraVideo } from "react-icons/bs";
import { IoImageOutline, IoDocument } from "react-icons/io5";
import FormFooter from "../Footer";
import FormHeader from "../Header";
import PostFormContent from "./Content";
import PostPrivacyTab from "./PostPrivacyTab";

type PostFormProps = {
    community?: Community;
    user: UserModel;
    userRole?: CommunityRole;
};

const formTab = [
    {
        title: "Nội dung",
        icon: IoDocument,
    },
    {
        title: "Hình ảnh",
        icon: IoImageOutline,
    },
    {
        title: "Video",
        icon: BsCameraVideo,
    },
];

const userFormTab = [
    {
        title: "Hiển thị",
        icon: AiOutlineEye,
    },
];

const PostForm: React.FC<PostFormProps> = ({ community, user, userRole }) => {
    const [postForm, setPostForm] = useState<Post>({
        ...defaultPostForm,
        creatorId: user.uid,
        creatorDisplayName: user.displayName!,
        creatorImageUrl: user.photoURL,
    });
    const [errors, setErrors] = useState<ValidationError[]>([]);
    const [selectedTab, setSelectedTab] = useState(formTab[0].title);
    const { onSelectMultipleFile, selectedListFile, setSelectedListFile } =
        useSelectFile();
    const { onSelectVideo, selectedVideo, setSelectedVideo } = useSelectVideo();
    const toast = useToast();

    useEffect(() => {
        setPostForm((prev) => ({
            ...prev,
            imageUrls: selectedListFile,
        }));
    }, [selectedListFile]);

    useEffect(() => {
        setPostForm((prev) => ({
            ...prev,
            videoUrl: selectedVideo,
        }));
    }, [selectedVideo]);

    const onSubmit = async () => {
        try {
            if (errors) setErrors([]);
            const res = validateCreatePost(postForm);
            if (!res.result) {
                setErrors(res.errors);
                toast({
                    ...toastOption,
                    title: "Nhập thiếu thông tin, vui lòng thử lại",
                    status: "error",
                });
                return;
            }
            await PostService.create({ postForm, community, userRole });
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
    };

    const handleChange = (field: string, value: any) => {
        setPostForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };
    return (
        <Flex
            direction="column"
            bg="white"
            borderRadius={4}
            mt={2}
            flexGrow={1}
        >
            <Flex direction="column" flexGrow={1}>
                <Flex direction="column">
                    <FormHeader
                        title="Tạo bài viết"
                        backTitle={
                            community
                                ? "Quay lại cộng đồng"
                                : "Quay về trang chủ"
                        }
                        backHref={
                            community
                                ? routes.getCommunityDetailPage(community.id!)
                                : routes.getHomePage()
                        }
                    />
                    <Divider my={4} />
                    <Flex width="100%" wrap="wrap">
                        {formTab.map((item) => (
                            <TabItem
                                key={item.title}
                                item={item}
                                selected={item.title === selectedTab}
                                setSelectedTab={setSelectedTab}
                            />
                        ))}
                        {!community &&
                            userFormTab.map((item) => (
                                <TabItem
                                    key={item.title}
                                    item={item}
                                    selected={item.title === selectedTab}
                                    setSelectedTab={setSelectedTab}
                                />
                            ))}
                    </Flex>
                </Flex>
                <Flex px={{ base: 0, md: 4 }} py={4} flexGrow={1}>
                    {selectedTab === formTab[0].title && (
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
                    {selectedTab === formTab[1].title && (
                        <ImageMultipleUpload
                            onSelectMultipleFile={onSelectMultipleFile}
                            setSelectedListFile={setSelectedListFile}
                            selectedListFile={selectedListFile}
                        />
                    )}
                    {selectedTab === formTab[2].title && (
                        <VideoUpload
                            onSelectVideo={onSelectVideo}
                            setSelectedFile={setSelectedVideo}
                            selectedFile={selectedVideo}
                        />
                    )}
                    {selectedTab === userFormTab[0].title && (
                        <PostPrivacyTab
                            privacy={postForm.privacyType}
                            setPrivacy={(value) => {
                                setPostForm((prev) => ({
                                    ...prev,
                                    privacyType: value,
                                }));
                            }}
                        />
                    )}
                </Flex>
            </Flex>
            <FormFooter onSubmit={onSubmit} />
        </Flex>
    );
};
export default PostForm;
