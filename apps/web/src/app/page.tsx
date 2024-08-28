"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import useStorage from "@/hooks/useStorage"
import Loader from "@/Components/Loader"
import WelcomeScreen from "@/Components/WelcomeScreen"
import useUserData from "@/hooks/useUserData"

const App = () => {
  const router = useRouter()
  const { value: passwordStorage, isLoading: isPasswordStorageLoading } =
    useStorage("password")
  const {
    walletData,
    loading: userDataLoading,
    error: userDataError,
  } = useUserData()

  const [isInitialized, setIsInitialized] = useState(false)
  const [webAppUser, setWebAppUser] = useState<any | null>(null)

  useEffect(() => {
    window.Telegram!.WebApp.BackButton.hide()
    const user = window.Telegram!.WebApp.initDataUnsafe.user
    setWebAppUser(user)
    if (!isPasswordStorageLoading && !userDataLoading) {
      console.log("walletData", walletData)
      if (!passwordStorage) {
        router.push("/setNewPassword")
      } else if (!userDataError && walletData.walletInfo.length > 0) {
        router.push(`/accounts?tab=tokens`)
      } else {
        router.push("/onboarding/createWallet")
      }
      setIsInitialized(true)
    }
  }, [
    isPasswordStorageLoading,
    userDataLoading,
    passwordStorage,
    userDataError,
    walletData,
  ])

  if (!isInitialized) {
    return (
      <div className="w-full h-dvh flex items-center justify-center">
        <Loader />
      </div>
    )
  }

  return (
    <div className={`min-h-screen flex flex-col justify-center`}>
      {isInitialized && passwordStorage && (
        <WelcomeScreen userName={webAppUser?.username} />
      )}

      {!isInitialized && (
        <div className="w-full h-full flex items-center justify-center">
          <Loader />
        </div>
      )}
    </div>
  )
}

export default App
