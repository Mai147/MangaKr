export const getAllUserRoute = () => {
    return "users";
};

export const getUserImageRoute = (userId: string) => {
    return `users/${userId}/image`;
};
