import { User } from "firebase/auth";

export interface UserModel extends User {
    role: string;
    bio?: string;
    subBio?: string;
}
