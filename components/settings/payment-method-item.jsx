import { Trash2 } from 'lucide-react'
import { useSettingsStore } from '@/store/use-settings-store'
import { toast } from 'sonner'

export function PaymentMethodItem({ method }) {
  const { deletePaymentMethod } = useSettingsStore()

  const handleDelete = async () => {
    try {
      await deletePaymentMethod(method.id)
      toast.success('Método de pago eliminado exitosamente')
    } catch (error) {
      toast.error('Error al eliminar el método de pago')
    }
  }

  return (
    <div
      className='bg-gray-700 p-4 rounded-lg flex justify-between items-start'
      role='listitem'>
      <div>
        <h3 className='font-medium'>{method.name}</h3>
        {method.email && (
          <p className='text-sm text-gray-400'>{method.email}</p>
        )}
        {method.contactName && (
          <p className='text-sm text-gray-400'>{method.contactName}</p>
        )}
        {method.phone && (
          <p className='text-sm text-gray-400'>{method.phone}</p>
        )}
      </div>
      <button
        onClick={handleDelete}
        className='text-red-500 hover:text-red-400 p-1 focus:outline-none focus:ring-2 focus:ring-red-500 rounded'
        aria-label={`Eliminar método de pago ${method.name}`}>
        <Trash2 className='w-5 h-5' />
      </button>
    </div>
  )
}
