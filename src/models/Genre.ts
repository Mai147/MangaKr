export interface GenreSnippet {
    id: string;
    name: string;
}

export interface Genre extends GenreSnippet {
    description: string;
    numberOfBooks: number;
}
