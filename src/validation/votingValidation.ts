import { getRequiredError } from "@/constants/errors";
import { ValidationError, ValidationResult } from "@/constants/validation";
import { Voting } from "@/models/Vote";
import { isDateEnd } from "@/utils/StringUtils";
import { Timestamp } from "firebase/firestore";
import moment from "moment";

export const validateCreateVoting = (voting: Voting) => {
    let res: ValidationResult = {
        result: false,
        errors: [],
    };
    if (!voting.content) {
        const error: ValidationError = {
            field: "content",
            message: getRequiredError("nội dung cuộc bình chọn"),
        };
        res.errors.push(error);
    }

    const timeMin = moment(new Date()).add(5, "m").toDate();
    if (isDateEnd(voting.timeLast, Timestamp.fromDate(timeMin))) {
        const error: ValidationError = {
            field: "timeLast",
            message: "Vui lòng nhập thời gian lớn hơn hiện tại 5 phút",
        };
        res.errors.push(error);
    }

    if (voting.options.length <= 0) {
        const error: ValidationError = {
            field: "options",
            message: "Vui lòng nhập thông tin lựa chọn",
        };
        res.errors.push(error);
    } else {
        for (const option of voting.options) {
            if (!option.value && !option.imageUrl) {
                const error: ValidationError = {
                    field: "options",
                    message: "Vui lòng nhập thông tin lựa chọn",
                };
                res.errors.push(error);
                break;
            }
        }
    }

    if (res.errors.length <= 0) {
        res.result = true;
    }
    return res;
};
