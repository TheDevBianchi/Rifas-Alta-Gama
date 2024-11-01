'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function RaffleCardSkeleton() {
  return (
    <div className='bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 shadow-xl rounded-xl overflow-hidden'>
      <div className='relative h-56 bg-gray-700/50 animate-pulse' />
      <div className='p-6 space-y-4'>
        <div className='h-7 bg-gray-700/50 rounded-md w-3/4 animate-pulse' />
        <div className='h-4 bg-gray-700/50 rounded-md w-full animate-pulse' />
        <div className='flex justify-between items-center pt-2'>
          <div className='h-6 bg-gray-700/50 rounded-md w-24 animate-pulse' />
          <div className='h-10 bg-gray-700/50 rounded-md w-32 animate-pulse' />
        </div>
      </div>
    </div>
  )
}

export function RaffleCard({ raffle }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const images = raffle.images

  useEffect(() => {
    if (!emblaApi) return

    emblaApi.on('select', () => {
      setSelectedIndex(emblaApi.selectedScrollSnap())
    })
  }, [emblaApi])

  const scrollPrev = () => emblaApi?.scrollPrev()
  const scrollNext = () => emblaApi?.scrollNext()

  return (
    <div className='group relative bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 shadow-xl rounded-xl overflow-hidden hover:shadow-blue-500/10 hover:border-blue-500/50 transition-all duration-300'>
      <div className='relative'>
        <div className='overflow-hidden' ref={ emblaRef }>
          <div className='flex'>
            { (images && images.length > 0) ? images.map((image, index) => (
              <div key={ index } className='flex-[0_0_100%] min-w-0'>
                <div className='relative h-56 transition-transform duration-300 group-hover:scale-105'>
                  <Image
                    src={ `${image}` }
                    alt={ `${raffle.name} - Imagen ${index + 1}` }
                    fill
                    className='object-cover'
                    sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                  />
                </div>
              </div>
            )) : (
              <div className='flex-[0_0_100%] min-w-0'>
                <div className='relative h-56 bg-gray-700/50 flex items-center justify-center'>
                  <span className='text-gray-400'>No hay imágenes disponibles</span>
                </div>
              </div>
            ) }
          </div>
        </div>

        {/* Carousel controls */ }
        <button
          onClick={ scrollPrev }
          className='absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100'
        >
          <ChevronLeft className='w-6 h-6' />
        </button>
        <button
          onClick={ scrollNext }
          className='absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100'
        >
          <ChevronRight className='w-6 h-6' />
        </button>

        {/* Indicators */ }
        <div className='absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5'>
          { raffle.images && raffle.images.map((_, index) => (
            <div
              key={ index }
              className={ `w-1.5 h-1.5 rounded-full transition-all duration-300 ${index === selectedIndex
                ? 'bg-white w-3'
                : 'bg-white/50 hover:bg-white/80'
                }` }
            />
          )) }
        </div>
      </div>

      <div className='p-6 space-y-4'>
        <h3 className='text-2xl font-bold text-white group-hover:text-blue-400 transition-colors'>
          { raffle.name }
        </h3>
        <p className='text-gray-400 line-clamp-2'>{ raffle.description }</p>
        <div className='flex justify-between items-center'>
          <span className='text-green-400 font-bold text-xl'>
            ${ raffle.price } USD
          </span>
          <Link
            href={ `/raffle/${raffle.id}` }
            className='bg-blue-500 text-white py-2.5 px-6 rounded-lg font-medium
                     hover:bg-blue-600 hover:scale-105 active:scale-95
                     transition-all duration-300 shadow-lg shadow-blue-500/25'
          >
            Ver Detalles
          </Link>
        </div>
      </div>
    </div>
  )
} 