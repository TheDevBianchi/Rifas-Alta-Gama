'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { pendingPurchaseSchema } from '@/schema/pendingPurchaseSchema'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSettingsStore } from '@/store/use-settings-store'
import {
  User,
  Mail,
  Phone,
  CreditCard,
  Receipt,
  AlertCircle,
  Loader2,
  DollarSign,
  Ticket,
  Shuffle,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import SuccessModal from './success-modal'

const BuyTicketForm = ({ raffle, onSubmit }) => {
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [submittedData, setSubmittedData] = useState(null)
  const [randomTicketCount, setRandomTicketCount] = useState(0)
  const [showAllTickets, setShowAllTickets] = useState(false)

  const { paymentMethods, getPaymentMethods, loading } = useSettingsStore()

  const form = useForm({
    resolver: zodResolver(pendingPurchaseSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      paymentMethod: '',
      paymentReference: '',
      selectedTickets: [],
    },
  })

  const {
    control,
    formState: { errors },
    watch,
    setValue,
  } = form
  const selectedTickets = watch('selectedTickets') || []
  const selectedMethod = watch('paymentMethod')

  useEffect(() => {
    getPaymentMethods()
  }, [getPaymentMethods])

  const selectedPaymentMethod = paymentMethods.find(
    (method) => method.id === selectedMethod
  )

  const handleSubmit = async (data) => {
    try {
      await onSubmit(data)
      form.reset()
      setRandomTicketCount(0)
      setShowSuccessModal(true)
      setSubmittedData(data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const availableTickets = Array.from(
    { length: raffle.totalTickets },
    (_, i) => {
      const number = i + 1
      if (raffle.totalTickets <= 100) {
        return number.toString().padStart(2, '0')
      } else if (raffle.totalTickets <= 1000) {
        return number.toString().padStart(3, '0')
      } else if (raffle.totalTickets <= 10000) {
        return number.toString().padStart(4, '0')
      }
      return number.toString()
    }
  ).filter(
    (number) =>
      !raffle.soldTickets?.includes(number) &&
      !raffle.reservedTickets?.includes(number)
  )

  const handleTicketClick = (number) => {
    const currentSelected = form.getValues('selectedTickets') || []
    let newSelected

    if (currentSelected.includes(number)) {
      newSelected = currentSelected.filter((t) => t !== number)
    } else {
      newSelected = [...currentSelected, number]
    }

    setValue('selectedTickets', newSelected, { shouldValidate: true })
  }

  const ticketCount = raffle.randomTickets
    ? randomTicketCount
    : selectedTickets.length
  const total = ticketCount * raffle.price

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      className='space-y-8 p-6 text-gray-300'>
      {/* Información Personal */}
      <div
        className='space-y-6'
        role='region'
        aria-label='Información Personal'>
        <h2 className='text-xl font-semibold text-gray-100'>
          Información Personal
        </h2>

        <div className='space-y-4'>
          {/* Campo Nombre */}
          <div className='space-y-2'>
            <label
              htmlFor='name'
              className='text-sm font-medium text-gray-200 flex items-center gap-2'>
              <User className='w-4 h-4 text-gray-400' aria-hidden='true' />
              Nombre Completo
            </label>
            <Controller
              name='name'
              control={control}
              rules={{ required: 'El nombre es requerido' }}
              render={({ field }) => (
                <Input
                  {...field}
                  id='name'
                  className='bg-gray-800/50 border-gray-700'
                  placeholder='John Doe'
                  aria-required='true'
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                />
              )}
            />
            {errors.name && (
              <p id='name-error' className='text-sm text-red-400' role='alert'>
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Campo Email */}
          <div className='space-y-2'>
            <label
              htmlFor='email'
              className='text-sm font-medium text-gray-200 flex items-center gap-2'>
              <Mail className='w-4 h-4 text-gray-400' aria-hidden='true' />
              Correo Electrónico
            </label>
            <Controller
              name='email'
              control={control}
              rules={{
                required: 'El correo es requerido',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Correo electrónico inválido',
                },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  id='email'
                  type='email'
                  className='bg-gray-800/50 border-gray-700'
                  placeholder='john@example.com'
                  aria-required='true'
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
              )}
            />
            {errors.email && (
              <p id='email-error' className='text-sm text-red-400' role='alert'>
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Campo Teléfono */}
          <div className='space-y-2'>
            <label
              htmlFor='phone'
              className='text-sm font-medium text-gray-200 flex items-center gap-2'>
              <Phone className='w-4 h-4 text-gray-400' aria-hidden='true' />
              Teléfono
            </label>
            <Controller
              name='phone'
              control={control}
              rules={{ required: 'El teléfono es requerido' }}
              render={({ field }) => (
                <Input
                  {...field}
                  id='phone'
                  type='tel'
                  className='bg-gray-800/50 border-gray-700'
                  placeholder='+58 424 1234567'
                  aria-required='true'
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? 'phone-error' : undefined}
                />
              )}
            />
            {errors.phone && (
              <p id='phone-error' className='text-sm text-red-400' role='alert'>
                {errors.phone.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Información de Pago */}
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <h2 className='text-xl font-semibold text-gray-100'>
            Información de Pago
          </h2>
          {selectedMethod && (
            <span className='text-sm text-gray-400'>
              Método seleccionado: {selectedPaymentMethod?.name}
            </span>
          )}
        </div>

        <div className='space-y-4'>
          {/* Método de Pago */}
          <div className='space-y-2'>
            <label className='text-sm font-medium text-gray-200 flex items-center gap-2'>
              <CreditCard className='w-4 h-4 text-gray-400' />
              Método de Pago
            </label>
            <Controller
              name='paymentMethod'
              control={control}
              rules={{ required: 'Selecciona un método de pago' }}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}>
                  <SelectTrigger
                    className='w-full bg-gray-800/50 border-gray-700'
                    disabled={loading}>
                    {loading ? (
                      <div className='flex items-center gap-2'>
                        <Loader2 className='h-4 w-4 animate-spin' />
                        <span>Cargando métodos...</span>
                      </div>
                    ) : (
                      <SelectValue placeholder='Selecciona un método de pago' />
                    )}
                  </SelectTrigger>
                  <SelectContent className='bg-gray-800 border-gray-700'>
                    {paymentMethods.map((method) => (
                      <SelectItem
                        key={method.id}
                        value={method.id}
                        className='text-gray-200 hover:bg-gray-700 focus:bg-gray-700'>
                        {method.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.paymentMethod && (
              <p className='text-sm text-red-400'>
                {errors.paymentMethod.message}
              </p>
            )}
          </div>

          {/* Referencia de Pago */}
          {selectedMethod && (
            <div className='space-y-2'>
              <label className='text-sm font-medium text-gray-200 flex items-center gap-2'>
                <Receipt className='w-4 h-4 text-gray-400' />
                Referencia de Pago
              </label>
              <Controller
                name='paymentReference'
                control={control}
                rules={{
                  required: 'La referencia de pago es requerida',
                  minLength: {
                    value: 6,
                    message: 'La referencia debe tener al menos 6 caracteres',
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    className='bg-gray-800/50 border-gray-700'
                    placeholder='Número de referencia o ID de transacción'
                  />
                )}
              />
              {errors.paymentReference && (
                <p className='text-sm text-red-400'>
                  {errors.paymentReference.message}
                </p>
              )}
            </div>
          )}

          {/* Información del método de pago */}
          {selectedPaymentMethod && (
            <div className='flex items-start gap-2 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20'>
              <AlertCircle className='w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0' />
              <div className='text-sm text-blue-300'>
                <p className='font-medium mb-1'>Información de pago:</p>
                {selectedPaymentMethod.email && (
                  <p>Email: {selectedPaymentMethod.email}</p>
                )}
                {selectedPaymentMethod.contactName && (
                  <p>Contacto: {selectedPaymentMethod.contactName}</p>
                )}
                {selectedPaymentMethod.phone && (
                  <p>Teléfono: {selectedPaymentMethod.phone}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Selección de Tickets */}
      <div className='space-y-6 pb-14'>
        <div className='flex items-center justify-between'>
          <h2 className='text-xl font-semibold text-gray-100'>
            Selección de Tickets
          </h2>
          <span className='text-sm text-gray-400'>
            Mínimo: {raffle.minTickets} tickets
          </span>
        </div>

        {raffle.randomTickets ? (
          <div className='space-y-4'>
            <div className='space-y-2'>
              <label className='text-sm font-medium text-gray-200 flex items-center gap-2'>
                <Ticket className='w-4 h-4 text-gray-400' />
                Cantidad de tickets
              </label>
              <Input
                type='number'
                min={1}
                value={randomTicketCount || ''}
                onChange={(e) => {
                  const value = Number(e.target.value)
                  if (value >= 0) {
                    setRandomTicketCount(value)
                    setValue('selectedTickets', Array(value).fill(''), {
                      shouldValidate: true,
                    })
                  }
                }}
                className='bg-gray-800/50 border-gray-700'
                placeholder={`Mínimo ${raffle.minTickets} tickets`}
              />
            </div>

            {/* Total en modo aleatorio */}
            <div className='flex flex-col items-start justify-between py-4 border-t border-gray-800'>
              <div className='flex items-center gap-2'>
                <DollarSign className='w-4 h-4 text-green-400' />
                <span className='text-lg font-semibold text-green-400'>
                  ${(randomTicketCount * raffle.price).toFixed(2)} USD
                </span>
              </div>
              <span className='text-sm text-gray-400'>
                ({randomTicketCount || 0} tickets x ${raffle.price} USD)
              </span>
            </div>
          </div>
        ) : (
          <div className='space-y-4'>
            <div className='flex justify-between items-center'>
              <div className='flex items-center gap-2'>
                <Ticket className='w-4 h-4 text-gray-400' />
                <span className='text-sm font-medium text-gray-200'>
                  Tickets Disponibles
                </span>
              </div>
              <Button
                type='button'
                variant='ghost'
                size='sm'
                onClick={() => setShowAllTickets(!showAllTickets)}>
                {showAllTickets ? 'Mostrar Menos' : 'Mostrar Todos'}
              </Button>
            </div>

            <div className='grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 max-h-[300px] overflow-y-auto p-2'>
              {availableTickets
                .slice(0, showAllTickets ? undefined : 40)
                .map((number) => (
                  <button
                    key={number}
                    type='button'
                    onClick={() => handleTicketClick(number)}
                    className={cn(
                      'p-2 text-sm rounded-md transition-colors',
                      'hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-primary',
                      selectedTickets.includes(number)
                        ? 'bg-primary text-white'
                        : 'bg-gray-800/50 text-gray-300'
                    )}>
                    {number}
                  </button>
                ))}
            </div>

            {!showAllTickets && availableTickets.length > 40 && (
              <p className='text-center text-sm text-gray-400'>
                Mostrando 40 de {availableTickets.length} tickets disponibles
              </p>
            )}

            <div className='space-y-2'>
              <h3 className='text-sm font-medium text-gray-200'>
                Tickets Seleccionados ({selectedTickets.length}/
                {selectedTickets.length > raffle.minTickets
                  ? selectedTickets.length
                  : raffle.minTickets}
                )
              </h3>
              <div className='flex flex-wrap gap-2'>
                {selectedTickets.map((number) => (
                  <span
                    key={number}
                    className='px-3 py-1 bg-primary/20 text-primary rounded-full text-sm'>
                    {number}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {ticketCount > 0 ||
          (ticketCount < raffle.minTickets && (
            <div className='flex items-start gap-2 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20'>
              <AlertCircle className='w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0' />
              <p className='text-sm text-yellow-300'>
                Debes seleccionar al menos {raffle.minTickets} tickets para
                continuar
              </p>
            </div>
          ))}

        <Controller
          name='selectedTickets'
          control={control}
          rules={{
            validate: (value) =>
              value?.length >= raffle.minTickets ||
              `Debes seleccionar al menos ${raffle.minTickets} tickets`,
          }}
          render={({ field }) => <input type='hidden' {...field} />}
        />
      </div>

      {/* Total Flotante */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className='fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-t border-gray-800 p-4 z-50'>
        <div className='container mx-auto max-w-2xl flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-2'>
              <DollarSign className='w-5 h-5 text-green-400' />
              <span className='text-lg font-semibold text-green-400'>
                ${total.toFixed(2)} USD
              </span>
            </div>
            <span className='text-sm text-gray-400'>
              ({ticketCount} tickets × ${raffle.price} USD)
            </span>
          </div>

          <Button
            type='submit'
            disabled={
              form.formState.isSubmitting || ticketCount < raffle.minTickets
            }
            className='bg-primary hover:bg-primary/90 text-white min-w-[150px]'>
            {form.formState.isSubmitting ? (
              <div className='flex items-center gap-2'>
                <Loader2 className='w-4 h-4 animate-spin' />
                <span>Procesando...</span>
              </div>
            ) : (
              <span>Comprar Tickets</span>
            )}
          </Button>
        </div>

        {ticketCount > 0 && ticketCount < raffle.minTickets && (
          <p className='text-center text-sm text-yellow-400 mt-2'>
            Debes seleccionar al menos {raffle.minTickets} tickets para
            continuar
          </p>
        )}
      </motion.div>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        purchaseData={submittedData}
        raffle={raffle}
      />
    </form>
  )
}

export default BuyTicketForm
