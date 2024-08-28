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
import axios from "axios"
import { Network, Wallet } from "@/types/wallet"
import useUserData from "@/hooks/useUserData"

const CreateWallet = () => {
  const [mnemonic, setMnemonic] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [copied, setCopied] = useState(false)
  const { setValue: setSeedValue, error: seedError } = useStorage("seed")
  const { userData, loading, error: userDataError } = useUserData()
  const router = useRouter()

  useBackButton()

  useEffect(() => {
    if (userDataError) {
      console.log("Error fetching user data: ", userDataError)
      return setError("Error fetching user data")
    }
  }, [userData, userDataError, isLoading])

  useEffect(() => {
    setIsLoading(true)
    const fetchWalletData = async () => {
      const userMnemonic = await generateMnemonicForUser()
      if (userMnemonic.success === true) {
        setMnemonic(userMnemonic.data.split(" "))
      } else {
        setError("Error generating mnemonic")
      }
      setIsLoading(false)
    }
    fetchWalletData()
  }, [])

  const handleSubmit = async () => {
    const mnemonicSeed = await generateSeed(mnemonic.join(" "))
    if (!mnemonicSeed || !mnemonicSeed.success || !mnemonicSeed.data) {
      console.log("Error generating account: ", mnemonicSeed.message)
      return setError("Error generating account")
    }
    const keypair = await generateKeypair(mnemonicSeed.data, "solana", 0)
    if (!keypair || !keypair.success || !keypair.data) {
      console.log("Error generating keypair: ", keypair.message)
      return setError("Error generating keypair")
    }
    const solanaKeys = await createSolanaKeys(keypair.data)
    if (
      !solanaKeys ||
      !solanaKeys.success ||
      !solanaKeys.data.publicKey ||
      !solanaKeys.data.secretKey
    ) {
      console.log("Error creating solana keys: ", solanaKeys.message)
      return setError("Error creating solana keys")
    }
    const encryptSecretKey = await encryptData(solanaKeys.data.secretKey)
    if (
      !encryptSecretKey ||
      !encryptSecretKey.success ||
      !encryptSecretKey.encryptedData
    ) {
      console.log("Error encrypting secret key: ", encryptSecretKey.message)
      return setError("Error encrypting secret key")
    }

    const encryptedSeed = await encryptData(mnemonicSeed.data.toString())
    if (
      !encryptedSeed ||
      !encryptedSeed.success ||
      !encryptedSeed.encryptedData
    ) {
      console.log("Error encrypting seed: ", encryptedSeed.message)
      return setError("Error encrypting seed")
    }
    const account: Wallet = {
      name: "Account 1",
      publicKey: solanaKeys.data.publicKey,
      encPrivateKey: encryptSecretKey.encryptedData,
      network: "solana",
    }
    const networks: Network = {
      name: "Solana Devnet",
      rpc: "https://api.devnet.solana.com",
      explorer: "https://solscan.io",
      chainId: "devnet",
      currency: "SOL",
      decimals: 9,
    }

    setSeedValue(encryptSecretKey.encryptedData)
    const walletInfo = {
      userId: userData.id,
      encDerSeed: encryptedSeed.encryptedData,
      wallet: account,
    }
    const response = await axios.post(
      "https://webhook.therapix.in/api/v1/wallet/create",
      walletInfo
    )
    console.log("response", response)
    if (response.status === 200) {
      alert("Wallet created successfully")
      router.push("accounts?tab=${tab}")
      return
    } else {
      console.log("Error creating wallet: ", response.data.message)
      setError("Error creating wallet")
    }
    router.push("/")
  }

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false)
      }, 1000)
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
        </section>
      </section>
    </main>
  )
}

export default CreateWallet
