import { getIsExistsError, getRequiredError } from "@/constants/errors";
import { firebaseRoute } from "@/constants/firebaseRoutes";
import { ValidationError, ValidationResult } from "@/constants/validation";
import { fireStore } from "@/firebase/clientApp";
import { Book } from "@/models/Book";
import { collection, getDocs, query, where } from "firebase/firestore";

export const validateCreateBook = async (
    book: Book,
    currentBookName?: string
): Promise<ValidationResult> => {
    let res: ValidationResult = {
        result: false,
        errors: [],
    };
    if (!book.name) {
        const error: ValidationError = {
            field: "name",
            message: getRequiredError("tên truyện"),
        };
        res.errors.push(error);
    } else if (book.name !== currentBookName) {
        const bookQuery = query(
            collection(fireStore, firebaseRoute.getAllBookRoute()),
            where("name", "==", book.name)
        );
        const bookDocs = await getDocs(bookQuery);
        if (bookDocs.docs.length > 0) {
            const error: ValidationError = {
                field: "name",
                message: getIsExistsError("Tên truyện"),
            };
            res.errors.push(error);
        }
    }
    if (res.errors.length <= 0) {
        res.result = true;
    }
    return res;
};
