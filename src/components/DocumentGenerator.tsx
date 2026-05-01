import { useState } from 'react'
import type { User, Playlist, DocumentFormat } from '../types'

interface DocumentGeneratorProps {
    user: User | null;
    playlists: Playlist[];
}

const DocumentGenerator = ({ user, playlists }: DocumentGeneratorProps) => {
    const [selectedFormat, setSelectedFormat] = useState<DocumentFormat | ''>('')
    const [selectedPlaylist, setSelectedPlaylist] = useState<string>('')

    const generateCSV = () => {
        if (!selectedPlaylist) { alert('Selecciona una playlist'); return; }
        const playlist = playlists.find(p => p.id === selectedPlaylist)
        if (!playlist) return

        const headers = ['Título', 'Artista', 'Duración (s)', 'Género', 'Año']
        const rows = playlist.songs.map(song => [`"${song.title}"`, `"${song.artist}"`, song.duration, song.genre, song.year])

        const csvContent = [
            `Playlist: ${playlist.name}`, `Descripción: ${playlist.description}`, `Usuario: ${user?.name}`, `Fecha: ${new Date().toLocaleDateString()}`, '',
            headers.join(','), ...rows.map(row => row.join(','))
        ].join('\n')

        downloadFile(csvContent, `playlist_${playlist.name}.csv`, 'text/csv')
    }

    const generateJSON = () => {
        if (!user) return
        const data = {
            usuario: { id: user.id, nombre: user.name, email: user.email, edad: user.age, país: user.country, géneroFavorito: user.favoriteGenre, fechaRegistro: new Date(user.createdAt).toLocaleDateString() },
            estadísticas: { totalPlaylists: playlists.length, totalCanciones: playlists.reduce((sum, p) => sum + p.songs.length, 0), playlistsConCanciones: playlists.filter(p => p.songs.length > 0).length },
            playlists: playlists.map(p => ({ id: p.id, nombre: p.name, descripción: p.description, totalCanciones: p.songs.length, duracionTotal: p.songs.reduce((sum, s) => sum + s.duration, 0), géneros: [...new Set(p.songs.map(s => s.genre))], fechaCreación: new Date(p.createdAt).toLocaleDateString() })),
            generadoEn: new Date().toISOString(),
        }
        downloadFile(JSON.stringify(data, null, 2), `reporte_personal_${user.name}.json`, 'application/json')
    }

    const downloadFile = (content: string, filename: string, mimeType: string) => {
        const blob = new Blob([content], { type: mimeType })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = filename
        link.click()
        window.URL.revokeObjectURL(url)
    }

    return (
        <div className="bg-zinc-800 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-zinc-100">Exportar Datos</h3>

            <div className="mb-4">
                <label className="block text-sm font-bold mb-2 text-zinc-300">Formato:</label>
                <div className="space-y-2 text-sm text-zinc-200">
                    <label className="flex items-center cursor-pointer">
                        <input type="radio" name="format" value="csv" checked={selectedFormat === 'csv'} onChange={(e) => setSelectedFormat(e.target.value as DocumentFormat)} className="mr-2 accent-zinc-500" />
                        <span>CSV - Datos de Playlist</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                        <input type="radio" name="format" value="json" checked={selectedFormat === 'json'} onChange={(e) => setSelectedFormat(e.target.value as DocumentFormat)} className="mr-2 accent-zinc-500" />
                        <span>JSON - Reporte Completo</span>
                    </label>
                </div>
            </div>

            {selectedFormat === 'csv' && (
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2 text-zinc-300">Selecciona Playlist:</label>
                    <select
                        value={selectedPlaylist}
                        onChange={(e) => setSelectedPlaylist(e.target.value)}
                        className="w-full p-2 bg-zinc-900 border  text-zinc-100 rounded text-sm outline-none focus:border-emerald-500"
                    >
                        <option value="">-- Seleccionar --</option>
                        {playlists.map(p => (
                            <option key={p.id} value={p.id}>{p.name} ({p.songs.length} pistas)</option>
                        ))}
                    </select>
                </div>
            )}

            <button
                onClick={selectedFormat === 'csv' ? generateCSV : generateJSON}
                disabled={!selectedFormat || (selectedFormat === 'csv' && !selectedPlaylist)}
                className="w-full bg-zinc-700 hover:bg-zinc-600 border border-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded transition-colors mt-2"
            >
                Descargar Archivo
            </button>
        </div>
    )
}

export default DocumentGenerator