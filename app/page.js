'use client'

import { useEffect } from 'react'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import { RaffleCard, RaffleCardSkeleton } from '@/components/rifas/raffle-card'
import { useRaffleStore } from '@/store/use-rifa-store'

const HomePage = () => {
  const { raffles, loading, error, getRaffles } = useRaffleStore();

  useEffect(() => {
    getRaffles()
  }, [getRaffles]);

  return (
    <div className='min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-gray-900 to-black text-white'>
      <Header />
      <main className='container mx-auto px-4 py-12'>
        <div className='space-y-6'>
          <div className='flex items-center justify-between'>
            <h2 className='text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent'>
              Rifas Disponibles
            </h2>
          </div>

          { loading ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              { [...Array(6)].map((_, index) => (
                <RaffleCardSkeleton key={ index } />
              )) }
            </div>
          ) : error ? (
            <div className='flex flex-col items-center justify-center min-h-[400px] text-center'>
              <div className='bg-red-500/10 text-red-500 p-4 rounded-lg max-w-md'>
                <h3 className='text-lg font-semibold mb-2'>Error al cargar las rifas</h3>
                <p className='text-sm'>{ error }</p>
                <button
                  onClick={ getRaffles }
                  className='mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors'
                >
                  Intentar nuevamente
                </button>
              </div>
            </div>
          ) : raffles.length === 0 ? (
            <div className='rounded-lg border border-gray-800 p-12 text-center'>
              <p className='text-gray-400 text-lg'>No hay rifas disponibles en este momento.</p>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              { raffles.map((raffle) => (
                <RaffleCard key={ raffle.id } raffle={ raffle } />
              )) }
            </div>
          ) }
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default HomePage
