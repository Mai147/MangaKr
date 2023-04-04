import { getRequiredError } from "@/constants/errors";
import { ValidationError, ValidationResult } from "@/constants/validation";
import { Topic } from "@/models/Topic";

export const validateCreateTopic = (topic: Topic) => {
    let res: ValidationResult = {
        result: false,
        errors: [],
    };
    if (!topic.title) {
        const error: ValidationError = {
            field: "title",
            message: getRequiredError("chủ đề"),
        };
        res.errors.push(error);
    }

    if (res.errors.length <= 0) {
        res.result = true;
    }
    return res;
};
