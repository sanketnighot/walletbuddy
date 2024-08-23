"use client"

import React, { useEffect, useState } from "react"
import { Copy } from "lucide-react"
import useBackButton from "@/hooks/useBackButton"
import { encryptData } from "@/utils/cryptography/"
import useStorage from "@/hooks/useStorage"
import MnemonicDisplay from "@/Components/MnemonicDisplay"
import { useRouter } from "next/navigation"
import {
  createSolanaKeys,
  generateKeypair,
  generateMnemonicForUser,
  generateSeed,
} from "@/utils/walletActions"

const CreateWallet = () => {
  const [mnemonic, setMnemonic] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [copied, setCopied] = useState(false)
  const { setValue: setSeedValue, error: seedError } = useStorage("seed")
  const { setValue: setAccounts, error: accountsError } = useStorage("accounts")
  const { setValue: setNetworks, error: networksError } = useStorage("networks")
  const router = useRouter()

  useBackButton()

  useEffect(() => {
    setIsLoading(true)
    const fetchWalletData = async () => {
      const userMnemonic = await generateMnemonicForUser()
      if (userMnemonic.success && userMnemonic.mnemonic) {
        setMnemonic(userMnemonic.mnemonic.split(" "))
      } else {
        setError("Error generating mnemonic")
      }
      setIsLoading(false)
    }
    fetchWalletData()
  }, [])

  const handleSubmit = async () => {
    const mnemonicSeed = await generateSeed(mnemonic.join(" "))
    if (!mnemonicSeed || !mnemonicSeed.success || !mnemonicSeed.seed) {
      console.log("Error generating account: ", mnemonicSeed.message)
      return setError("Error generating account")
    }
    const keypair = await generateKeypair(mnemonicSeed.seed, "solana", 0)
    if (!keypair || !keypair.success || !keypair.keypair) {
      console.log("Error generating keypair: ", keypair.message)
      return setError("Error generating keypair")
    }
    const solanaKeys = await createSolanaKeys(keypair.keypair)
    if (
      !solanaKeys ||
      !solanaKeys.success ||
      !solanaKeys.publicKey ||
      !solanaKeys.secretKey
    ) {
      console.log("Error creating solana keys: ", solanaKeys.message)
      return setError("Error creating solana keys")
    }
    const encryptSecretKey = await encryptData(solanaKeys.secretKey)
    if (
      !encryptSecretKey ||
      !encryptSecretKey.success ||
      !encryptSecretKey.encryptedData
    ) {
      console.log("Error encrypting secret key: ", encryptSecretKey.message)
      return setError("Error encrypting secret key")
    }
    const accounts = [
      {
        name: "Account 1",
        publicKey: solanaKeys.publicKey,
        secretKey: encryptSecretKey.encryptedData,
      },
    ]
    const networks = [
      {
        name: "Solana Devnet",
        rpc: "https://api.devnet.solana.com",
        explorer: "https://solscan.io",
        chainId: "devnet",
        type: "solana",
      },
    ]
    setSeedValue(encryptSecretKey.encryptedData)
    setAccounts(JSON.stringify(accounts))
    setNetworks(JSON.stringify(networks))
    alert("Wallet created successfully")
    router.push("/")
  }

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false)
      }, 3000)
    }
  }, [copied])
  return (
    <main className="flex flex-col items-center min-h-dvh text-center gap-2 bg-tg-bg p-4">
      <h1 className="text-tg-text text-3xl font-bold m-4">Create Wallet</h1>
      <h2 className="text-tg-section-header-text text-xl font-bold mb-4">
        Store the following 12-word seed phrase securly
      </h2>
      <section className="text-tg-text">
        <MnemonicDisplay
          mnemonic={mnemonic}
          isLoading={isLoading}
          error={error}
        />
        <section className="text-tg-text mt-4">
          <button
            className="w-4/6 text-tg-text rounded-md px-4 py-2 border border-tg-border flex items-center justify-center gap-2 mx-auto"
            onClick={() => {
              navigator.clipboard.writeText(mnemonic.join(" "))
              setCopied(true)
            }}
            disabled={copied}
          >
            {" "}
            {copied ? (
              "Copied"
            ) : (
              <>
                <Copy /> Copy to clipboard
              </>
            )}
          </button>
        </section>
        <section className="text-tg-text mt-2">
          <button
            className="text-tg-button-text rounded-md p-2 w-4/6 mx-auto border bg-tg-button"
            onClick={handleSubmit}
          >
            {" "}
            I have saved my seed phrase
          </button>

          {accountsError && (
            <p className="text-tg-text mt-2">${accountsError}</p>
          )}
          {seedError && <p className="text-tg-text mt-2">${seedError}</p>}
          {networksError && (
            <p className="text-tg-text mt-2">${networksError}</p>
          )}
        </section>
      </section>
    </main>
  )
}

export default CreateWallet
