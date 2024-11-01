import { Check, X, Loader2 } from 'lucide-react'

export function ActionButton({ onClick, disabled, variant, isLoading }) {
  const variants = {
    approve: {
      baseClass: 'bg-green-600 hover:bg-green-700',
      icon: Check,
      text: 'Aprobar',
      loadingText: 'Aprobando...',
    },
    reject: {
      baseClass: 'bg-red-600 hover:bg-red-700',
      icon: X,
      text: 'Rechazar',
      loadingText: 'Rechazando...',
    },
  }

  const { baseClass, icon: Icon, text, loadingText } = variants[variant]

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex-1 ${baseClass} text-white py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}>
      {isLoading ? (
        <>
          <Loader2 size={16} className='animate-spin' />
          {loadingText}
        </>
      ) : (
        <>
          <Icon size={16} />
          {text}
        </>
      )}
    </button>
  )
}
