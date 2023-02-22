import { getIsExistsError, getRequiredError } from "@/constants/errors";
import { firebaseRoute } from "@/constants/firebaseRoutes";
import { ValidationError, ValidationResult } from "@/constants/validation";
import { fireStore } from "@/firebase/clientApp";
import { Author } from "@/models/Author";
import { query, collection, where, getDocs } from "firebase/firestore";

export const validateCreateAuthor = async (author: Author) => {
    let res: ValidationResult = {
        result: false,
        errors: [],
    };
    if (!author.name) {
        const error: ValidationError = {
            field: "name",
            message: getRequiredError("tên tác giả"),
        };
        res.errors.push(error);
    } else {
        const authorQuery = query(
            collection(fireStore, firebaseRoute.getAllAuthorRoute()),
            where("name", "==", author.name)
        );
        const authorDocs = await getDocs(authorQuery);
        if (authorDocs.docs.length > 0) {
            const error: ValidationError = {
                field: "name",
                message: getIsExistsError("Tên tác giả"),
            };
            res.errors.push(error);
        }
    }
    if (res.errors.length <= 0) res.result = true;
    return res;
};
