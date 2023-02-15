import {
    CONFIRM_PASSWORD_NOT_MATCH,
    CURRENT_PASSWORD_MATCH_NEW_PASSWORD,
    getMinLengthError,
    NOT_AN_EMAIL_ERROR,
} from "@/constants/errors";
import { PASSWORD_MIN_LENGTH } from "@/constants/validation";
import { isEmail, isMinLength, isPassword } from "@/utils/StringUtils";

export type ValidationResult = {
    result: boolean;
    message?: string;
};

export const loginValidation = (
    email: string,
    password: string
): ValidationResult => {
    if (!isEmail(email))
        return {
            result: false,
            message: NOT_AN_EMAIL_ERROR,
        };
    if (!isMinLength(password, PASSWORD_MIN_LENGTH)) {
        return {
            result: false,
            message: getMinLengthError("mật khẩu", PASSWORD_MIN_LENGTH),
        };
    }
    return {
        result: true,
    };
};

export const signUpValidation = (
    email: string,
    password: string,
    confirmPassword: string
): ValidationResult => {
    let res: ValidationResult = {
        result: false,
    };
    if (!isEmail(email)) {
        res.message = NOT_AN_EMAIL_ERROR;
    } else if (!isMinLength(password, PASSWORD_MIN_LENGTH)) {
        res.message = getMinLengthError("mật khẩu", PASSWORD_MIN_LENGTH);
    } else if (password !== confirmPassword)
        res.message = CONFIRM_PASSWORD_NOT_MATCH;
    if (res.message) {
        return res;
    }
    return {
        result: true,
    };
};

export const changePasswordValidation = (
    currentPassword: string,
    newPassword: string,
    confirmNewPassword: string
) => {
    let res: ValidationResult = {
        result: false,
    };
    if (
        !isMinLength(currentPassword, PASSWORD_MIN_LENGTH) ||
        !isMinLength(newPassword, PASSWORD_MIN_LENGTH)
    ) {
        res.message = getMinLengthError("mật khẩu", PASSWORD_MIN_LENGTH);
    } else if (newPassword !== confirmNewPassword) {
        res.message = CONFIRM_PASSWORD_NOT_MATCH;
    } else if (currentPassword === newPassword) {
        res.message = CURRENT_PASSWORD_MATCH_NEW_PASSWORD;
    }
    if (res.message) {
        return res;
    }
    return {
        result: true,
    };
};
