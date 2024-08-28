"use client"

import { useEffect, useState } from "react"
import type { TelegramWebApp } from "../types/telegram-webapp"

export default function useStorage(key: string) {
  const [value, setValue] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStorageValues = async () => {
      setIsLoading(true)
      try {
        const cloudStorageValue = await new Promise<string | null>(
          (resolve, reject) => {
            window.Telegram?.WebApp.CloudStorage.getItem(key, (err, value) => {
              if (err) reject(err)
              else resolve(value)
            })
          }
        )

        if (cloudStorageValue) {
          setValue(cloudStorageValue)
        }
      } catch (error) {
        console.error("Error fetching cloud storage:", error)
        setError("Error fetching cloud storage")
      }
      setIsLoading(false)
    }

    fetchStorageValues()
  }, [key])

  const updateValue = (newValue: string) => {
    window.Telegram?.WebApp.CloudStorage.setItem(key, newValue)
    setValue(newValue)
  }

  const removeValue = () => {
    window.Telegram?.WebApp.CloudStorage.removeItem(key, (err) => {
      if (err) {
        setError("Error removing cloud storage")
        console.error("Error removing cloud storage:", err)
      }
    })
    setValue(null)
  }

  return { value, setValue: updateValue, isLoading, removeValue, error }
}
