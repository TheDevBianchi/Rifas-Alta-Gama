"use client"
import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useRaffleStore } from '@/store/use-rifa-store'
import Image from 'next/image'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { PlusIcon, XIcon, DollarSign, Hash, Clock, ImageIcon } from 'lucide-react'
import { schema } from '@/schema/raffleSchema'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { Checkbox } from "@/components/ui/checkbox"

function CreateRaffle({ modal, onClose }) {
  const router = useRouter()
  const createRaffle = useRaffleStore(state => state.createRaffle)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      price: '',
      totalTickets: '',
      minTickets: '',
      reservedNumbers: [],
      soldTickets: 0,
      images: [],
      createdAt: new Date(),
      startDate: new Date(),
      endDate: new Date(),
      randomTickets: false,
    }
  })

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      await createRaffle(data)
      toast.success('Rifa creada exitosamente', {
        description: `La rifa "${data.title}" ha sido creada correctamente`,
      })
      router.push('/dashboard/rifas')
      onClose()
    } catch (error) {
      toast.error('Error al crear la rifa', {
        description: error.message || 'Ocurrió un error al crear la rifa'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 overflow-y-auto bg-black/60 backdrop-blur-sm z-50">
      <div className="min-h-screen px-4 flex items-center justify-center">
        <Card className="w-full max-w-2xl bg-gray-900 border-gray-800">
          <CardHeader className="border-b border-gray-800 sticky top-0 bg-gray-900 z-10">
            <div className="flex items-center justify-between">
              <CardTitle>Crear Nueva Rifa</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={ onClose }
                className="text-gray-400 hover:text-white"
              >
                <XIcon className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <form onSubmit={ handleSubmit(onSubmit) } className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Información básica */ }
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título de la Rifa</Label>
                    <Controller
                      name="title"
                      control={ control }
                      render={ ({ field }) => (
                        <div>
                          <Input
                            { ...field }
                            id="title"
                            placeholder="Ej: iPhone 15 Pro Max"
                            className={ cn(
                              "bg-gray-800/50 border-gray-700",
                              errors.title && "border-red-500 focus:ring-red-500"
                            ) }
                          />
                          { errors.title && (
                            <p className="mt-1 text-sm text-red-500">{ errors.title.message }</p>
                          ) }
                        </div>
                      ) }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          Precio
                        </div>
                      </Label>
                      <Controller
                        name="price"
                        control={ control }
                        render={ ({ field }) => (
                          <div>
                            <Input
                              { ...field }
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              className="bg-gray-800/50 border-gray-700"
                            />
                            { errors.price && (
                              <p className="mt-1 text-sm text-red-500">{ errors.price.message }</p>
                            ) }
                          </div>
                        ) }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="totalTickets">
                        <div className="flex items-center gap-2">
                          <Hash className="w-4 h-4" />
                          Total Tickets
                        </div>
                      </Label>
                      <Controller
                        name="totalTickets"
                        control={ control }
                        render={ ({ field }) => (
                          <div>
                            <Input
                              { ...field }
                              type="number"
                              placeholder="100"
                              className="bg-gray-800/50 border-gray-700"
                            />
                            { errors.totalTickets && (
                              <p className="mt-1 text-sm text-red-500">
                                { errors.totalTickets.message }
                              </p>
                            ) }
                          </div>
                        ) }
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Opciones de Tickets</Label>

                    <div className="flex items-center space-x-2">
                      <Controller
                        name="randomTickets"
                        control={ control }
                        render={ ({ field }) => (
                          <Checkbox
                            id="randomTickets"
                            checked={ field.value }
                            onCheckedChange={ field.onChange }
                            className="bg-gray-800/50 border-gray-700 data-[state=checked]:bg-primary"
                          />
                        ) }
                      />
                      <div className="space-y-1">
                        <Label
                          htmlFor="randomTickets"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Tickets Aleatorios
                        </Label>
                        <p className="text-xs text-gray-400">
                          Si está activado, los tickets se asignarán de forma aleatoria
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="minTickets">
                        <div className="flex items-center gap-2">
                          <Hash className="w-4 h-4" />
                          Tickets Mínimos
                        </div>
                      </Label>
                      <Controller
                        name="minTickets"
                        control={ control }
                        render={ ({ field }) => (
                          <div>
                            <Input
                              { ...field }
                              id="minTickets"
                              type="number"
                              placeholder="Ej: 1"
                              className="bg-gray-800/50 border-gray-700 w-full"
                            />
                            { errors.minTickets && (
                              <p className="mt-1 text-sm text-red-500">
                                { errors.minTickets.message }
                              </p>
                            ) }
                          </div>
                        ) }
                      />
                      <p className="text-xs text-gray-400">
                        Cantidad mínima de tickets que debe comprar cada usuario
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4" />
                        Fechas
                      </div>
                    </Label>
                    <div className="grid grid-cols-2 gap-4">
                      <Controller
                        name="startDate"
                        control={ control }
                        render={ ({ field }) => (
                          <div>
                            <DatePicker
                              selected={ field.value }
                              onChange={ field.onChange }
                              showTimeSelect
                              dateFormat="Pp"
                              placeholderText="Fecha inicio"
                              className="w-full bg-gray-800/50 border-gray-700 rounded-md px-3 py-2 text-sm"
                            />
                          </div>
                        ) }
                      />
                      <Controller
                        name="endDate"
                        control={ control }
                        render={ ({ field }) => (
                          <div>
                            <DatePicker
                              selected={ field.value }
                              onChange={ field.onChange }
                              showTimeSelect
                              dateFormat="Pp"
                              placeholderText="Fecha fin"
                              className="w-full bg-gray-800/50 border-gray-700 rounded-md px-3 py-2 text-sm"
                            />
                          </div>
                        ) }
                      />
                    </div>
                  </div>
                </div>

                {/* Descripción e Imágenes */ }
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="description">Descripción</Label>
                    <Controller
                      name="description"
                      control={ control }
                      render={ ({ field }) => (
                        <div>
                          <Textarea
                            { ...field }
                            placeholder="Describe los detalles de la rifa..."
                            className="bg-gray-800/50 border-gray-700 min-h-[120px]"
                          />
                          { errors.description && (
                            <p className="mt-1 text-sm text-red-500">
                              { errors.description.message }
                            </p>
                          ) }
                        </div>
                      ) }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>
                      <div className="flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" />
                        Imágenes
                      </div>
                    </Label>
                    <Controller
                      name="images"
                      control={ control }
                      render={ ({ field }) => (
                        <div className="space-y-4">
                          <div className="border-2 border-dashed border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors">
                            <label className="flex flex-col items-center cursor-pointer">
                              <PlusIcon className="w-8 h-8 text-gray-400" />
                              <span className="mt-2 text-sm text-gray-400">
                                Arrastra imágenes o haz clic para seleccionar
                              </span>
                              <input
                                type="file"
                                className="hidden"
                                multiple
                                accept="image/*"
                                onChange={ (e) => {
                                  const files = Array.from(e.target.files)
                                  const newImages = files.map(file => ({
                                    file,
                                    preview: URL.createObjectURL(file)
                                  }))
                                  field.onChange([...(field.value || []), ...newImages])
                                } }
                              />
                            </label>
                          </div>

                          { field.value?.length > 0 && (
                            <div className="grid grid-cols-3 gap-4">
                              { field.value.map((image, index) => (
                                <div key={ index } className="relative group">
                                  <Image
                                    src={ image.preview }
                                    alt={ `Preview ${index + 1}` }
                                    width={ 100 }
                                    height={ 100 }
                                    className="w-full h-24 object-cover rounded-lg"
                                  />
                                  <button
                                    type="button"
                                    onClick={ () => {
                                      const newImages = field.value.filter((_, i) => i !== index)
                                      field.onChange(newImages)
                                      URL.revokeObjectURL(image.preview)
                                    } }
                                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <XIcon className="w-4 h-4" />
                                  </button>
                                </div>
                              )) }
                            </div>
                          ) }
                        </div>
                      ) }
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-800">
                <Button
                  type="submit"
                  disabled={ isSubmitting }
                  className="min-w-[200px]"
                >
                  { isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      <span>Creando...</span>
                    </div>
                  ) : (
                    'Crear Rifa'
                  ) }
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default CreateRaffle