import { create } from 'zustand'
import { doc, getDoc, setDoc, collection } from 'firebase/firestore'
import { db } from '@/firebase'

export const useSettingsStore = create((set, get) => ({
  paymentMethods: [],
  loading: false,
  error: null,

  // Fetch payment methods
  getPaymentMethods: async () => {
    set({ loading: true, error: null })
    try {
      const docRef = doc(db, 'settings', 'paymentMethods')
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        set({ paymentMethods: docSnap.data().methods || [] })
      } else {
        // Initialize document if it doesn't exist
        await setDoc(docRef, { methods: [] })
        set({ paymentMethods: [] })
      }
    } catch (error) {
      set({ error: error.message })
    } finally {
      set({ loading: false })
    }
  },

  // Add new payment method
  addPaymentMethod: async (paymentMethod) => {
    set({ loading: true, error: null })
    try {
      const docRef = doc(db, 'settings', 'paymentMethods')
      const docSnap = await getDoc(docRef)

      let currentMethods = []
      if (docSnap.exists()) {
        currentMethods = docSnap.data().methods || []
      }

      const newMethod = {
        ...paymentMethod,
        id: Date.now().toString()
      }

      const updatedMethods = [...currentMethods, newMethod]

      // Usar setDoc en lugar de updateDoc para asegurar que el documento se cree
      await setDoc(docRef, { methods: updatedMethods })

      set({ paymentMethods: updatedMethods })
      return newMethod
    } catch (error) {
      console.error('Error adding payment method:', error)
      set({ error: error.message })
      throw error
    } finally {
      set({ loading: false })
    }
  },

  // Delete payment method
  deletePaymentMethod: async (id) => {
    set({ loading: true, error: null })
    try {
      const docRef = doc(db, 'settings', 'paymentMethods')
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const currentMethods = docSnap.data().methods || []
        const updatedMethods = currentMethods.filter(method => method.id !== id)

        await setDoc(docRef, { methods: updatedMethods })
        set({ paymentMethods: updatedMethods })
      }
    } catch (error) {
      console.error('Error deleting payment method:', error)
      set({ error: error.message })
      throw error
    } finally {
      set({ loading: false })
    }
  }
}))
