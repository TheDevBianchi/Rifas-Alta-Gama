import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '@/firebase'
import { RaffleStatus } from '../types'

export const createRaffleSlice = (set, get) => ({
  raffles: [],

  // Acciones básicas
  setRaffles: (raffles) => set({ raffles }),

  // Acciones de Firebase
  createRaffle: async (raffleData) => {
    const { setLoading, setError } = get()
    setLoading(true)

    try {
      const imageUrls = await Promise.all(
        raffleData.images.map(async (img, index) => {
          const storageRef = ref(storage, `raffles/${Date.now()}_${index}`)
          const snapshot = await uploadBytes(storageRef, img.file)
          return getDownloadURL(snapshot.ref)
        })
      )

      const raffleWithImages = {
        ...raffleData,
        images: imageUrls,
        createdAt: new Date(),
        status: RaffleStatus.ACTIVE,
        soldTickets: [],
        reservedTickets: [],
        availableNumbers: raffleData.totalTickets,
        pendingPurchases: [],
        randomTickets: raffleData.randomTickets
      }

      const docRef = await addDoc(collection(db, 'raffles'), raffleWithImages)
      const newRaffle = { id: docRef.id, ...raffleWithImages }

      set((state) => ({
        raffles: [...state.raffles, newRaffle]
      }))

      return docRef.id
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  },

  getRaffles: async () => {
    const { setLoading, setError } = get()
    setLoading(true)

    try {
      const querySnapshot = await getDocs(collection(db, 'raffles'))
      const raffles = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      }))

      set({ raffles })
    } catch (error) {
      setError('Error al obtener las rifas')
    } finally {
      setLoading(false)
    }
  },

  updateRaffle: async (id, updatedRaffle) => {
    const { setLoading, setError } = get()
    try {
      setLoading(true)

      // Referencia al documento de la rifa
      const raffleRef = doc(db, 'raffles', id)

      // Preparar los datos para actualizar
      const {
        id: _,  // Excluir el ID
        createdAt, // Excluir createdAt
        ...updateData
      } = updatedRaffle

      // Asegurarnos de que las fechas están en el formato correcto
      const dataToUpdate = {
        ...updateData,
        updatedAt: new Date().toISOString(),
        endDate: new Date(updateData.endDate),
        price: Number(updateData.price),
        totalTickets: Number(updateData.totalTickets),
        minTickets: Number(updateData.minTickets)
      }

      // Actualizar en Firestore
      await updateDoc(raffleRef, dataToUpdate)

      // Actualizar el estado local
      set((state) => ({
        raffles: state.raffles.map((raffle) =>
          raffle.id === id
            ? { ...raffle, ...dataToUpdate }
            : raffle
        )
      }))

      return {
        id,
        ...dataToUpdate,
        createdAt: updatedRaffle.createdAt
      }
    } catch (error) {
      console.error('Error updating raffle:', error)
      setError('Error al actualizar la rifa: ' + error.message)
      throw error
    } finally {
      setLoading(false)
    }
  },

  deleteRaffle: async (id) => {
    const { setLoading, setError } = get()
    setLoading(true)

    try {
      await deleteDoc(doc(db, 'raffles', id))
      set(state => ({
        raffles: state.raffles.filter(raffle => raffle.id !== id)
      }))
    } catch (error) {
      setError('Error al eliminar la rifa')
      throw error
    } finally {
      setLoading(false)
    }
  }
}) 