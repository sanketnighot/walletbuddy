"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import useStorage from "@/hooks/useStorage"
import Loader from "@/Components/Loader"
import WelcomeScreen from "@/Components/WelcomeScreen"

const App = () => {
  const router = useRouter()
  const { value: passwordStorage, isLoading: isPasswordStorageLoading } =
    useStorage("password")
  const { value: accountsStorage, isLoading: isAccountsStorageLoading } =
    useStorage("accounts")

  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    window.Telegram!.WebApp.BackButton.hide()

    if (!isPasswordStorageLoading) {
      if (!passwordStorage) {
        router.push("/setNewPassword")
      }
      setIsInitialized(true)
    }
    if (!isAccountsStorageLoading) {
      if (accountsStorage) {
        router.push("/accounts")
      }
    }
  }, [
    isPasswordStorageLoading,
    passwordStorage,
    router,
    isAccountsStorageLoading,
    accountsStorage,
  ])

  if (!isInitialized || isAccountsStorageLoading) {
    return (
      <div className="w-full h-dvh flex items-center justify-center">
        <Loader />
      </div>
    )
  }

  return (
    <div className={`min-h-screen flex flex-col justify-center`}>
      {isInitialized && passwordStorage && <WelcomeScreen />}

      {!isInitialized && (
        <div className="w-full h-full flex items-center justify-center">
          <Loader />
        </div>
      )}
    </div>
  )
}

export default App
