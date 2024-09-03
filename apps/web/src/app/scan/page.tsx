"use client"

import Loader from "@/Components/Loader"
import useUserData from "@/hooks/useUserData"
import axios from "axios"
import { useEffect, useState } from "react"

type sessionDataType = {
  id: string
  status: string
  dapp: {
    name: string
    url: string
    description: string
  }
  user?: {
    walletInfo: {
      publicKey: string
    }[]
  }
}

export default function ScanPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [pending, setPending] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [scanData, setScanData] = useState<string | null>(null)
  const [sessionData, setSessionData] = useState<sessionDataType | null>(null)
  const { userData } = useUserData()

  const getSessionData = async (sessionId: string) => {
    try {
      setIsLoading(true)
      const sessionData = await axios.get(
        `${process.env.NEXT_PUBLIC_WEBHOOK_URL}/api/v1/session?sessionId=${sessionId}`
      )
      setSessionData(sessionData.data)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAccept = async () => {
    setPending(1)
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_WEBHOOK_URL}/api/v1/session/accept`,
      {
        sessionId: sessionData?.id,
        chatId: userData?.id,
      }
    )
    setPending(0)
    window.Telegram?.WebApp.close()
  }

  const handleReject = async () => {
    setPending(2)
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_WEBHOOK_URL}/api/v1/session/reject`,
      {
        sessionId: sessionData?.id,
      }
    )
    setPending(0)
    window.Telegram?.WebApp.close()
  }

  const handleScan = () => {
    try {
      setIsLoading(true)
      setError(null)
      setScanData(null)

      window.Telegram?.WebApp.showScanQrPopup(
        {
          text: "Scan the QR code",
        },
        async (text: string) => {
          setScanData(() => text.trim())
          await getSessionData(text.trim())
          return true // Close the popup after scanning
        }
      )
    } catch (error: any) {
      if (error.message !== "WebAppScanQrPopupOpened") {
        setError(error.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    handleScan()
  }, [])

  useEffect(() => {
    if (scanData) {
      setIsLoading(false)
    }
  }, [scanData])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-dvh">
        <Loader />
      </div>
    )
  }

  if (!isLoading) {
    return (
      <>
        <main className="flex flex-col items-center justify-center h-dvh bg-tg-bg">
          {error && <p className="text-red-500">Error: {error}</p>}
          {sessionData && (
            <div className="flex flex-col items-center justify-center p-6 rounded-lg shadow-lg max-w-md w-full mx-auto h-full">
              <h1 className="text-2xl font-bold text-tg-text mb-4">
                Dapp Connection Request
              </h1>

              <div className="w-full space-y-4 mb-6">
                <div className="bg-tg-secondary-bg p-4 rounded-md">
                  <h2 className="text-lg font-semibold text-tg-accent-text mb-2">
                    {sessionData.dapp.name}
                  </h2>
                  <p className="text-tg-subtitle-text text-sm mb-2">
                    {sessionData.dapp.description}
                  </p>
                  <a
                    href={sessionData.dapp.url}
                    className="text-tg-link text-sm hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {sessionData.dapp.url}
                  </a>
                </div>
              </div>

              <div className="flex space-x-4 w-full">
                <button
                  className="flex-1 bg-green-500 text-tg-button-text py-2 px-4 rounded-md hover:opacity-90 transition-opacity"
                  onClick={handleAccept}
                  disabled={pending === 1}
                >
                  {pending === 1 ? "Accepting..." : "Accept"}
                </button>
                <button
                  className="flex-1 bg-red-500 text-tg-button-text py-2 px-4 rounded-md hover:opacity-90 transition-opacity"
                  onClick={handleReject}
                  disabled={pending === 2}
                >
                  {pending === 2 ? "Rejecting..." : "Reject"}
                </button>
              </div>
            </div>
          )}
        </main>
      </>
    )
  }
}
