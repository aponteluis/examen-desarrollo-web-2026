import { useMusicStore } from '../store/store'

const PlaylistList = () => {
    const user = useMusicStore((state) => state.user)
    const playlists = useMusicStore((state) => state.playlists)
    const allSongs = useMusicStore((state) => state.allSongs)
    const removePlaylist = useMusicStore((state) => state.removePlaylist)
    const addSongToPlaylist = useMusicStore((state) => state.addSongToPlaylist)
    const removeSongFromPlaylist = useMusicStore((state) => state.removeSongFromPlaylist)

    if (!user) return null

    const userPlaylists = playlists.filter(p => p.userId === user.id)

    return (
        <div className="rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-zinc-400">Mis Playlists</h3>

            {userPlaylists.length === 0 ? (
                <p className="text-zinc-500 text-center py-6 text-sm">No tienes playlists aún.</p>
            ) : (
                <div className="space-y-4">
                    {userPlaylists.map((playlist) => (
                        <div key={playlist.id} className="bg-zinc-900 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h4 className="font-bold text-zinc-100">{playlist.name}</h4>
                                    <p className="text-zinc-400 text-sm">{playlist.description}</p>
                                    <p className="text-zinc-500 text-xs mt-1 font-mono">
                                        {playlist.songs.length} pistas
                                    </p>
                                </div>
                                <button
                                    onClick={() => removePlaylist(playlist.id)}
                                    className="text-red-400 hover:text-red-300 text-sm p-1 transition-colors"
                                    title="Eliminar playlist"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Add Song Section */}
                            <div className="mb-3">
                                <select
                                    onChange={(e) => {
                                        const song = allSongs.find(s => s.id === e.target.value)
                                        if (song && !playlist.songs.find(s => s.id === song.id)) {
                                            addSongToPlaylist(playlist.id, song)
                                        }
                                        e.target.value = ""
                                    }}
                                    defaultValue=""
                                    className="w-full p-2 rounded text-sm text-zinc-300 outline-none"
                                >
                                    <option value="">+ Agregar canción...</option>
                                    {allSongs.map(song => (
                                        <option
                                            key={song.id}
                                            value={song.id}
                                            disabled={!!playlist.songs.find(s => s.id === song.id)}
                                        >
                                            {song.title} - {song.artist}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Songs List */}
                            {playlist.songs.length > 0 && (
                                <div className="space-y-1 mt-3">
                                    {playlist.songs.map((song, idx) => (
                                        <div key={song.id} className="flex justify-between items-center p-2 rounded text-sm border">
                                            <div className="flex-1 truncate">
                                                <span className="font-medium text-zinc-200">{idx + 1}. {song.title}</span>
                                                <span className="text-zinc-500 text-xs ml-2">{song.artist}</span>
                                            </div>
                                            <button
                                                onClick={() => removeSongFromPlaylist(playlist.id, song.id)}
                                                className="text-zinc-500 hover:text-red-400 ml-2 px-2"
                                            >
                                                -
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default PlaylistList