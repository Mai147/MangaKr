import ImageUpload from "@/components/ImageUpload";
import TabItem from "@/components/Tab/TabItem";
import { routes } from "@/constants/routes";
import { toastOption } from "@/constants/toast";
import { ValidationError } from "@/constants/validation";
import useSelectFile from "@/hooks/useSelectFile";
import { defaultReviewForm, Review } from "@/models/Review";
import { UserModel } from "@/models/User";
import ReviewService from "@/services/ReviewService";
import { validateCreateReview } from "@/validation/reviewValidation";
import { Flex, Divider, useToast } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { IoImageOutline, IoDocument } from "react-icons/io5";
import { MdOutlineRateReview } from "react-icons/md";
import FormFooter from "../Footer";
import FormHeader from "../Header";
import ReviewFormContent from "./Content";
import ReviewFormRate from "./Rate";

type ReviewFormProps = {
    bookId: string;
    review?: Review;
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
        title: "Đánh giá",
        icon: MdOutlineRateReview,
    },
];

const ReviewForm: React.FC<ReviewFormProps> = ({ bookId, user, review }) => {
    const { selectedFile, setSelectedFile, onSelectFile, onUploadFile } =
        useSelectFile();
    const [selectedTab, setSelectedTab] = useState(formTab[0].title);
    const [reviewForm, setReviewForm] = useState<Review>({
        ...defaultReviewForm,
        bookId,
        creatorId: user.uid,
        creatorDisplayName: user.displayName!,
    });
    const [errors, setErrors] = useState<ValidationError[]>([]);
    const toast = useToast();

    useEffect(() => {
        if (review) {
            setReviewForm(review);
            if (review.imageUrl) {
                setSelectedFile(review.imageUrl);
            }
        }
    }, []);

    useEffect(() => {
        setReviewForm((prev) => ({
            ...prev,
            imageUrl: selectedFile,
        }));
    }, [selectedFile]);

    const handleChange = (field: string, value: any) => {
        setReviewForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const onSubmit = async () => {
        if (errors) setErrors([]);
        const res = validateCreateReview(reviewForm);
        if (!res.result) {
            setErrors(res.errors);
            toast({
                ...toastOption,
                title: "Nhập thiếu thông tin, vui lòng thử lại",
                status: "error",
            });
            return;
        }
        if (!review) {
            await ReviewService.create({ bookId, reviewForm });
            setReviewForm({
                ...defaultReviewForm,
                bookId,
                creatorId: user.uid,
            });
            setSelectedFile(undefined);
            toast({
                ...toastOption,
                title: "Viết bài thành công!",
                status: "success",
            });
        } else {
            await ReviewService.update({ review, reviewForm });
            toast({
                ...toastOption,
                title: "Sửa thành công!",
                status: "success",
            });
        }
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
                <FormHeader
                    title={!review ? "Viết bài đánh giá" : "Sửa bài đánh giá"}
                    backTitle={"Quay về trang chủ"}
                    backHref={routes.getHomePage()}
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
                <Flex p={4} flexGrow={1} direction="column">
                    {selectedTab === formTab[0].title && (
                        <ReviewFormContent
                            title={reviewForm.title}
                            content={reviewForm.content}
                            setTitle={(value) => {
                                handleChange("title", value);
                            }}
                            setContent={(value) => {
                                handleChange("content", value);
                            }}
                            errors={errors}
                        />
                    )}
                    {selectedTab === formTab[1].title && (
                        <ImageUpload
                            selectedFile={selectedFile}
                            onSelectImage={onSelectFile}
                            setSelectedFile={setSelectedFile}
                        />
                    )}

                    {selectedTab === formTab[2].title && (
                        <ReviewFormRate
                            rating={reviewForm.rating}
                            setRating={(value) => {
                                handleChange("rating", value);
                            }}
                            tagReview={reviewForm.tagReview}
                            setTagReview={(value) => {
                                handleChange("tagReview", value);
                            }}
                            errors={errors}
                        />
                    )}
                </Flex>
                <FormFooter onSubmit={onSubmit} />
            </Flex>
        </Flex>
    );
};
export default ReviewForm;
