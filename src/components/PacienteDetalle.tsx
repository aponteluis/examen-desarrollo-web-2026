type DetallePacienteProps = {
    label: string
    data: string
}
export default function PacienteDetalle({label, data} : DetallePacienteProps) {
  return (
    <p className="font-bold mb-3 text-gray-700 uppercase">{label}: {''}
        <span className="font-normal normal-case">{data}</span>
    </p>
  )
}
