// User Types
export type User = {
    id: string;
    name: string;
    email: string;
    age: number;
    country: string;
    favoriteGenre: string;
    createdAt: string;
}

export type DraftUser = Omit<User, 'id' | 'createdAt'>;

// Song Types
export type Song = {
    id: string;
    title: string;
    artist: string;
    duration: number;
    genre: string;
    year: number;
    previewUrl?: string;
    coverUrl?: string;
}

// Playlist Types
export type Playlist = {
    id: string;
    userId: string;
    name: string;
    description: string;
    songs: Song[];
    createdAt: string;
}

export type DraftPlaylist = Omit<Playlist, 'id' | 'userId' | 'createdAt' | 'songs'> & { songs?: Song[] };

// Document Types
export type DocumentFormat = 'csv' | 'json' | 'pdf';