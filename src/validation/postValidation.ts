import { getRequiredError } from "@/constants/errors";
import { ValidationError, ValidationResult } from "@/constants/validation";
import { Post } from "@/models/Post";

export const validateCreatePost = (post: Post) => {
    let res: ValidationResult = {
        result: false,
        errors: [],
    };
    if (!post.caption) {
        const error: ValidationError = {
            field: "caption",
            message: getRequiredError("caption"),
        };
        res.errors.push(error);
    }

    if (res.errors.length <= 0) {
        res.result = true;
    }
    return res;
};
