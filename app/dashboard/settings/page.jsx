'use client'

import { useEffect } from 'react'
import { useSettingsStore } from '@/store/use-settings-store'
import { PaymentMethodForm } from '@/components/settings/payment-method-form'
import { PaymentMethodList } from '@/components/settings/payment-method-list'

export default function SettingsPage() {
  const { getPaymentMethods } = useSettingsStore()

  useEffect(() => {
    getPaymentMethods()
  }, [getPaymentMethods])

  return (
    <div className='container mx-auto p-6'>
      <h1 className='text-2xl font-bold mb-6'>Configuración</h1>
      <div className='grid gap-6 md:grid-cols-2'>
        <PaymentMethodForm />
        <PaymentMethodList />
      </div>
    </div>
  )
}
