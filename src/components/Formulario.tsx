import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Error from './Error'
import type { DraftUser } from '../types'
import { useMusicStore } from '../store/store'

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i

const Formulario = () => {
    const user = useMusicStore((state) => state.user)
    const setUser = useMusicStore((state) => state.setUser)
    const updateUser = useMusicStore((state) => state.updateUser)
    const clearUser = useMusicStore((state) => state.clearUser)

    const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm<DraftUser>()

    useEffect(() => {
        if (user) {
            setValue('name', user.name)
            setValue('email', user.email)
            setValue('age', user.age)
            setValue('country', user.country)
            setValue('favoriteGenre', user.favoriteGenre)
        }
    }, [user, setValue])

    const handleRegistro = (data: DraftUser) => {
        if (user) {
            updateUser(data)
        } else {
            const newUser = {
                id: crypto.randomUUID(),
                ...data,
                createdAt: new Date().toISOString()
            }
            setUser(newUser)
        }
        reset()
    }

    const handleCancelar = () => {
        clearUser()
        reset()
    }

    const inputClasses = "w-full p-3 bg-zinc-900 text-zinc-100 rounded focus:outline-none focus:border-emerald-500 transition-colors"
    const labelClasses = "text-sm uppercase font-bold text-zinc-300 block mb-2"

    if (!user) {
        return (
            <div className="w-full">
                <h2 className="font-black text-3xl text-center text-zinc-100">QVL</h2>
                <p className="text-lg mt-3 text-center mb-8 text-zinc-400">
                    Regístrate para comenzar a escuchar
                </p>

                <form
                    className="rounded-lg py-8 px-6"
                    noValidate
                    onSubmit={handleSubmit(handleRegistro)}
                >
                    <div className="mb-5">
                        <label htmlFor="name" className={labelClasses}>Nombre Completo</label>
                        <input
                            id="name"
                            className={inputClasses}
                            type="text"
                            placeholder="Ej. Juan Pérez"
                            {...register('name', {
                                required: "El nombre es obligatorio",
                                minLength: { value: 3, message: "Mínimo 3 caracteres" }
                            })}
                        />
                        {errors.name && <Error>{errors.name?.message?.toString()}</Error>}
                    </div>

                    <div className="mb-5">
                        <label htmlFor="email" className={labelClasses}>Email</label>
                        <input
                            id="email"
                            className={inputClasses}
                            type="email"
                            placeholder="tu@email.com"
                            {...register('email', {
                                required: "El email es obligatorio",
                                validate: (value) => emailRegex.test(value) || "Email inválido"
                            })}
                        />
                        {errors.email && <Error>{errors.email?.message?.toString()}</Error>}
                    </div>

                    <div className="mb-5">
                        <label htmlFor="age" className={labelClasses}>Edad</label>
                        <input
                            id="age"
                            className={inputClasses}
                            type="number"
                            placeholder="18"
                            {...register('age', {
                                required: "La edad es obligatoria",
                                min: { value: 13, message: "Debes tener al menos 13 años" },
                                max: { value: 120, message: "Edad inválida" }
                            })}
                        />
                        {errors.age && <Error>{errors.age?.message?.toString()}</Error>}
                    </div>

                    <div className="mb-5">
                        <label htmlFor="country" className={labelClasses}>País</label>
                        <input
                            id="country"
                            className={inputClasses}
                            type="text"
                            placeholder="México"
                            {...register('country', {
                                required: "El país es obligatorio"
                            })}
                        />
                        {errors.country && <Error>{errors.country?.message?.toString()}</Error>}
                    </div>

                    <div className="mb-8">
                        <label htmlFor="genre" className={labelClasses}>Género Favorito</label>
                        <select
                            id="genre"
                            className={inputClasses}
                            {...register('favoriteGenre', {
                                required: "Selecciona un género"
                            })}
                        >
                            <option value="">-- Selecciona un género --</option>
                            <option value="Pop">Pop</option>
                            <option value="Rock">Rock</option>
                            <option value="Jazz">Jazz</option>
                            <option value="Soul">Soul</option>
                            <option value="Synthwave">Synthwave</option>
                            <option value="Indie">Indie</option>
                            <option value="Disco Pop">Disco Pop</option>
                        </select>
                        {errors.favoriteGenre && <Error>{errors.favoriteGenre?.message?.toString()}</Error>}
                    </div>

                    <input
                        type="submit"
                        value="Registrarse"
                        className="w-full bg-zinc-600 text-zinc-900 p-3 uppercase font-bold rounded hover:bg-zinc-500 cursor-pointer transition-colors"
                    />
                </form>
            </div>
        )
    }

    return (
        <div className="rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-zinc-100">Editar Perfil</h3>

            <form noValidate onSubmit={handleSubmit(handleRegistro)}>
                <div className="mb-4">
                    <label htmlFor="name" className={labelClasses}>Nombre Completo</label>
                    <input id="name" className={inputClasses} type="text" {...register('name', { required: "Obligatorio", minLength: { value: 3, message: "Mínimo 3 caracteres" } })} />
                    {errors.name && <Error>{errors.name?.message?.toString()}</Error>}
                </div>

                <div className="mb-4">
                    <label htmlFor="email" className={labelClasses}>Email</label>
                    <input id="email" className={inputClasses} type="email" {...register('email', { required: "Obligatorio", validate: (value) => emailRegex.test(value) || "Inválido" })} />
                    {errors.email && <Error>{errors.email?.message?.toString()}</Error>}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label htmlFor="age" className={labelClasses}>Edad</label>
                        <input id="age" className={inputClasses} type="number" {...register('age', { required: "Obligatorio", min: { value: 13, message: "Mín. 13" } })} />
                        {errors.age && <Error>{errors.age?.message?.toString()}</Error>}
                    </div>
                    <div>
                        <label htmlFor="country" className={labelClasses}>País</label>
                        <input id="country" className={inputClasses} type="text" {...register('country', { required: "Obligatorio" })} />
                        {errors.country && <Error>{errors.country?.message?.toString()}</Error>}
                    </div>
                </div>

                <div className="mb-6">
                    <label htmlFor="genre" className={labelClasses}>Género Favorito</label>
                    <select id="genre" className={inputClasses} {...register('favoriteGenre', { required: "Obligatorio" })}>
                        <option value="Pop">Pop</option>
                        <option value="Rock">Rock</option>
                        <option value="Jazz">Jazz</option>
                        <option value="Soul">Soul</option>
                        <option value="Synthwave">Synthwave</option>
                        <option value="Indie">Indie</option>
                        <option value="Disco Pop">Disco Pop</option>
                    </select>
                </div>

                <div className="flex flex-col gap-3">
                    <input
                        type="submit"
                        value="Guardar Cambios"
                        className="w-full bg-zinc-700 text-white p-3 uppercase font-bold rounded hover:bg-zinc-600 cursor-pointer border border-zinc-600 transition-colors"
                    />
                    <button
                        type="button"
                        onClick={handleCancelar}
                        className="w-full bg-red-900/50 text-red-400 border border-red-900/50 p-3 uppercase font-bold rounded hover:bg-red-900 cursor-pointer transition-colors"
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </form>
        </div>
    )
}

export default Formulario