import { useState, useEffect } from 'react'
import Formulario from './components/Formulario'
import SongCatalog from './components/SongCatalog'
import MusicPlayer from './components/MusicPlayer'
import PlaylistForm from './components/PlaylistForm'
import PlaylistList from './components/PlaylistList'
import DocumentGenerator from './components/DocumentGenerator'
import AboutMeDialog from './components/AboutMeDialog'
import SubscriptionModal from './components/SubscriptionModal'
import { useMusicStore } from './store/store'

function App() {
    const [showAboutMe, setShowAboutMe] = useState(false)
    const [showSubs, setShowSubs] = useState(false)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [activePlaylistId, setActivePlaylistId] = useState<string>('') 
    
    const user = useMusicStore((state) => state.user)
    const savedUsers = useMusicStore((state) => state.savedUsers)
    const setUser = useMusicStore((state) => state.setUser)
    const playlists = useMusicStore((state) => state.playlists)
    const allSongs = useMusicStore((state) => state.allSongs)
    const fetchDeezerSongs = useMusicStore((state) => state.fetchDeezerSongs)

    useEffect(() => {
        if (allSongs.length === 0) {
            fetchDeezerSongs('synthwave'); 
        }
    }, []);

    useEffect(() => {
        if (!user) {
            setIsSidebarOpen(false);
            setShowAboutMe(false);
            setShowSubs(false);
        }
    }, [user]);

    useEffect(() => {
        if (user && (isSidebarOpen || showSubs || showAboutMe)) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [user, isSidebarOpen, showSubs, showAboutMe]);

    const userPlaylists = user ? playlists.filter(p => p.userId === user.id) : []
    const playerSongs = activePlaylistId 
        ? userPlaylists.find(p => p.id === activePlaylistId)?.songs || [] 
        : allSongs;

    return (
        <>
            <div className="min-h-screen bg-zinc-950 text-zinc-300 font-sans flex flex-col">
                {/* Header */}
                <header className="bg-black relative z-20 shadow-md">
                    <div className="container mx-auto px-6 py-5 flex justify-between items-center">
                        <div className="flex items-center gap-6">
                            {user && (
                                <button 
                                    onClick={() => setIsSidebarOpen(true)}
                                    className="text-zinc-500 hover:text-zinc-100 transition-colors p-1"
                                >
                                    <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
                                        <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
                                    </svg>
                                </button>
                            )}
                            <h1 className="text-xl font-medium tracking-wide text-zinc-100">
                                QVL
                            </h1>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            {user && (
                                <>
                                    <button
                                        onClick={() => setShowSubs(true)}
                                        className="text-[10px] tracking-widest uppercase text-zinc-400 hover:text-zinc-100 transition-colors bg-zinc-900 px-4 py-2 rounded-sm"
                                    >
                                        Suscripciones
                                    </button>
                                    <button
                                        onClick={() => setShowAboutMe(true)}
                                        className="text-[10px] tracking-widest uppercase text-zinc-400 hover:text-zinc-100 transition-colors bg-zinc-900 px-4 py-2 rounded-sm"
                                    >
                                        Perfil
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* Contenido Principal con Scroll habilitado */}
                <main className="flex-1 overflow-y-auto p-6 relative custom-scrollbar">
                    {!user ? (
                        <div className="max-w-md mx-auto mt-10 pb-24">
                            {savedUsers && savedUsers.length > 0 && (
                                <div className="mb-10">
                                    <h2 className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 mb-6 text-center">Perfiles Guardados</h2>
                                    <div className="grid grid-cols-2 gap-4">
                                        {savedUsers.map(u => (
                                            <button 
                                                key={u.id}
                                                onClick={() => setUser(u)}
                                                className="bg-zinc-900 p-5 rounded-sm hover:bg-zinc-800 transition-colors text-left group"
                                            >
                                                <p className="text-sm font-bold text-zinc-200 group-hover:text-white">{u.name}</p>
                                                <p className="text-[10px] text-zinc-600 truncate mt-1">{u.email}</p>
                                            </button>
                                        ))}
                                    </div>
                                    <div className="relative my-10 text-center">
                                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-900"></div></div>
                                        <span className="relative bg-zinc-950 px-4 text-[9px] text-zinc-700 uppercase tracking-widest">O registrar nuevo</span>
                                    </div>
                                </div>
                            )}
                            <Formulario />
                        </div>
                    ) : (
                        <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 pb-10">
                            <div className="flex-1 flex flex-col max-w-[480px] mx-auto lg:mx-0 w-full">
                                <div className="mb-4">
                                    <label className="text-[10px] text-zinc-600 uppercase tracking-widest mb-2 block">Biblioteca</label>
                                    <select 
                                        className="w-full bg-zinc-900 text-zinc-300 text-sm rounded-sm p-3 outline-none transition-colors appearance-none cursor-pointer"
                                        value={activePlaylistId}
                                        onChange={(e) => setActivePlaylistId(e.target.value)}
                                    >
                                        <option value="">Catálogo Global</option>
                                        <optgroup label="Mis Playlists">
                                            {userPlaylists.map(p => (
                                                <option key={p.id} value={p.id}>{p.name}</option>
                                            ))}
                                        </optgroup>
                                    </select>
                                </div>
                                <MusicPlayer songs={playerSongs} />
                            </div>

                            <div className="flex-1 flex flex-col h-[calc(100vh-160px)] min-h-[550px]">
                                <SongCatalog />
                            </div>
                        </div>
                    )}
                </main>

                {/* Menú Lateral */}
                {user && (
                    <>
                        {isSidebarOpen && (
                            <div 
                                className="fixed inset-0 bg-black/80 z-40 backdrop-blur-sm transition-opacity"
                                onClick={() => setIsSidebarOpen(false)}
                            />
                        )}

                        <div className={`fixed inset-y-0 left-0 w-full sm:w-[450px] bg-zinc-950 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-50 overflow-y-auto custom-scrollbar shadow-2xl`}>
                            <div className="p-8">
                                <div className="flex justify-between items-center mb-10">
                                    <h2 className="text-xs font-medium tracking-[0.3em] uppercase text-zinc-500">Administración</h2>
                                    <button 
                                        onClick={() => setIsSidebarOpen(false)} 
                                        className="text-zinc-600 hover:text-white text-3xl leading-none transition-colors"
                                    >
                                        &times;
                                    </button>
                                </div>
                                
                                <div className="space-y-12 pb-10">
                                    <PlaylistForm />
                                    <PlaylistList />
                                    <DocumentGenerator user={user} playlists={userPlaylists} />
                                    <Formulario />
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <SubscriptionModal isOpen={showSubs} onClose={() => setShowSubs(false)} />
            <AboutMeDialog isOpen={showAboutMe} onClose={() => setShowAboutMe(false)} />
        </>
    )
}

export default App