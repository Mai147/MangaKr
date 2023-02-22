import { getRequiredError } from "@/constants/errors";
import { ValidationError, ValidationResult } from "@/constants/validation";
import { Review } from "@/models/Review";

export const validateCreateReview = (review: Review) => {
    let res: ValidationResult = {
        result: false,
        errors: [],
    };
    if (!review.title) {
        const error: ValidationError = {
            field: "title",
            message: getRequiredError("tên bài viết"),
        };
        res.errors.push(error);
    }

    if (!review.content) {
        const error: ValidationError = {
            field: "content",
            message: getRequiredError("nội dung bài viết"),
        };
        res.errors.push(error);
    }

    if (!review.tagReview) {
        const error: ValidationError = {
            field: "tagReview",
            message: getRequiredError("đánh giá"),
        };
        res.errors.push(error);
    }

    if (res.errors.length <= 0) {
        res.result = true;
    }
    return res;
};
