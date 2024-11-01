import * as z from 'zod'

export const paymentMethodSchema = z.object({
  name: z.string().min(3, 'El nombre del método de pago es requerido'),
  email: z.string().email('Correo electrónico inválido').optional().or(z.literal('')),
  contactName: z.string().min(3, 'El nombre de contacto debe tener al menos 3 caracteres').optional().or(z.literal('')),
  phone: z.string().min(10, 'El número de teléfono debe tener al menos 10 dígitos').optional().or(z.literal(''))
}) 