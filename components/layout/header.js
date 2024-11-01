import Image from 'next/image'

export default function Header() {
  return (
    <header className='bg-gray-800 shadow-lg mb-8 h-[200px] md:h-[250px] lg:h-[500px]'>
      <div className='relative w-full h-full'>
        <Image
          src='/Banner.png'
          alt='Banner Rifas Alta Gama USA'
          fill
          className='object-cover'
          priority
        />
      </div>
    </header>
  )
}
