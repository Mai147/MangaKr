import { PASSWORD_MIN_LENGTH } from "@/constants/validation";

export const isEmail = (email: string) => {
    const emailReg = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return emailReg.test(email);
};

export const isMinLength = (field: string, length: number) => {
    return field.length >= length;
};

export const isPassword = (password: string) => {
    return password.length >= PASSWORD_MIN_LENGTH;
};
