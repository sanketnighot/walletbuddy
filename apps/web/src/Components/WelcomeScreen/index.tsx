import React from "react"
import Loader from "../Loader"

const WelcomeScreen = (props: { userName: string }) => {
  return (
    <main className="flex flex-col items-center justify-center h-dvh text-center gap-2 bg-tg-bg p-2 m-2">
      <h1 className="text-2xl font-bold text-tg-link">
        {props.userName && `@${props.userName}`}
      </h1>
      <h1 className="text-4xl font-bold mb-4 text-tg-text">
        Welcome to the Wallet Buddy
      </h1>
      <div>
        <Loader />
      </div>
    </main>
  )
}

export default WelcomeScreen
