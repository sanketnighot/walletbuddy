"use client"
import React from "react"
import Loader from "@/Components/Loader"

const MnemonicDisplay = ({
  mnemonic,
  isLoading,
  error,
}: {
  mnemonic: string[]
  isLoading: boolean
  error: string
}) => {
  return (
    <>
      {!isLoading && !error && (
        <section className="grid grid-cols-3 gap-2 mt-4 mx-2">
          {mnemonic.map((word, index) => (
            <span
              key={index}
              className="text-tg-text border border-tg-border rounded-md p-2 text-center bg-tg-header-bg"
            >
              {word}
            </span>
          ))}
        </section>
      )}
      {isLoading && !error && (
        <>
          <div className="w-full h-[30dvh] flex items-center justify-center">
            <Loader />
          </div>
        </>
      )}
      {error && !isLoading && (
        <section className="flex items-center justify-center w-full text-red-500 mt-4 mx-2">
          <p>{error}</p>
        </section>
      )}
      <section className="text-tg-hint mt-4 mx-2">
        <p>
          <span className="font-bold underline">Note:</span>{" "}
          <span>
            This seed phrase is the only way to recover your wallet. If you lose
            it, you will lose access to your wallet.
          </span>
        </p>
      </section>
    </>
  )
}

export default MnemonicDisplay
