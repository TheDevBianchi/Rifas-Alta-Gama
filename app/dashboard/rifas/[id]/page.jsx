'use client'

import { useParams } from 'next/navigation'
import { useRaffles } from '@/hooks/useRaffles'
import { useState, useCallback, useEffect, useMemo } from 'react'
import { Loader2, Ticket, Edit } from 'lucide-react'
import { toast } from 'sonner'
import { Progress } from '@/components/ui/progress'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import EditForm from '@/components/dashboard/forms/EditForm'
import TicketGrid from '@/components/rifas/ticket-grid'
import StatsCard from '@/components/dashboard/stats-card'

export default function RaffleDetailsPage() {
  const { id } = useParams()
  const { getRaffleById, unreserveTickets } = useRaffles()
  const [raffle, setRaffle] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadRaffle = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await getRaffleById(id)
      setRaffle(data)
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al cargar la rifa')
    } finally {
      setIsLoading(false)
    }
  }, [id, getRaffleById])

  useEffect(() => {
    loadRaffle()
  }, [loadRaffle])

  const progress = useMemo(() => {
    if (!raffle) return 0
    return ((raffle.soldTickets?.length || 0) / raffle.totalTickets) * 100
  }, [raffle])

  const handleTicketClick = (ticketNumber) => {
    console.log('Ticket clicked:', ticketNumber)
  }

  const handleUnreserveTicket = async (ticketNumber) => {
    try {
      await unreserveTickets(raffle.id, [ticketNumber])
      toast.success('Ticket liberado exitosamente')
      loadRaffle() // Reload the raffle data
    } catch (error) {
      toast.error('Error al liberar el ticket')
      console.error(error)
    }
  }

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='flex flex-col items-center gap-4'>
          <Loader2 className='w-8 h-8 animate-spin text-primary' />
          <p className='text-gray-400'>Cargando detalles de la rifa...</p>
        </div>
      </div>
    )
  }

  if (!raffle) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <p className='text-gray-400'>No se encontró la rifa</p>
      </div>
    )
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <Tabs defaultValue='details' className='space-y-6'>
        <TabsList className='bg-gray-800/50 border-gray-700'>
          <TabsTrigger
            value='details'
            className='data-[state=active]:bg-primary'>
            <Ticket className='w-4 h-4 mr-2' />
            Detalles y Tickets
          </TabsTrigger>
          <TabsTrigger value='edit' className='data-[state=active]:bg-primary'>
            <Edit className='w-4 h-4 mr-2' />
            Editar Rifa
          </TabsTrigger>
        </TabsList>

        <TabsContent value='details' className='space-y-6'>
          <Card className='border-gray-800'>
            <CardHeader>
              <CardTitle className='text-2xl'>{raffle.title}</CardTitle>
              <p className='text-gray-400'>{raffle.description}</p>
            </CardHeader>
            <CardContent className='space-y-6'>
              {/* Progreso de Ventas */}
              <div className='space-y-4'>
                <h3 className='text-lg font-semibold'>Progreso de Ventas</h3>
                <Progress value={progress} className='h-2' />
                <div className='grid grid-cols-3 gap-4'>
                  <StatsCard
                    title='Tickets Vendidos'
                    value={raffle.soldTickets?.length || 0}
                    total={raffle.totalTickets}
                  />
                  <StatsCard
                    title='Tickets Reservados'
                    value={raffle.reservedTickets?.length || 0}
                    total={raffle.totalTickets}
                  />
                  <StatsCard
                    title='Tickets Disponibles'
                    value={
                      raffle.totalTickets -
                      (raffle.soldTickets?.length || 0) -
                      (raffle.reservedTickets?.length || 0)
                    }
                    total={raffle.totalTickets}
                  />
                </div>
              </div>

              {/* Detalles Financieros */}
              <div className='grid grid-cols-2 gap-4 pt-4 border-t border-gray-800'>
                <div>
                  <h3 className='font-medium text-gray-400'>
                    Precio por Ticket
                  </h3>
                  <p className='text-xl font-bold text-green-500'>
                    ${raffle.price} USD
                  </p>
                </div>
                <div>
                  <h3 className='font-medium text-gray-400'>Total Recaudado</h3>
                  <p className='text-xl font-bold text-green-500'>
                    ${(raffle.soldTickets?.length || 0) * raffle.price} USD
                  </p>
                </div>
              </div>

              {/* Grid de Tickets */}
              <div className='pt-6 border-t border-gray-800'>
                <h3 className='text-lg font-semibold mb-4'>
                  Estado de Tickets
                </h3>
                <TicketGrid
                  totalTickets={raffle.totalTickets}
                  soldTickets={raffle.soldTickets || []}
                  reservedTickets={raffle.reservedTickets || []}
                  selectedTickets={[]}
                  onTicketClick={handleTicketClick}
                  isDashboard={true}
                  randomTickets={raffle.randomTickets}
                  users={raffle.users || []}
                  onUnreserveTicket={handleUnreserveTicket}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='edit'>
          <EditForm raffle={raffle} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
