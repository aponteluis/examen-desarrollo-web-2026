import type { Patient } from "../types"
import PacienteDetalle from "./PacienteDetalle"
import { usePacienteStore } from '../store/store'
import DialogModal from "./DialogModal";
import { useState } from "react";
import { toast } from "sonner";

type PacienteProps = {
    paciente: Patient
}

const Paciente = ({ paciente }: PacienteProps) => {
    const [isOpened, setIsOpened] = useState(false);

    const onProceed = () => {
        handleClickEliminar()
    };

    const eliminarPaciente = usePacienteStore((state) => state.eliminarPaciente)
    const setPacienteActivo = usePacienteStore((state) => state.setPacienteActivo)

    const handleClickEliminar = () => {
        eliminarPaciente(paciente.id)
        toast.success(`Paciente ${paciente.name} eliminado correctamente`)
    }

    return (
        <div className="mx-5 my-10 px-5 py-10 bg-white shadow-md rounded-xl">
            <PacienteDetalle label="ID" data={paciente.id} />
            <PacienteDetalle label="Nombre" data={paciente.name} />
            <PacienteDetalle label="Propietario" data={paciente.caretaker} />
            <PacienteDetalle label="Email" data={paciente.email} />
            <PacienteDetalle label="Fecha Alta" data={paciente.date || ''} />
            <PacienteDetalle label="Síntomas" data={paciente.symptoms} />

            <div className="flex flex-col lg:flex-row gap-3 justify-between mt-10">
                <button
                    type="button"
                    className="py-2 px-10 bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase rounded-lg"
                    onClick={() => setPacienteActivo(paciente.id)}
                >Editar</button>

                <button
                    type="button"
                    className="py-2 px-10 bg-red-600 hover:bg-red-700 text-white font-bold uppercase rounded-lg"
                    onClick={() => setIsOpened(true)}
                >Eliminar</button>

                <DialogModal
                    title="Eliminar Paciente"
                    isOpened={isOpened}
                    onProceed={onProceed}
                    onClose={() => setIsOpened(false)}
                >
                    <p className="text-slate-700">
                        Estas a punto de eliminar al paciente <span className="font-semibold">{paciente.name}</span>.
                    </p>
                    <p className="mt-2 text-sm text-slate-500">Esta accion no se puede deshacer.</p>
                </DialogModal>
            </div>
        </div>
    )
}

export default Paciente
