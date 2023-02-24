import { Book } from "@/models/Book";
import { Character } from "@/models/Character";
import React, { createContext, SetStateAction, useState } from "react";
import { v4 } from "uuid";

type BookState = {
    bookForm: Book;
    setBookForm: React.Dispatch<SetStateAction<Book>>;
    characterForm: Character;
    setCharacterForm: React.Dispatch<SetStateAction<Character>>;
    isOpenAddCharacter: boolean;
    openAddCharacter: () => void;
    handleAddCharacter: () => void;
    handleDeleteCharacter: (characterId: string) => void;
    handleCreateBook: () => Promise<void>;
};

const defaultBookForm: Book = {
    name: "",
    description: "",
    chapters: "",
    characters: "",
    authorIds: [],
    genreIds: [],
    characterSnippets: [],
    plot: "",
    publishedDate: undefined,
    status: "",
    volumes: "",
    rating: 0,
    popularity: 0,
    numberOfRates: 0,
    numberOfComments: 0,
    numberOfReviews: 0,
    writerId: "1",
};

const defaultCharacterForm: Character = {
    bookId: "",
    name: "",
    numberOfDislikes: 0,
    numberOfLikes: 0,
    bio: ``,
    role: "",
};

const defaultBookState: BookState = {
    bookForm: defaultBookForm,
    setBookForm: () => {},
    characterForm: defaultCharacterForm,
    setCharacterForm: () => {},
    isOpenAddCharacter: false,
    openAddCharacter: () => {},
    handleAddCharacter: () => {},
    handleDeleteCharacter: () => {},
    handleCreateBook: async () => {},
};

export const BookContext = createContext<BookState>(defaultBookState);

export const BookProvider = ({ children }: any) => {
    const [bookForm, setBookForm] = useState<Book>(defaultBookForm);
    const [isOpenCharcterInput, setIsOpenCharacterInput] = useState(false);
    const [characterForm, setCharacterForm] = useState<Character>({
        ...defaultCharacterForm,
        id: v4(),
    });

    const openAddCharacter = () => {
        setIsOpenCharacterInput(true);
    };

    const handleAddCharacter = () => {
        setBookForm((prev) => ({
            ...prev,
            characterSnippets: [
                ...(prev.characterSnippets || []),
                characterForm,
            ],
        }));
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
    };

    const handleCreateBook = async () => {};

    return (
        <BookContext.Provider
            value={{
                bookForm,
                setBookForm,
                characterForm,
                setCharacterForm,
                isOpenAddCharacter: isOpenCharcterInput,
                openAddCharacter,
                handleAddCharacter,
                handleDeleteCharacter,
                handleCreateBook,
            }}
        >
            {children}
        </BookContext.Provider>
    );
};
