import {
    CONFIRM_PASSWORD_NOT_MATCH,
    CURRENT_PASSWORD_MATCH_NEW_PASSWORD,
    getMinLengthError,
    NOT_AN_EMAIL_ERROR,
} from "@/constants/errors";
import { PASSWORD_MIN_LENGTH, ValidationError } from "@/constants/validation";
import { isEmail, isMinLength } from "@/utils/StringUtils";
import { ValidationResult } from "@/constants/validation";

export const validateLogin = (
    email: string,
    password: string
): ValidationResult => {
    let res: ValidationResult = {
        result: false,
        errors: [],
    };
    if (!isEmail(email)) {
        const error: ValidationError = {
            field: "email",
            message: NOT_AN_EMAIL_ERROR,
        };
        res.errors.push(error);
    }
    if (!isMinLength(password, PASSWORD_MIN_LENGTH)) {
        const error: ValidationError = {
            field: "password",
            message: getMinLengthError("mật khẩu", PASSWORD_MIN_LENGTH),
        };
        res.errors.push(error);
    }
    if (res.errors.length <= 0) {
        res.result = true;
    }
    return res;
};

export const validateSignUp = (
    email: string,
    password: string,
    confirmPassword: string
): ValidationResult => {
    let res: ValidationResult = {
        result: false,
        errors: [],
    };
    if (!isEmail(email)) {
        const error: ValidationError = {
            field: "email",
            message: NOT_AN_EMAIL_ERROR,
        };
        res.errors.push(error);
    }
    if (!isMinLength(password, PASSWORD_MIN_LENGTH)) {
        const error: ValidationError = {
            field: "password",
            message: getMinLengthError("mật khẩu", PASSWORD_MIN_LENGTH),
        };
        res.errors.push(error);
    } else if (password !== confirmPassword) {
        const error: ValidationError = {
            field: "confirmPassword",
            message: CONFIRM_PASSWORD_NOT_MATCH,
        };
        res.errors.push(error);
    }
    if (res.errors.length <= 0) {
        res.result = true;
    }
    return res;
};

export const validateChangePassword = (
    currentPassword: string,
    newPassword: string,
    confirmNewPassword: string
) => {
    let res: ValidationResult = {
        result: false,
        errors: [],
    };
    if (!isMinLength(currentPassword, PASSWORD_MIN_LENGTH)) {
        const error: ValidationError = {
            field: "currentPassword",
            message: getMinLengthError("mật khẩu", PASSWORD_MIN_LENGTH),
        };
        res.errors.push(error);
    }
    if (!isMinLength(newPassword, PASSWORD_MIN_LENGTH)) {
        const error: ValidationError = {
            field: "newPassword",
            message: getMinLengthError("mật khẩu", PASSWORD_MIN_LENGTH),
        };
        res.errors.push(error);
    } else if (newPassword !== confirmNewPassword) {
        const error: ValidationError = {
            field: "confirmNewPassword",
            message: CONFIRM_PASSWORD_NOT_MATCH,
        };
        res.errors.push(error);
    } else if (currentPassword === newPassword) {
        const error: ValidationError = {
            field: "newPassword",
            message: CURRENT_PASSWORD_MATCH_NEW_PASSWORD,
        };
        res.errors.push(error);
    }
    if (res.errors.length <= 0) {
        res.result = true;
    }
    return res;
};
