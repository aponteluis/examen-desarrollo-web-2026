import { useMusicStore } from '../store/store'

interface AboutMeDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

const AboutMeDialog = ({ isOpen, onClose }: AboutMeDialogProps) => {
    const user = useMusicStore((state) => state.user)
    const playlists = useMusicStore((state) => state.playlists)

    if (!isOpen || !user) return null

    const userPlaylists = playlists.filter(p => p.userId === user.id)
    const totalSongs = userPlaylists.reduce((sum, p) => sum + p.songs.length, 0)
    
    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-zinc-900 rounded-xl max-w-lg w-full text-zinc-100 shadow-2xl overflow-hidden">
                {/* Header Profile */}
                <div className="bg-zinc-800 p-8 text-center border-b relative">
                    <button onClick={onClose} className="absolute top-4 right-4 text-zinc-400 hover:text-white text-xl">✕</button>
                    <div className="w-20 h-20 bg-zinc-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                        <span className="text-3xl text-zinc-900 font-bold">{user.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <h2 className="text-2xl font-bold">{user.name}</h2>
                    <p className="text-zinc-400 text-sm">{user.email}</p>
                </div>

                {/* Stats Grid */}
                <div className="p-6">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-zinc-800 p-4 rounded-lg">
                            <p className="text-xs text-zinc-400 uppercase tracking-wider mb-1">País</p>
                            <p className="font-semibold">{user.country}</p>
                        </div>
                        <div className="bg-zinc-800 p-4 rounded-lg">
                            <p className="text-xs text-zinc-400 uppercase tracking-wider mb-1">Género Favorito</p>
                            <p className="font-semibold text-zinc-100">{user.favoriteGenre}</p>
                        </div>
                    </div>

                    <div className="bg-zinc-950 p-4 rounded-lg flex justify-around text-center mb-6">
                        <div>
                            <p className="text-3xl font-black text-white">{userPlaylists.length}</p>
                            <p className="text-xs text-zinc-500 uppercase mt-1">Playlists</p>
                        </div>
                        <div className="w-px bg-zinc-800"></div>
                        <div>
                            <p className="text-3xl font-black text-white">{totalSongs}</p>
                            <p className="text-xs text-zinc-500 uppercase mt-1">Canciones</p>
                        </div>
                        <div className="w-px bg-zinc-800"></div>
                        <div>
                            <p className="text-3xl font-black text-white">{user.age}</p>
                            <p className="text-xs text-zinc-500 uppercase mt-1">Años</p>
                        </div>
                    </div>

                    <button onClick={onClose} className="w-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 text-white font-medium py-3 px-4 rounded-lg transition-colors">
                        Cerrar Perfil
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AboutMeDialog