import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function footer() {
  return (
    <footer className='mt-8'>
      <div className='bg-blue-600 flex flex-col items-center justify-center w-full py-8'>
        <div className='max-w-[300px] mb-6'>
          <Image
            src='/Logo_1.png'
            alt='Logo Rifas Alta Gama USA'
            width={ 2835 }
            height={ 2835 }
            className='w-full h-auto'
            priority
          />
        </div>
        <h2 className='text-2xl font-bold mb-6'>REDES SOCIALES</h2>
        <div className='flex items-center justify-center gap-8'>
          <Link
            href='https://www.instagram.com/rifasaltagamausa'
            className='hover:text-gray-200 transition-colors'
            target='_blank'
            rel='noopener noreferrer'
          >
            <Image src='/logo-instagram.svg' alt='Instagram' width={ 40 } height={ 40 } />
          </Link>
          <Link
            href='https://wa.me/19178625154'
            className='hover:text-gray-200 transition-colors'
            target='_blank'
            rel='noopener noreferrer'
          >
            <Image src='/logo-whatsapp.svg' alt='WhatsApp' width={ 40 } height={ 40 } />
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default footer