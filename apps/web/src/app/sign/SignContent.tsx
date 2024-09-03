"use client"

import React, { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import axios from "axios"
import { motion } from "framer-motion"
import { FiDollarSign, FiUser, FiClock, FiInfo } from "react-icons/fi"

type TransactionData = {
  id: string
  createdAt: string
  status: string
  txn: {
    amount: string
    recipient: string
    base64: string
  }
  session: {
    id: string
    status: string
    dapp: {
      name: string
      description: string
      url: string
    }
    user: {
      walletInfo: Array<{
        publicKey: string
      }>
    }
  }
}

const SignContent: React.FC = () => {
  const searchParams = useSearchParams()
  const transactionId = searchParams.get("transactionId")
  const [transactionData, setTransactionData] =
    useState<TransactionData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTransactionData = async () => {
      if (!transactionId) {
        setError("No transaction ID provided")
        setIsLoading(false)
        return
      }

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_WEBHOOK_URL}/api/v1/transaction/${transactionId}`
        )
        setTransactionData(response.data.transaction)
      } catch (err) {
        setError("Failed to fetch transaction data")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTransactionData()
  }, [transactionId])

  const handleAccept = async () => {
    // Implementation for accepting the transaction
  }

  const handleReject = async () => {
    // Implementation for rejecting the transaction
  }

  if (isLoading) {
    return <div>Loading transaction data...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  if (!transactionData) {
    return <div>No transaction data available</div>
  }

  return (
    <div className="min-h-screen bg-tg-bg text-tg-text p-6">
      {/* Your existing JSX for rendering transaction details */}
    </div>
  )
}

export default SignContent
