export function EmptyState() {
  return (
    <div className='bg-gray-800 p-6 rounded-lg'>
      <h2 className='text-xl font-semibold mb-4'>Métodos de Pago Actuales</h2>
      <p className='text-gray-400 text-center py-8' role='status'>
        No hay métodos de pago configurados
      </p>
    </div>
  )
}
