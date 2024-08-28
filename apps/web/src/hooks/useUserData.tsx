"use client"

import axios from "axios"
import { useEffect, useState } from "react"

const useUserData = () => {
  const [userData, setUserData] = useState<any | null>(null)
  const [walletData, setWalletData] = useState<any | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true)
      try {
        const response = await window.Telegram?.WebApp.initDataUnsafe.user
        if (response) {
          setUserData(response)
          setError(null)
        } else {
          setError("Error fetching user data")
        }
        const walletResponse = await axios.get(
          `https://webhook.therapix.in/api/v1/wallet/get?chatId=${response?.id}`
        )
        if (walletResponse.data) {
          const userWalletData = await walletResponse.data
          setWalletData(userWalletData)
          setError(null)
        } else {
          setError("Error fetching wallet data")
        }
      } catch (error) {
        setError("Error fetching user data")
        setError(null)
      } finally {
        setLoading(false)
      }
    }
    fetchUserData()
  }, [])

  return { userData, walletData, loading, error }
}

export default useUserData
