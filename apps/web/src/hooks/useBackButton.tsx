'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const useBackButton = () => {
  const router = useRouter()

  useEffect(() => {
    window.Telegram?.WebApp.BackButton.show()
    window.Telegram?.WebApp.BackButton.onClick(() => {
      router.back()
    })
  }, [])
}

export default useBackButton