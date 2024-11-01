'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const SuccessModal = ({ isOpen, onClose, purchaseData, raffle }) => {
  if (!purchaseData) return null

  const whatsappMessage = encodeURIComponent(
    `¡Hola! Acabo de reservar los siguientes tickets para la rifa "${
      raffle.title
    }":
    Números: ${purchaseData.selectedTickets.join(', ')}
    Total pagado: $${(
      purchaseData.selectedTickets.length * raffle.price
    ).toFixed(2)} USD
    Método de pago: ${purchaseData.paymentMethod}
    Referencia: ${purchaseData.paymentReference}`
  )

  const whatsappUrl = `https://wa.me/+584141234567?text=${whatsappMessage}`

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 bg-black/70 backdrop-blur-sm z-50'
            onClick={onClose}
            aria-hidden='true'
          />

          {/* Modal */}
          <motion.div
            role='dialog'
            aria-labelledby='modal-title'
            aria-modal='true'
            className='fixed left-1/2 top-1/2 z-50 w-full max-w-md'
            initial={{ opacity: 0, y: 100, x: '-50%' }}
            animate={{ opacity: 1, y: '-50%', x: '-50%' }}
            exit={{ opacity: 0, y: 100 }}>
            <div className='relative bg-gray-900 rounded-lg p-6 shadow-xl border border-gray-800'>
              {/* Close button */}
              <button
                onClick={onClose}
                className='absolute right-4 top-4 text-gray-400 hover:text-white transition-colors'
                aria-label='Cerrar modal'>
                <X className='h-6 w-6' />
              </button>

              {/* Success icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 260,
                  damping: 20,
                }}
                className='mx-auto w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-6'>
                <Check className='h-8 w-8 text-green-500' />
              </motion.div>

              <div className='text-center mb-6'>
                <h2
                  id='modal-title'
                  className='text-xl font-semibold text-white mb-2'>
                  ¡Reserva Exitosa!
                </h2>
                <p className='text-gray-300'>
                  Tu reserva se ha realizado correctamente, envía tu comprobante
                  de pago a través del botón de WhatsApp.
                </p>
              </div>

              <div className='space-y-4 mb-6'>
                <div className='bg-gray-800/50 p-4 rounded-lg'>
                  <h3 className='font-medium text-white mb-2'>
                    Detalles de la compra:
                  </h3>
                  <ul className='space-y-2 text-gray-300'>
                    {!raffle.randomTickets ? (
                      <li>
                        Tickets: {purchaseData.selectedTickets.join(', ')}
                      </li>
                    ) : (
                      <li>Sus tickets serán enviados por correo</li>
                    )}
                    <li>
                      Total: $
                      {(
                        purchaseData.selectedTickets.length * raffle.price
                      ).toFixed(2)}{' '}
                      USD
                    </li>
                    <li>Método de pago: {purchaseData.paymentMethod}</li>
                    <li>Referencia: {purchaseData.paymentReference}</li>
                  </ul>
                </div>
              </div>

              <div className='flex flex-col sm:flex-row gap-3'>
                <a
                  href={whatsappUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className={cn(
                    'flex-1 px-6 py-3 bg-green-600 text-white rounded-lg',
                    'hover:bg-green-700 transition-colors',
                    'focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2',
                    'font-medium text-sm text-center'
                  )}>
                  Contactar por WhatsApp
                </a>
                <button
                  onClick={onClose}
                  className={cn(
                    'flex-1 px-6 py-3 bg-gray-700 text-white rounded-lg',
                    'hover:bg-gray-600 transition-colors',
                    'focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2',
                    'font-medium text-sm'
                  )}>
                  Cerrar
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default SuccessModal
