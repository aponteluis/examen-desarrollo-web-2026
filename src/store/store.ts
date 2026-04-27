import { create } from 'zustand'
import type { DraftPatient, Patient } from '../types'
import { v4 as uuidv4 } from 'uuid'


// 1. Definir el tipo del estado
type PacientesState = {
    pacientes: Patient[];
    agregarPaciente: (data: DraftPatient) => void;
    eliminarPaciente: (id: string) => void;
}


// 2. Función auxiliar para crear un paciente con ID
const crearPaciente = (data: DraftPatient): Patient => {
    return {
        id: uuidv4(),
        ...data
    }
}


// 3. Crear el store
export const usePacienteStore = create<PacientesState>((set) => ({
    pacientes: [],
    agregarPaciente: (data) => set((state) => ({
        pacientes: [...state.pacientes, crearPaciente(data)]
    })),
    eliminarPaciente: (id) => set((state) => ({
        pacientes: state.pacientes.filter((paciente) => paciente.id !== id)
    }))
}))
