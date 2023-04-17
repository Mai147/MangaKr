import { createContext, useState } from "react";

type ModalView =
    | "login"
    | "signup"
    | "createAuthor"
    | "createGenre"
    | "confirmModal"
    | "addToLibrary"
    | "createCommunity"
    | "editPostPrivacy";

type ModalState = {
    isOpen: boolean;
    view: ModalView;
    toggleView: (view: ModalView) => void;
    closeModal: () => void;
};

const defaultModalState: ModalState = {
    isOpen: false,
    view: "login",
    toggleView: () => null,
    closeModal: () => null,
};

export const ModalContext = createContext<ModalState>(defaultModalState);

export const ModalProvider = ({ children }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const [view, setView] = useState<ModalView>("login");

    const toggleView = (view: ModalView) => {
        setIsOpen(true);
        setView(view);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    return (
        <ModalContext.Provider
            value={{
                isOpen,
                view,
                toggleView,
                closeModal,
            }}
        >
            {children}
        </ModalContext.Provider>
    );
};
