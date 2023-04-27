import ImageMultipleUpload from "@/components/ImageUpload/ImageMultipleUpload";
import VideoUpload from "@/components/ImageUpload/VideoUpload";
import PostFormContent from "@/components/Post/Form/Content";
import TabItem from "@/components/Tab/TabItem";
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
import PostPrivacyTab from "./PostPrivacyTab";

type PostFormProps = {
    community?: Community;
    user: UserModel;
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
    {
        title: "Hiển thị",
        icon: AiOutlineEye,
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
    const { onSelectVideo, selectedVideo, setSelectedVideo, onUploadVideo } =
        useSelectVideo();
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
                            onUpload={async () => {
                                onUploadVideo("video");
                            }}
                        />
                    )}
                    {selectedTab === formTab[3].title && (
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
