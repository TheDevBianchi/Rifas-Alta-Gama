import { XIcon, ImageIcon } from 'lucide-react'
import Image from 'next/image'

function ImageUploadField({ field }) {
  return (
    <div className='space-y-4'>
      <div className='border-2 border-dashed border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors'>
        <label className='flex flex-col items-center cursor-pointer'>
          <ImageIcon className='w-8 h-8 text-gray-400' />
          <span className='mt-2 text-sm text-gray-400'>
            Arrastra imágenes o haz clic para seleccionar
          </span>
          <input
            type='file'
            className='hidden'
            multiple
            accept='image/*'
            onChange={(e) => {
              const files = Array.from(e.target.files || [])
              const urls = files.map((file) => URL.createObjectURL(file))
              const currentUrls =
                field.value?.split('\n').filter((url) => url.trim()) || []
              field.onChange([...currentUrls, ...urls].join('\n'))
            }}
          />
        </label>
      </div>

      {field.value && (
        <div className='grid grid-cols-3 gap-4'>
          {field.value
            .split('\n')
            .filter((url) => url.trim())
            .map((url, index) => (
              <div key={index} className='relative group'>
                <Image
                  src={url}
                  alt={`Preview ${index + 1}`}
                  width={100}
                  height={100}
                  className='w-full h-24 object-cover rounded-lg'
                />
                <button
                  type='button'
                  onClick={() => {
                    const urls = field.value
                      .split('\n')
                      .filter((_, i) => i !== index)
                    field.onChange(urls.join('\n'))
                  }}
                  className='absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'>
                  <XIcon className='w-4 h-4' />
                </button>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}

export default ImageUploadField
