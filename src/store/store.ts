import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { DraftUser, User, Song, Playlist, DraftPlaylist } from '../types';
import { v4 as uuidv4 } from 'uuid';

type MusicStoreState = {
    user: User | null;
    savedUsers: User[];
    setUser: (user: User) => void;
    updateUser: (data: DraftUser) => void;
    clearUser: () => void;
    
    allSongs: Song[];
    isLoadingSongs: boolean;
    fetchDeezerSongs: (query?: string) => Promise<void>;
    
    playlists: Playlist[];
    currentPlaylist: Playlist | null;
    setCurrentPlaylist: (playlist: Playlist) => void;
    addPlaylist: (data: DraftPlaylist) => void;
    removePlaylist: (id: string) => void;
    updatePlaylist: (id: string, data: DraftPlaylist) => void;
    addSongToPlaylist: (playlistId: string, song: Song) => void;
    removeSongFromPlaylist: (playlistId: string, songId: string) => void;
}

const crearPlaylist = (data: DraftPlaylist, userId: string): Playlist => ({
    id: uuidv4(),
    userId,
    name: data.name,
    description: data.description,
    songs: data.songs || [],
    createdAt: new Date().toISOString()
})

export const useMusicStore = create<MusicStoreState>()(
    persist(
        (set) => ({
            user: null,
            savedUsers: [],
            setUser: (user) => set((state) => {
                const alreadySaved = state.savedUsers.find(u => u.email === user.email);
                return { 
                    user, 
                    savedUsers: alreadySaved ? state.savedUsers : [...state.savedUsers, user] 
                };
            }),
            updateUser: (data) => set((state) => ({ user: state.user ? { ...state.user, ...data } : null })),
            clearUser: () => set({ user: null }),
            
            allSongs: [],
            isLoadingSongs: false,
            
            fetchDeezerSongs: async (query = 'synthwave') => {
                set({ isLoadingSongs: true });
                try {
                    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&limit=20`;
                    
                    const response = await fetch(url);
                    const data = await response.json();

                    if (data && data.results) {
                        const mappedSongs: Song[] = data.results.map((track: any) => ({
                            id: track.trackId.toString(),
                            title: track.trackName,
                            artist: track.artistName,
                            duration: Math.floor(track.trackTimeMillis / 1000), 
                            genre: track.primaryGenreName,
                            year: new Date(track.releaseDate).getFullYear(),
                            previewUrl: track.previewUrl, // El audio real de 30s
                            coverUrl: track.artworkUrl100.replace('100x100bb', '300x300bb') 
                        }));
                        set({ allSongs: mappedSongs, isLoadingSongs: false });
                    }
                } catch (error) {
                    console.error("Error fetching from iTunes", error);
                    set({ isLoadingSongs: false });
                }
            },
            
            playlists: [],
            currentPlaylist: null,
            setCurrentPlaylist: (playlist) => set({ currentPlaylist: playlist }),
            addPlaylist: (data) => set((state) => {
                if (!state.user) return state;
                return { playlists: [...state.playlists, crearPlaylist(data, state.user.id)] };
            }),
            removePlaylist: (id) => set((state) => ({
                playlists: state.playlists.filter(p => p.id !== id),
                currentPlaylist: state.currentPlaylist?.id === id ? null : state.currentPlaylist
            })),
            updatePlaylist: (id, data) => set((state) => ({
                playlists: state.playlists.map(p => p.id === id ? { ...p, name: data.name, description: data.description } : p)
            })),
            addSongToPlaylist: (playlistId, song) => set((state) => ({
                playlists: state.playlists.map(p => p.id === playlistId && !p.songs.find(s => s.id === song.id) ? { ...p, songs: [...p.songs, song] } : p),
            })),
            removeSongFromPlaylist: (playlistId, songId) => set((state) => ({
                playlists: state.playlists.map(p => p.id === playlistId ? { ...p, songs: p.songs.filter(s => s.id !== songId) } : p),
            }))
        }),
        { name: 'music-store-storage' }
    )
)