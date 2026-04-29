import { useState, useEffect, useRef } from 'react'
import type { Song } from '../types'

interface MusicPlayerProps {
    songs: Song[];
}

const MusicPlayer = ({ songs }: MusicPlayerProps) => {
    const [currentSongIndex, setCurrentSongIndex] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    
    const audioRef = useRef<HTMLAudioElement>(null)
    const currentSong = songs.length > 0 ? songs[currentSongIndex] : null

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play().catch(() => setIsPlaying(false));
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, currentSongIndex]);

    useEffect(() => {
        setCurrentTime(0);
        setIsPlaying(true); 
    }, [currentSongIndex]);

    const handlePlayPause = () => setIsPlaying(!isPlaying)
    
    const handleNext = () => {
        if (currentSongIndex < songs.length - 1) {
            setCurrentSongIndex(currentSongIndex + 1)
        } else {
            setIsPlaying(false)
        }
    }
    
    const handlePrev = () => {
        if (currentSongIndex > 0) {
            setCurrentSongIndex(currentSongIndex - 1)
        }
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    if (songs.length === 0 || !currentSong) {
        return (
            <div className="bg-zinc-900 rounded-sm p-8 text-center text-zinc-500 shadow-xl">
                <p>Ninguna pista seleccionada</p>
            </div>
        )
    }

    const durationToUse = currentSong.previewUrl ? 30 : currentSong.duration;

    return (
        <div className="bg-zinc-900 rounded-sm p-6 shadow-xl">
            <audio 
                ref={audioRef}
                src={currentSong.previewUrl}
                onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                onEnded={handleNext}
            />

            {/* Portada sin visualizador */}
            <div className="text-center mb-8">
                <div className="w-48 h-48 bg-zinc-800 rounded-sm mx-auto mb-6 flex items-center justify-center overflow-hidden shadow-md">
                    {currentSong.coverUrl ? (
                        <img src={currentSong.coverUrl} alt={currentSong.title} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-4xl text-zinc-600">♪</span>
                    )}
                </div>
                <h3 className="text-lg font-bold text-zinc-100">{currentSong.title}</h3>
                <p className="text-zinc-500 text-sm mt-1">{currentSong.artist}</p>
            </div>

            {/* Barra de Progreso */}
            <div className="mb-8">
                <div className="bg-zinc-800 h-1 mb-2 w-full cursor-pointer relative rounded-full overflow-hidden" 
                     onClick={(e) => {
                        if(audioRef.current) {
                            const bounds = e.currentTarget.getBoundingClientRect();
                            const x = e.clientX - bounds.left;
                            const percentage = x / bounds.width;
                            audioRef.current.currentTime = percentage * durationToUse;
                        }
                     }}>
                    <div
                        className="bg-zinc-300 h-full transition-all"
                        style={{ width: `${(currentTime / durationToUse) * 100}%` }}
                    ></div>
                </div>
                <div className="flex justify-between text-xs text-zinc-500 font-mono">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(durationToUse)}</span>
                </div>
            </div>

            {/* Controles */}
            <div className="flex justify-center items-center gap-8 mb-6">
                <button onClick={handlePrev} disabled={currentSongIndex === 0} className="text-zinc-500 hover:text-zinc-300 disabled:opacity-20 transition-colors">
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
                </button>
                
                <button onClick={handlePlayPause} className="bg-zinc-100 text-zinc-900 w-12 h-12 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                    {isPlaying ? (
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                    ) : (
                        <svg className="w-6 h-6 fill-current ml-1" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    )}
                </button>
                
                <button onClick={handleNext} disabled={currentSongIndex === songs.length - 1} className="text-zinc-500 hover:text-zinc-300 disabled:opacity-20 transition-colors">
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
                </button>
            </div>

            {/* Cola (Sin bordes) */}
            <div className="mt-8 pt-4 relative">
                <p className="text-xs text-zinc-600 uppercase tracking-widest mb-4">Cola de reproducción</p>
                
                <div className="space-y-1 h-32 overflow-y-auto pr-2 custom-scrollbar">
                    {songs.map((song, index) => (
                        <div
                            key={song.id}
                            onClick={() => {
                                setCurrentSongIndex(index);
                                setIsPlaying(true);
                            }}
                            className={`p-2 text-sm flex justify-between items-center cursor-pointer rounded-sm transition-colors ${
                                index === currentSongIndex
                                    ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                                    : 'text-zinc-500 hover:bg-zinc-800/50'
                            }`}
                        >
                            <div className="flex-1 truncate pr-4">
                                <span className="font-medium block">{song.title}</span>
                                <span className="text-xs opacity-60">{song.artist}</span>
                            </div>
                            <span className="text-xs font-mono">{song.previewUrl ? '0:30' : formatTime(song.duration)}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default MusicPlayer