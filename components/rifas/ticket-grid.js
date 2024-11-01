import { useState } from 'react'
import { UserInfoDialog } from '@/components/dashboard/UserInfoDialog'
import { UnreservTicketDialog } from '@/components/dashboard/UnreservTicketDialog'

const TicketGrid = ({
  totalTickets,
  reservedTickets,
  soldTickets = [],
  selectedTickets,
  onTicketClick,
  isDashboard = false,
  randomTickets = false,
  users = [],
  onUnreserveTicket
}) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [ticketToUnreserve, setTicketToUnreserve] = useState(null)
  const [isUnreserving, setIsUnreserving] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(null)

  const normalizeTicketNumber = (number) => {
    const cleanNumber = typeof number === 'string'
      ? parseInt(number, 10)
      : number

    if (totalTickets <= 100) {
      return cleanNumber.toString().padStart(2, '0')
    } else if (totalTickets <= 1000) {
      return cleanNumber.toString().padStart(3, '0')
    } else if (totalTickets <= 10000) {
      return cleanNumber.toString().padStart(4, '0')
    }
    return cleanNumber.toString()
  }

  const normalizedSoldTickets = soldTickets.map(ticket => normalizeTicketNumber(ticket))
  const normalizedReservedTickets = reservedTickets.map(ticket => normalizeTicketNumber(ticket))
  const normalizedSelectedTickets = selectedTickets.map(ticket => normalizeTicketNumber(ticket))

  const handleTicketClick = (number, isReserved) => {
    if (isDashboard) {
      if (isReserved) {
        setTicketToUnreserve(number)
      } else {
        const formattedNumber = normalizeTicketNumber(number)
        const buyer = users.find(user =>
          user.selectedTickets.some(ticket =>
            normalizeTicketNumber(ticket) === formattedNumber
          ) &&
          user.status === 'confirmed'
        )
        if (buyer) {
          setSelectedUser({
            ...buyer,
            ticketNumber: formattedNumber
          })
          setDialogOpen(true)
        }
      }
    } else {
      onTicketClick(number)
    }
  }

  const handleUnreserveConfirm = async () => {
    setIsUnreserving(true)
    try {
      await onUnreserveTicket(ticketToUnreserve)
    } finally {
      setIsUnreserving(false)
      setTicketToUnreserve(null)
    }
  }

  return (
    <>
      <div className='grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2'>
        { randomTickets ? (
          Array.from({ length: totalTickets }, (_, i) => {
            const number = normalizeTicketNumber(i + 1)
            const isSold = normalizedSoldTickets.includes(number)
            const buyer = isSold ? users.find(user =>
              user.selectedTickets.some(ticket =>
                normalizeTicketNumber(ticket) === number
              ) &&
              user.status === 'confirmed'
            ) : null

            return (
              <button
                key={ number }
                type='button'
                onClick={ () => {
                  if (isDashboard && buyer) {
                    setSelectedUser(buyer)
                    setDialogOpen(true)
                    setSelectedIndex(i)
                  }
                } }
                className={ `
                  p-2 text-center border rounded
                  transition-colors duration-200
                  focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                  ${isSold
                    ? 'bg-red-500 text-white hover:bg-red-600 cursor-pointer'
                    : 'bg-emerald-500 text-white hover:bg-emerald-600 cursor-pointer'
                  }
                `}
              >
                { number }
              </button>
            )
          })
        ) : (
          Array.from({ length: totalTickets }, (_, i) => {
            const number = i
            const formattedNumber = normalizeTicketNumber(number)
            const isReserved = normalizedReservedTickets.includes(formattedNumber)
            const isSold = normalizedSoldTickets.includes(formattedNumber)
            const isSelected = normalizedSelectedTickets.includes(formattedNumber)
            const buyer = isSold ? users.find(user =>
              user.selectedTickets.some(ticket =>
                normalizeTicketNumber(ticket) === formattedNumber
              ) &&
              user.status === 'confirmed'
            ) : null

            const isDisabled = isDashboard ? false : isReserved || isSold
            const cursorStyle = isDashboard
              ? 'cursor-pointer'
              : isReserved || isSold
                ? 'cursor-not-allowed'
                : 'cursor-pointer'

            return (
              <button
                key={ number }
                type='button'
                onClick={ () => {
                  if (isDashboard && buyer) {
                    setSelectedUser(buyer)
                    setDialogOpen(true)
                    setSelectedIndex(number)
                  } else {
                    handleTicketClick(number, isReserved)
                  }
                } }
                disabled={ isDisabled }
                aria-label={ `Número ${formattedNumber}${isReserved ? ', reservado' : isSold ? ', vendido' : ''
                  }` }
                aria-pressed={ isSelected }
                className={ `S
                  p-2 text-center border rounded
                  transition-colors duration-200
                  focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                  ${cursorStyle}
                  ${isSelected ? 'bg-primary text-white' : ''}
                  ${isReserved
                    ? 'bg-amber-500 text-white hover:bg-amber-600'
                    : isSold
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-emerald-500 text-white hover:bg-emerald-600'
                  }
                `}
              >
                { formattedNumber }
              </button>
            )
          })
        ) }
      </div>

      <UserInfoDialog
        open={ dialogOpen }
        onOpenChange={ setDialogOpen }
        user={ selectedUser }
        index={ selectedIndex }
      />

      <UnreservTicketDialog
        selectedTicket={ ticketToUnreserve }
        isUnreserving={ isUnreserving }
        onClose={ () => setTicketToUnreserve(null) }
        onConfirm={ handleUnreserveConfirm }
        index={ selectedIndex }
      />
    </>
  )
}

export default TicketGrid
