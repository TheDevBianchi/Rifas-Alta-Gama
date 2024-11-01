import { Loader2 } from 'lucide-react'

export function LoadingState() {
  return (
    <div className='bg-gray-800 p-6 rounded-lg'>
      <h2 className='text-xl font-semibold mb-4'>Métodos de Pago Actuales</h2>
      <div className='flex justify-center py-8' role='status'>
        <Loader2 className='w-6 h-6 animate-spin' />
        <span className='sr-only'>Cargando métodos de pago...</span>
      </div>
    </div>
  )
}
