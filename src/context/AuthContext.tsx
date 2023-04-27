import { ProfileFormState } from "@/components/Profile/Edit/Detail";
import { routes } from "@/constants/routes";
import { UserModel } from "@/models/User";
import UserService from "@/services/UserService";
import { User } from "firebase/auth";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { createContext, useEffect, useState } from "react";

type AuthAction = {
    updateUser: (user: ProfileFormState) => void;
    login: (user: User) => Promise<UserModel | undefined>;
    logout: () => Promise<void>;
    setNeedAuth: (value: boolean) => void;
    setDefaultPath: (value: string) => void;
};

type AuthStateState = {
    user?: UserModel | null;
    authAction: AuthAction;
};

const defaultAuthState: AuthStateState = {
    user: null,
    authAction: {
        updateUser: () => null,
        login: async () => {
            return undefined;
        },
        logout: async () => {},
        setNeedAuth: () => null,
        setDefaultPath: () => null,
    },
};

export const AuthContext = createContext<AuthStateState>(defaultAuthState);

export const AuthProvider = ({ children }: any) => {
    const rounter = useRouter();
    const [user, setUser] = useState<UserModel | null>(null);
    const [needAuth, setNeedAuth] = useState(false);
    const [defaultPath, setDefaultPath] = useState(routes.getHomePage());

    useEffect(() => {
        const token = Cookies.get("token");
        if (token) {
            const user = JSON.parse(Cookies.get("user")!);
            setUser(user);
        }
    }, []);

    useEffect(() => {
        if (user) {
            Cookies.set("user", JSON.stringify(user));
        }
    }, [user]);

    const updateUser = (user: ProfileFormState) => {
        setUser(
            (prev) =>
                ({
                    ...prev,
                    displayName: user.displayName,
                    photoURL: user.photoUrl,
                    bio: user.bio,
                } as UserModel)
        );
    };

    const getUserFromDb = async (user: User) => {
        try {
            const loggedUser = await UserService.get({ userId: user.uid });
            setUser(loggedUser);
            return loggedUser;
        } catch (error) {
            console.log(error);
        }
    };

    const login = async (us: User) => {
        if (us) {
            const user = await getUserFromDb(us);
            const token = await us.getIdToken();
            Cookies.set("token", token);
            Cookies.set("user_id", us.uid);
            Cookies.set("user", JSON.stringify(user));
            return user;
        }
    };

    const logout = async () => {
        if (needAuth) {
            setNeedAuth(false);
            await rounter.push(defaultPath);
        }
        setUser(null);
        Cookies.remove("token");
        Cookies.remove("user_id");
        Cookies.remove("user");
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                authAction: {
                    updateUser,
                    login,
                    logout,
                    setNeedAuth,
                    setDefaultPath,
                },
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
