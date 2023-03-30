import { toastOption } from "@/constants/toast";
import { ValidationError } from "@/constants/validation";
import useAuth from "@/hooks/useAuth";
import useModal from "@/hooks/useModal";
import { Book, defaultBookForm } from "@/models/Book";
import { Character, defaultCharacterForm } from "@/models/Character";
import BookService from "@/services/BookService";
import CharacterUtils from "@/utils/CharacterUtils";
import { validateCreateBook } from "@/validation/bookValidation";
import { useToast } from "@chakra-ui/react";
import React, { createContext, SetStateAction, useState } from "react";
import { v4 } from "uuid";

type BookState = {
    bookForm: Book;
    setBookForm: React.Dispatch<SetStateAction<Book>>;
    characters: Character[];
    setCharacters: React.Dispatch<SetStateAction<Character[]>>;
    characterForm: Character;
    setCharacterForm: React.Dispatch<SetStateAction<Character>>;
    isOpenAddCharacter: boolean;
    openAddCharacter: () => void;
    handleAddCharacter: () => void;
    handleDeleteCharacter: (characterId: string) => void;
    handleSubmit: (book?: Book) => Promise<void>;
    errors: ValidationError[];
};

const defaultBookState: BookState = {
    bookForm: defaultBookForm,
    setBookForm: () => {},
    characters: [],
    setCharacters: () => {},
    characterForm: defaultCharacterForm,
    setCharacterForm: () => {},
    isOpenAddCharacter: false,
    openAddCharacter: () => {},
    handleAddCharacter: () => {},
    handleDeleteCharacter: () => {},
    handleSubmit: async () => {},
    errors: [],
};

export const BookCreateContext = createContext<BookState>(defaultBookState);

export const BookCreateProvider = ({ children }: any) => {
    const { user } = useAuth();
    const { toggleView } = useModal();
    const [bookForm, setBookForm] = useState<Book>(defaultBookForm);
    const [isOpenCharcterInput, setIsOpenCharacterInput] = useState(false);
    const [characters, setCharacters] = useState<Character[]>([]);
    const [characterForm, setCharacterForm] = useState<Character>({
        ...defaultCharacterForm,
        id: v4(),
    });
    const [errors, setErrors] = useState<ValidationError[]>([]);
    const toast = useToast();

    const openAddCharacter = () => {
        setIsOpenCharacterInput(true);
    };

    const handleAddCharacter = () => {
        setBookForm((prev) => ({
            ...prev,
            characterSnippets: [
                ...(prev.characterSnippets || []),
                CharacterUtils.toCharacterSnippet(characterForm),
            ],
        }));
        setCharacters((prev) => [...prev, characterForm]);
        setCharacterForm({
            ...defaultCharacterForm,
            id: v4(),
        });
        setIsOpenCharacterInput(false);
    };

    const handleDeleteCharacter = (characterId: string) => {
        setBookForm((prev) => ({
            ...prev,
            characterSnippets: prev.characterSnippets?.filter(
                (char) => char.id !== characterId
            ),
        }));
        setCharacters((prev) => prev.filter((char) => char.id !== characterId));
    };

    const handleSubmit = async (book?: Book) => {
        if (!user) {
            toggleView("login");
            return;
        }
        const valRes = await validateCreateBook(bookForm, book?.name);
        if (!valRes.result) {
            setErrors(valRes.errors);
            return;
        } else {
            setErrors([]);
        }
        if (!book) {
            await BookService.create({
                userId: user.uid,
                bookForm,
                characters,
            });
            toast({
                ...toastOption,
                title: "Tạo thành công",
                status: "success",
            });
            setBookForm(defaultBookForm);
            setCharacters([]);
            setCharacterForm(defaultCharacterForm);
        } else {
            await BookService.update({
                book,
                bookForm,
                userId: user.uid,
                characters,
            });
            toast({
                ...toastOption,
                title: book
                    ? "Thay đổi thông tin thành công"
                    : "Tạo thành công",
                status: "success",
            });
        }
    };

    return (
        <BookCreateContext.Provider
            value={{
                bookForm,
                setBookForm,
                characters,
                setCharacters,
                characterForm,
                setCharacterForm,
                isOpenAddCharacter: isOpenCharcterInput,
                openAddCharacter,
                handleAddCharacter,
                handleDeleteCharacter,
                handleSubmit,
                errors,
            }}
        >
            {children}
        </BookCreateContext.Provider>
    );
};
