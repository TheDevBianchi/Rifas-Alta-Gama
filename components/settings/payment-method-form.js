'use client'

import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSettingsStore } from '@/store/use-settings-store'
import { paymentMethodSchema } from '@/schema/paymentMethodSchema'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { FormField } from '../ui/form-field'
import { Input } from '../ui/input'

export function PaymentMethodForm() {
  const { addPaymentMethod } = useSettingsStore()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      email: '',
      contactName: '',
      phone: '',
    },
  })

  const onSubmit = async (data) => {
    try {
      await addPaymentMethod(data)
      toast.success('Método de pago agregado exitosamente')
      reset()
    } catch (error) {
      toast.error('Error al agregar el método de pago')
    }
  }

  return (
    <div className='bg-gray-800 p-6 rounded-lg'>
      <h2 className='text-xl font-semibold mb-4' id='payment-method-form'>
        Agregar Método de Pago
      </h2>
      <form
        onSubmit={ handleSubmit(onSubmit) }
        className='space-y-4'
        aria-labelledby='payment-method-form'
        noValidate>
        <FormField
          label='Nombre del método de pago'
          error={ errors.name }
          optional>
          <Controller
            control={ control }
            name='name'
            render={ ({ field }) => (
              <Input
                { ...field }
                id='name'
                name='name'
                placeholder='ej: PayPal, Zelle, etc.'
                required
                error={ errors.name }
              />
            ) }
          />
        </FormField>

        <FormField
          label="Correo electrónico"
          error={ errors.email }
          optional>
          <Controller
            control={ control }
            name='email'
            render={ ({ field }) => (
              <Input
                { ...field }
                id='email'
                name='email'
                type='email'
                placeholder='correo@ejemplo.com'
                error={ errors.email }
              />
            ) }
          />
        </FormField>

        <FormField
          label='Nombre de contacto'
          error={ errors.contactName }
          optional>
          <Controller
            control={ control }
            name='contactName'
            render={ ({ field }) => (
              <Input
                { ...field }
                id='contactName'
                name='contactName'
                placeholder='Nombre completo'
                error={ errors.contactName }
              />
            ) }
          />
        </FormField>

        <FormField
          label='Teléfono'
          error={ errors.phone }
          optional>
          <Controller
            control={ control }
            name='phone'
            render={ ({ field }) => (
              <Input
                { ...field }
                id='phone'
                name='phone'
                type='tel'
                placeholder='+58 424 1234567'
                error={ errors.phone }
              />
            ) }
          />
        </FormField>

        <button
          type='submit'
          disabled={ isSubmitting }
          className='w-full bg-primary text-white p-2 rounded hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed'
          aria-busy={ isSubmitting }>
          { isSubmitting ? (
            <span className='flex items-center justify-center gap-2'>
              <Loader2 className='w-4 h-4 animate-spin' />
              <span>Agregando...</span>
            </span>
          ) : (
            'Agregar Método de Pago'
          ) }
        </button>
      </form>
    </div>
  )
}