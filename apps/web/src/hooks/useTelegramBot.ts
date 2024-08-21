import { useEffect, useCallback } from "react"

const useTelegramBot = () => {
  useEffect(() => {
    const tg = window.Telegram?.WebApp
    if (!tg) return

    tg.ready()
    tg.MainButton.setText("Submit")
    tg.MainButton.hide()
  }, [])
}

export default useTelegramBot
