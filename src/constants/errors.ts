export const UNKNOWN_ERROR = "Có lỗi xảy ra, vui lòng thử lại!";
export const NOT_AN_EMAIL_ERROR = "Email sai định dạng!";
export const CONFIRM_PASSWORD_NOT_MATCH = "Mật khẩu xác nhận không trùng khớp";
export const CURRENT_PASSWORD_MATCH_NEW_PASSWORD =
    "Mật khẩu mới không được trùng với mật khẩu cũ";
export const getMinLengthError = (name: string, length: number) => {
    return `Vui lòng nhập ${name} tối thiểu ${length} ký tự!`;
};
export const getRequiredError = (name: string) => {
    return `Vui lòng nhập ${name}!`;
};
export const getIsExistsError = (name: string) => {
    return `${name} đã tồn tại!`;
};
