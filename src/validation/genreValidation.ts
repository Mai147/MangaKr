import { getIsExistsError, getRequiredError } from "@/constants/errors";
import { firebaseRoute } from "@/constants/firebaseRoutes";
import { ValidationError, ValidationResult } from "@/constants/validation";
import { fireStore } from "@/firebase/clientApp";
import { Genre } from "@/models/Genre";
import { collection, getDocs, query, where } from "firebase/firestore";

export const validateCreateGenre = async (genre: Genre) => {
    let res: ValidationResult = {
        result: false,
        errors: [],
    };
    if (!genre.name) {
        const error: ValidationError = {
            field: "name",
            message: getRequiredError("tên thể loại"),
        };
        res.errors.push(error);
    } else {
        const genreQuery = query(
            collection(fireStore, firebaseRoute.getAllGenreRoute()),
            where("name", "==", genre.name)
        );
        const genreDocs = await getDocs(genreQuery);
        if (genreDocs.docs.length > 0) {
            const error: ValidationError = {
                field: "name",
                message: getIsExistsError("Tên thể loại"),
            };
            res.errors.push(error);
        }
    }
    if (!genre.description) {
        const error: ValidationError = {
            field: "description",
            message: getRequiredError("mô tả"),
        };
        res.errors.push(error);
    }
    if (res.errors.length <= 0) res.result = true;
    return res;
};
