import { useContext } from 'react'
import { InvContext } from '../context/inv.jsx'

export const useInv = () => {
  const context = useContext(InvContext)

  if (context === undefined) {
    throw new Error('No Pincha')
  }

  return context
}