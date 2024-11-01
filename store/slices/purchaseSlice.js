import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase'

export const createPurchaseSlice = (set, get) => ({
  updateRaffleWithPendingPurchase: async (raffleId, purchaseData) => {
    try {
      const docRef = doc(db, 'raffles', raffleId)
      const docSnap = await getDoc(docRef)
      if (!docSnap.exists()) throw new Error('Rifa no encontrada')

      const currentRaffle = docSnap.data()
      const newReservedTickets = [
        ...(currentRaffle.reservedTickets || []),
        ...purchaseData.selectedTickets
      ]

      const updatedRaffle = {
        ...currentRaffle,
        reservedTickets: newReservedTickets,
        availableNumbers: currentRaffle.totalTickets -
          (currentRaffle.soldTickets?.length || 0) -
          newReservedTickets.length,
        pendingPurchases: [
          ...(currentRaffle.pendingPurchases || []),
          { ...purchaseData, status: 'pending', createdAt: new Date() }
        ]
      }

      await updateDoc(docRef, updatedRaffle)

      set(state => ({
        raffles: state.raffles.map(raffle =>
          raffle.id === raffleId ? { ...raffle, ...updatedRaffle } : raffle
        )
      }))

      return true
    } catch (error) {
      console.error('Error updating pending purchase:', error)
      throw error
    }
  }
}) 