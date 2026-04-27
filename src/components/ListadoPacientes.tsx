import { usePacienteStore } from '../store/store'
import Paciente from './Paciente'


const ListadoPacientes = () => {

  const pacientes = usePacienteStore(state => state.pacientes)

  return (
    <div className="md:w-1/2 lg:w-3/5 md:h-screen overflow-y-auto">
      <h2 className="font-black text-3xl text-center">Lista de Pacientes</h2>

      {pacientes.length === 0 ? (
        <p className="mt-10 text-center text-gray-600">
          Aun no hay pacientes registrados.
        </p>
      ) : (
        pacientes.map((paciente) => (
          <Paciente
            key={paciente.id}
            paciente={paciente} />
        ))
      )}
    </div>
  )
}

export default ListadoPacientes;