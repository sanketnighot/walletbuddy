import React from "react"
import Link from "next/link"

const WelcomeScreen = () => {
  return (
    <main className="flex flex-col items-center justify-center h-dvh text-center gap-2 bg-tg-bg p-2 m-2">
      <h1 className="text-4xl font-bold mb-4 text-tg-text">
        Welcome to the Wallet Buddy
      </h1>
      <Link href="/onboarding">
        <button className="w-56 bg-tg-button text-tg-button-text px-4 py-2 rounded-md">
          Start
        </button>
      </Link>
    </main>
  )
}

export default WelcomeScreen
