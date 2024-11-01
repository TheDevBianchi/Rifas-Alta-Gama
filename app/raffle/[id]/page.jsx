// RafflePage.jsx
'use client'

import { RaffleDetails } from '@/components/rifas/raffle-details'
import { useParams } from 'next/navigation'
import { useRaffles } from '@/hooks/useRaffles'
import { useEffect, useState, useCallback } from 'react'
import { toast } from 'sonner'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import RaffleForm from '@/components/rifas/buyTicketForm'
import { RaffleSkeleton } from '@/components/rifas/raffle-skeleton'
import SuccessModal from '@/components/rifas/success-modal'

const RafflePage = () => {
  const { id } = useParams()
  const { getRaffleById, updateRaffleWithPendingPurchase } = useRaffles()
  const [raffle, setRaffle] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [submittedData, setSubmittedData] = useState(null)

  const fetchRaffle = useCallback(async () => {
    try {
      setIsLoading(true)
      const raffleData = await getRaffleById(id)
      setRaffle(raffleData)
    } catch (err) {
      toast.error('Error al cargar la rifa', {
        description: 'Por favor, intenta nuevamente más tarde',
      })
    } finally {
      setIsLoading(false)
    }
  }, [id, getRaffleById])

  const handleSubmit = async (data) => {
    try {
      await updateRaffleWithPendingPurchase(id, data)
      setSubmittedData(data)
      setShowSuccessModal(true)
      await fetchRaffle() // Refresh raffle data after successful purchase
    } catch (error) {
      toast.error('Error al procesar la reserva', {
        description: 'Por favor, intenta nuevamente',
      })
    }
  }

  useEffect(() => {
    fetchRaffle()
  }, [fetchRaffle])

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-900 to-black'>
      <Header />

      <main className='flex items-center justify-center container mx-auto px-4 py-12'>
        {isLoading ? (
          <RaffleSkeleton />
        ) : raffle ? (
          <div className='max-w-4xl mx-auto space-y-12'>
            <RaffleDetails raffle={raffle} />
            <div className='bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 shadow-xl overflow-hidden pb-14'>
              <RaffleForm raffle={raffle} onSubmit={handleSubmit} />
            </div>
          </div>
        ) : (
          <div className='text-center py-12'>
            <h2 className='text-2xl font-bold text-gray-300'>
              Rifa no encontrada
            </h2>
            <p className='text-gray-400 mt-2'>
              La rifa que buscas no existe o ha sido eliminada
            </p>
          </div>
        )}
      </main>
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        purchaseData={submittedData}
        raffle={raffle}
      />
      <Footer />
    </div>
  )
}

export default RafflePage
