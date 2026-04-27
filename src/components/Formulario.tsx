import { useForm } from 'react-hook-form'
import { usePacienteStore } from '../store/store'
import type { DraftPatient } from '../types'
import Error from './Error'

const Formulario = () => {
    const agregarPaciente = usePacienteStore((state) => state.agregarPaciente)
    const { register, handleSubmit, reset, formState: { errors } } = useForm<DraftPatient>({
        defaultValues: {
            name: '',
            caretaker: '',
            email: '',
            date: '',
            symptoms: ''
        }
    })

    const registrarPaciente = (data: DraftPatient) => {
        agregarPaciente(data)
        reset()
    }

    return (
        <form
            onSubmit={handleSubmit(registrarPaciente)}
            className="md:w-1/2 lg:w-2/5 bg-white shadow-md rounded-lg p-8 space-y-4"
        >
            <input
                type="text"
                placeholder="Nombre del Paciente"
                className="border-2 w-full p-2 placeholder-gray-400 rounded-md"
                {...register('name', {
                    required: "El nombre es obligatorio"
                })}
            />

            {errors.name && <Error>{errors.name.message}</Error>}

            <input
                type="text"
                placeholder="Nombre del Propietario"
                className="border-2 w-full p-2 placeholder-gray-400 rounded-md"
                {...register('caretaker', {
                    required: "El nombre del propietario es obligatorio"
                })}
            />

            {errors.caretaker && <Error>{errors.caretaker.message}</Error>}

            <input
                type="email"
                placeholder="Email de contacto"
                className="border-2 w-full p-2 placeholder-gray-400 rounded-md"
                {...register('email', {
                    required: "El email es obligatorio",
                    pattern: {
                        value: /^\S+@\S+$/i,
                        message: 'Email no válido'
                    }
                })}
            />

            {errors.email && <Error>{errors.email.message}</Error>}

            <input
                type="date"
                className="border-2 w-full p-2 placeholder-gray-400 rounded-md"
                {...register('date', {
                    required: "La fecha de alta es obligatoria"
                })}
            />

            {errors.date && <Error>{errors.date.message}</Error>}

            <textarea
                placeholder="Síntomas del paciente"
                className="border-2 w-full p-2 placeholder-gray-400 rounded-md h-32"
                {...register('symptoms', {
                    required: "Los síntomas son obligatorios"
                })}
            />

            {errors.symptoms && <Error>{errors.symptoms.message}</Error>}

            <button
                type="submit"
                className="bg-indigo-600 text-white py-2 px-6 rounded-md font-bold uppercase w-full hover:bg-indigo-700 transition-colors"
            >
                Guardar Paciente
            </button>
        </form>
    )
}

export default Formulario
