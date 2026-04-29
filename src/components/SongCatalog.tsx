import { useState, useRef } from 'react'
import { useMusicStore } from '../store/store'

const SongCatalog = () => {
    const user = useMusicStore((state) => state.user)
    const playlists = useMusicStore((state) => state.playlists)
    const allSongs = useMusicStore((state) => state.allSongs)
    const fetchDeezerSongs = useMusicStore((state) => state.fetchDeezerSongs)
    const isLoadingSongs = useMusicStore((state) => state.isLoadingSongs)
    const addSongToPlaylist = useMusicStore((state) => state.addSongToPlaylist)
    
    const [searchQuery, setSearchQuery] = useState('')
    
    const [previewSongId, setPreviewSongId] = useState<string | null>(null)
    const audioRef = useRef<HTMLAudioElement>(null)

    const userPlaylists = user ? playlists.filter(p => p.userId === user.id) : []

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            fetchDeezerSongs(searchQuery)
        }
    }

    const togglePreview = (songId: string, url?: string) => {
        if (!url) return;
        if (previewSongId === songId) {
            audioRef.current?.pause();
            setPreviewSongId(null);
        } else {
            setPreviewSongId(songId);
            if (audioRef.current) {
                audioRef.current.src = url;
                audioRef.current.play();
            }
        }
    }

    return (
        <div className="bg-zinc-900 rounded-sm flex flex-col h-full shadow-xl overflow-hidden">
            {/* Audio oculto para los previews */}
            <audio ref={audioRef} onEnded={() => setPreviewSongId(null)} />

            {/* Header del Catálogo (Sin borde inferior) */}
            <div className="p-4 flex justify-between items-center bg-black/20">
                <h2 className="font-medium text-sm tracking-widest uppercase text-zinc-300">Explorar Catálogo</h2>
                <span className="text-xs font-mono text-zinc-500 bg-zinc-950 px-2 py-1 rounded-sm">
                    {allSongs.length} pistas
                </span>
            </div>

            {/* Lista de Canciones */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                {isLoadingSongs ? (
                    <div className="h-full flex items-center justify-center text-zinc-500 text-xs tracking-widest uppercase animate-pulse">
                        Buscando en la red...
                    </div>
                ) : allSongs.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-zinc-600 text-sm">
                        No se encontraron canciones
                    </div>
                ) : (
                    <div className="space-y-2">
                        {allSongs.map((song) => (
                            <div
                                key={song.id}
                                className="bg-zinc-950/50 rounded-sm p-3 hover:bg-zinc-800 transition-colors flex items-center gap-4 group"
                            >
                                {/* Miniatura interactiva (Click para Preview) */}
                                <div 
                                    className="relative w-12 h-12 flex-shrink-0 cursor-pointer overflow-hidden rounded-sm bg-zinc-800"
                                    onClick={() => togglePreview(song.id, song.previewUrl)}
                                >
                                    {song.coverUrl ? (
                                        <img src={song.coverUrl} alt={song.title} className={`w-full h-full object-cover transition-opacity ${previewSongId === song.id ? 'opacity-40' : 'opacity-90 group-hover:opacity-50'}`} />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-zinc-600">♪</div>
                                    )}

                                    {/* Overlay Visualizer o Icono Play */}
                                    {previewSongId === song.id ? (
                                        <div className="absolute inset-0 flex items-center justify-center gap-[3px]">
                                            {[0.6, 0.9, 0.5, 0.8].map((delay, i) => (
                                                <div key={i} className="w-1 h-4 bg-zinc-100 rounded-full animate-pulse" style={{ animationDelay: `${delay}s`, animationDuration: '0.9s' }} />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <svg className="w-6 h-6 fill-zinc-100" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <h3 className={`font-medium text-sm truncate ${previewSongId === song.id ? 'text-white' : 'text-zinc-200'}`}>{song.title}</h3>
                                    <p className="text-zinc-500 text-xs truncate mt-0.5">{song.artist}</p>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="text-right hidden sm:block">
                                        <span className="block text-xs text-zinc-500 font-mono mb-0.5">{song.genre}</span>
                                        <span className="block text-[10px] text-zinc-600">{song.year}</span>
                                    </div>

                                    {userPlaylists.length > 0 ? (
                                        <select 
                                            className="appearance-none bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs px-3 py-1.5 rounded-sm outline-none cursor-pointer transition-colors text-center shadow-sm"
                                            onChange={(e) => {
                                                if(e.target.value) {
                                                    addSongToPlaylist(e.target.value, song);
                                                    e.target.value = "";
                                                }
                                            }}
                                            defaultValue=""
                                        >
                                            <option value="" disabled>♥</option>
                                            {userPlaylists.map(p => {
                                                const yaExiste = p.songs.some(s => s.id === song.id);
                                                return (
                                                    <option key={p.id} value={p.id} disabled={yaExiste}>
                                                        {p.name} {yaExiste ? '(Añadida)' : ''}
                                                    </option>
                                                )
                                            })}
                                        </select>
                                    ) : (
                                        <span className="text-[10px] text-zinc-600 uppercase tracking-widest mr-2">Sin playlists</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Buscador (Sin borde superior) */}
            <div className="p-4 bg-black/20">
                <form onSubmit={handleSearch} className="flex gap-3">
                    <input 
                        type="text"
                        placeholder="Buscar artista o canción..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 bg-zinc-950 text-zinc-200 text-sm rounded-sm px-4 py-2.5 outline-none placeholder-zinc-600 transition-colors shadow-inner"
                    />
                    <button 
                        type="submit"
                        disabled={isLoadingSongs || !searchQuery.trim()}
                        className="bg-zinc-200 text-zinc-900 px-6 py-2.5 rounded-sm text-sm font-medium hover:bg-white transition-colors disabled:opacity-50"
                    >
                        Buscar
                    </button>
                </form>
            </div>
        </div>
    )
}

export default SongCatalog