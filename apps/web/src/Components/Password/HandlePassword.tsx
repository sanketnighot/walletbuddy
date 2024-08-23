"use client"

import { useCallback, useEffect, useState } from "react"
import PasswordEntryStep from "./Inputs/PasswordEntryStep"
import useTelegramBot from "@/hooks/useTelegramBot"
import useBackButton from "@/hooks/useBackButton"
import { useRouter } from "next/navigation"
import { encryptData, hashData } from "@/utils/cryptography"
import useStorage from "@/hooks/useStorage"

const HandlePassword = () => {
  const [step, setStep] = useState<"initial" | "confirm">("initial")
  const [initialPassword, setInitialPassword] = useState<string>("")
  const [confirmPassword, setConfirmPassword] = useState<string>("")
  const [error, setError] = useState<string>("")
  const router = useRouter()
  const { value: passwordStorage, setValue: setPasswordStorage } =
    useStorage("password")
  const { value: hashedPasswordStorage, setValue: setHashedPasswordStorage } =
    useStorage("hashedPassword")

  useBackButton()
  useTelegramBot()

  const sendData = useCallback((data: any) => {
    window.Telegram?.WebApp.sendData(JSON.stringify(data))
  }, [])

  useEffect(() => {
    if (error) {
      setError("")
    }
  }, [initialPassword, confirmPassword])

  const handleSubmit = async () => {
    if (step === "initial") {
      if (initialPassword.length >= 6) {
        setStep("confirm")
        setConfirmPassword("")
      } else {
        setError("Password must be at least 6 characters long.")
      }
    } else {
      if (initialPassword === confirmPassword) {
        const hashedPassword = await hashData(initialPassword)
        const encryptedPassword = await encryptData(initialPassword)
        if (encryptedPassword.encryptedData && hashedPassword.hashedData) {
          setPasswordStorage(encryptedPassword.encryptedData)
          setHashedPasswordStorage(hashedPassword.hashedData)
        } else {
          setError("Failed to create password.")
          router.push("/")
        }
        alert("Password set successfully")
        router.push("/")
      } else {
        setError("Passwords do not match. Please try again.")
      }
    }
  }

  return (
    <PasswordEntryStep
      password={step === "initial" ? initialPassword : confirmPassword}
      setPassword={step === "initial" ? setInitialPassword : setConfirmPassword}
      title={step === "initial" ? "Enter New Password" : "Confirm New Password"}
      buttonTitle={step === "initial" ? "Next" : "Confirm Password"}
      onSubmit={handleSubmit}
      error={error}
    />
  )
}

export default HandlePassword
