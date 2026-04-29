import { useForm } from 'react-hook-form'
import { useMusicStore } from '../store/store'
import type { DraftPlaylist } from '../types'
import Error from './Error'

const PlaylistForm = () => {
    const user = useMusicStore((state) => state.user)
    const addPlaylist = useMusicStore((state) => state.addPlaylist)
    const { register, handleSubmit, formState: { errors }, reset } = useForm<DraftPlaylist>()

    const handleCreatePlaylist = (data: DraftPlaylist) => {
        if (!user) return
        addPlaylist(data)
        reset()
    }

    if (!user) return null

    const inputClasses = "w-full p-2 bg-zinc-900 border text-zinc-100 rounded focus:outline-none focus:border-emerald-500 transition-colors"
    const labelClasses = "block text-sm font-bold mb-2 text-zinc-300"

    return (
        <div className="rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-zinc-100">Crear Playlist</h3>

            <form onSubmit={handleSubmit(handleCreatePlaylist)} noValidate className="space-y-4">
                <div>
                    <label className={labelClasses}>Nombre:</label>
                    <input
                        type="text"
                        placeholder="Ej. Para estudiar"
                        className={inputClasses}
                        {...register('name', {
                            required: "El nombre es obligatorio",
                            minLength: { value: 3, message: "Mínimo 3 caracteres" },
                            maxLength: { value: 50, message: "Máximo 50 caracteres" }
                        })}
                    />
                    {errors.name && <Error>{errors.name.message}</Error>}
                </div>

                <div>
                    <label className={labelClasses}>Descripción:</label>
                    <textarea
                        placeholder="Breve descripción..."
                        className={inputClasses}
                        rows={2}
                        {...register('description', {
                            required: "La descripción es obligatoria",
                            minLength: { value: 5, message: "Mínimo 5 caracteres" },
                            maxLength: { value: 200, message: "Máximo 200 caracteres" }
                        })}
                    />
                    {errors.description && <Error>{errors.description.message}</Error>}
                </div>

                <button
                    type="submit"
                    className="w-full bg-zinc-600 hover:bg-zinc-500 text-zinc-900 font-bold py-2 px-4 rounded transition-colors"
                >
                    Guardar Playlist
                </button>
            </form>
        </div>
    )
}

export default PlaylistForm