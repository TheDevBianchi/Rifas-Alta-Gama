import { formatDate } from '@/lib/utils'
import { PurchaseInfo } from './purchase-info'
import { ActionButton } from './action-button'

export function PurchaseCard({ purchase, loadingStates, onApprove, onReject }) {
  return (
    <div className='bg-gray-800 rounded-lg p-4 shadow-lg'>
      <div className='mb-4'>
        <h3 className='font-semibold text-lg text-white'>
          {purchase.raffleName}
        </h3>
        <p className='text-gray-400 text-sm'>
          Fecha: {formatDate(purchase.createdAt)}
        </p>
      </div>

      <div className='space-y-2 text-gray-300'>
        <PurchaseInfo label='Comprador' value={purchase.name} />
        <PurchaseInfo label='Email' value={purchase.email} />
        <PurchaseInfo label='Teléfono' value={purchase.phone} />
        <PurchaseInfo label='Método de pago' value={purchase.paymentMethod} />
        <PurchaseInfo label='Referencia' value={purchase.paymentReference} />
        <PurchaseInfo
          label='Tickets'
          value={`${purchase.selectedTickets.length} tickets`}
        />
        <PurchaseInfo
          label='Total'
          value={`$${(
            purchase.selectedTickets.length * purchase.rafflePrice
          ).toFixed(2)} USD`}
        />
      </div>

      <div className='mt-4 flex gap-2'>
        <ActionButton
          onClick={() => onApprove(purchase.raffleId, purchase)}
          disabled={loadingStates.approve[purchase.createdAt.seconds]}
          variant='approve'
          isLoading={loadingStates.approve[purchase.createdAt.seconds]}
        />
        <ActionButton
          onClick={() => onReject(purchase.raffleId, purchase)}
          disabled={loadingStates.reject[purchase.createdAt.seconds]}
          variant='reject'
          isLoading={loadingStates.reject[purchase.createdAt.seconds]}
        />
      </div>
    </div>
  )
}
