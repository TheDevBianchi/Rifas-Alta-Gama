'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { useRaffleStore } from '@/store/use-rifa-store'
import { ReserveTicketsModal } from './reserve-tickets-modal'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

export function RaffleDetails({ raffle }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const images = raffle.images
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isReserving, setIsReserving] = useState(false)
  const reserveTickets = useRaffleStore((state) => state.reserveTickets)

  useEffect(() => {
    if (!emblaApi) return

    emblaApi.on('select', () => {
      setSelectedIndex(emblaApi.selectedScrollSnap())
    })
  }, [emblaApi])

  const scrollPrev = () => emblaApi?.scrollPrev()
  const scrollNext = () => emblaApi?.scrollNext()

  const handleReserveTickets = async (selectedTickets) => {
    setIsReserving(true)
    try {
      await reserveTickets(raffle.id, selectedTickets)
      toast.success('Tickets reservados exitosamente', {
        description: `Se han reservado ${selectedTickets.length} tickets`,
      })
      setIsModalOpen(false)
    } catch (error) {
      toast.error('Error al reservar tickets', {
        description:
          error.message ||
          'Ha ocurrido un error al intentar reservar los tickets',
      })
    } finally {
      setIsReserving(false)
    }
  }

  return (
    <div className='max-w-2xl bg-gray-800 rounded-lg overflow-hidden shadow-xl'>
      {/* Carrusel de imágenes */}
      <div className='relative'>
        <div className='overflow-hidden' ref={emblaRef}>
          <div className='flex'>
            {images && images.length > 0 ? (
              images.map((image, index) => (
                <div key={index} className='flex-[0_0_100%] min-w-0'>
                  <div className='relative h-[400px]'>
                    <Image
                      src={`${image}`}
                      alt={`${raffle.title} - Imagen ${index + 1}`}
                      fill
                      className='object-cover'
                      sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                      priority
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className='flex-[0_0_100%] min-w-0'>
                <div className='relative h-[400px] bg-gray-700 flex items-center justify-center'>
                  <span className='text-gray-400'>
                    No hay imágenes disponibles
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Controles del carrusel */}
        <button
          onClick={scrollPrev}
          className='absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 p-3 rounded-full hover:bg-black/70 transition-colors'>
          <ChevronLeft className='w-6 h-6' />
        </button>
        <button
          onClick={scrollNext}
          className='absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 p-3 rounded-full hover:bg-black/70 transition-colors'>
          <ChevronRight className='w-6 h-6' />
        </button>

        {/* Indicadores */}
        <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2'>
          {raffle.images &&
            raffle.images.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === selectedIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
        </div>
      </div>

      {/* Información de la rifa */}
      <div className='p-6'>
        <h1 className='text-3xl font-bold mb-4 text-white'>{raffle.title}</h1>
        <p className='text-gray-300 mb-6'>{raffle.description}</p>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
          <div className='space-y-2'>
            <h3 className='text-lg font-semibold text-white'>
              Detalles del Sorteo
            </h3>
            <div className='text-gray-300'>
              <p>
                Precio por ticket:{' '}
                <span className='text-green-400 font-bold'>
                  ${raffle.price} USD
                </span>
              </p>
              <p>Total de tickets: {raffle.totalTickets}</p>
              <p>Tickets disponibles: {raffle.availableNumbers}</p>
              <p>Tickets mínimos por persona: {raffle.minTickets}</p>
            </div>
          </div>

          <div className='space-y-2'>
            <h3 className='text-lg font-semibold text-white'>Fechas</h3>
            <div className='text-gray-300'>
              <p>Inicio: {formatDate(raffle.startDate)}</p>
              <p>Finalización: {formatDate(raffle.endDate)}</p>
            </div>
          </div>
        </div>

        {/* Barra de progreso */}
        <div className='w-full bg-gray-700 rounded-full h-4 mb-6'>
          <div
            className='bg-blue-500 h-4 rounded-full transition-all'
            style={{
              width: `${
                ((raffle.totalTickets - raffle.availableNumbers) /
                  raffle.totalTickets) *
                100
              }%`,
            }}
          />
        </div>

        <div className='text-center text-gray-300'>
          <p className='text-sm'>
            {raffle.availableNumbers} tickets disponibles de{' '}
            {raffle.totalTickets}
          </p>
        </div>
      </div>

      <ReserveTicketsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleReserveTickets}
        raffle={raffle}
        isReserving={isReserving}
      />
    </div>
  )
}
