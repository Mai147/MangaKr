export type ValidationError = {
    field: string;
    message: string;
};

export type ValidationResult = {
    result: boolean;
    errors: ValidationError[];
};

export const PASSWORD_MIN_LENGTH = 6;
