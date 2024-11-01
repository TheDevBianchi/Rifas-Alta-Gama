import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import emailjs from '@emailjs/browser'

export const createApprovalSlice = (set, get) => ({
  approvePendingPurchase: async (raffleId, purchase) => {
    try {
      const docRef = doc(db, 'raffles', raffleId)
      const docSnap = await getDoc(docRef)

      if (!docSnap.exists()) {
        throw new Error('Rifa no encontrada')
      }

      const currentRaffle = docSnap.data()

      // Remover la compra de pendingPurchases
      const updatedPendingPurchases = currentRaffle.pendingPurchases.filter(
        p => p.createdAt.seconds !== purchase.createdAt.seconds
      )

      // Agregar tickets a soldTickets
      const updatedSoldTickets = [
        ...(currentRaffle.soldTickets || []),
        ...purchase.selectedTickets
      ]

      // Manejar tickets reservados según el tipo de rifa
      let updatedReservedTickets = [...(currentRaffle.reservedTickets || [])]

      if (currentRaffle.randomTickets) {
        // Para rifas aleatorias, eliminar la cantidad de tickets que se vendieron
        const ticketsToRemove = purchase.selectedTickets.length
        updatedReservedTickets = updatedReservedTickets.slice(ticketsToRemove)
      } else {
        // Para rifas normales, eliminar los tickets específicos
        updatedReservedTickets = updatedReservedTickets.filter(
          ticket => !purchase.selectedTickets.includes(ticket)
        )
      }

      // Agregar usuario a la lista de usuarios confirmados
      const updatedUsers = [
        ...(currentRaffle.users || []),
        {
          ...purchase,
          status: 'confirmed',
          purchaseDate: new Date()
        }
      ]

      const updatedRaffle = {
        ...currentRaffle,
        pendingPurchases: updatedPendingPurchases,
        soldTickets: updatedSoldTickets,
        reservedTickets: updatedReservedTickets,
        users: updatedUsers,
        availableNumbers: currentRaffle.totalTickets - updatedSoldTickets.length - updatedReservedTickets.length
      }

      await updateDoc(docRef, updatedRaffle)

      // Enviar correo de confirmación
      const emailParams = {
        email: purchase.email,
        name: purchase.name,
        amount: (purchase.selectedTickets.length * currentRaffle.price).toFixed(2),
        date: new Date(purchase.createdAt.seconds * 1000).toLocaleDateString(),
        paymentMethod: purchase.paymentMethod,
        raffleName: currentRaffle.title,
        ticketsCount: purchase.selectedTickets.length,
        confirmationNumber: purchase.reference,
        number: purchase.selectedTickets.join(', ')
      }

      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
        emailParams,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
      )

      set(state => ({
        raffles: state.raffles.map(raffle =>
          raffle.id === raffleId ? { ...raffle, ...updatedRaffle } : raffle
        )
      }))

      return true
    } catch (error) {
      console.error('Error approving purchase:', error)
      throw error
    }
  },

  rejectPendingPurchase: async (raffleId, purchase) => {
    try {
      const docRef = doc(db, 'raffles', raffleId)
      const docSnap = await getDoc(docRef)

      if (!docSnap.exists()) {
        throw new Error('Rifa no encontrada')
      }

      const currentRaffle = docSnap.data()

      // Remover la compra de pendingPurchases
      const updatedPendingPurchases = currentRaffle.pendingPurchases.filter(
        p => p.createdAt.seconds !== purchase.createdAt.seconds
      )

      // Remover tickets de reservedTickets
      const updatedReservedTickets = currentRaffle.reservedTickets.filter(
        ticket => !purchase.selectedTickets.includes(ticket)
      )

      const updatedRaffle = {
        ...currentRaffle,
        pendingPurchases: updatedPendingPurchases,
        reservedTickets: updatedReservedTickets,
        availableNumbers: currentRaffle.totalTickets -
          (currentRaffle.soldTickets?.length || 0) -
          updatedReservedTickets.length
      }

      await updateDoc(docRef, updatedRaffle)

      set(state => ({
        raffles: state.raffles.map(raffle =>
          raffle.id === raffleId ? { ...raffle, ...updatedRaffle } : raffle
        )
      }))

      return true
    } catch (error) {
      console.error('Error rejecting purchase:', error)
      throw error
    }
  }
}) 