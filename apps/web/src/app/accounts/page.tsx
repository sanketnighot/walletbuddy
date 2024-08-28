"use client"

import React, { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import useBackButton from "@/hooks/useBackButton"
import useStorage from "@/hooks/useStorage"
import { ArrowRightLeft, Copy, Ellipsis, HandCoins, Send } from "lucide-react"
import Tokens from "@/Components/AccountTabs/tokens"
import Nfts from "@/Components/AccountTabs/nfts"
import Subscriptions from "@/Components/AccountTabs/subscriptions"
import Activity from "@/Components/AccountTabs/activity"
import { getSolanaBalance } from "@/utils/solana"
import useUserData from "@/hooks/useUserData"

const Accounts = () => {
  const [userAccounts, setUserAccounts] = useState<any[]>([])
  const [solanaBalance, setSolanaBalance] = useState<number | null>(null)
  const [userDataInfo, setUserDataInfo] = useState<any | null>(null)

  const router = useRouter()
  const searchParams = useSearchParams()
  const activeTab = searchParams.get("tab") || "tokens"

  const { userData, walletData, loading: userDataLoading } = useUserData()

  useBackButton()

  useEffect(() => {
    if (!userDataLoading && walletData && userData) {
      setUserAccounts(walletData.walletInfo)
      getSolanaBalance(walletData.walletInfo[0].publicKey).then((balance) => {
        setSolanaBalance(balance)
      })
      console.log("userData", userData)
      setUserDataInfo(userData)
    }
  }, [walletData, userDataLoading])

  const setActiveTab = (tab: string) => {
    router.replace(`/accounts?tab=${tab}`, { scroll: false })
  }

  return (
    <main className="flex flex-col text-tg-text">
      <header className="flex items-center justify-center bg-tg-header-bg w-full h-16 text-tg-text">
        <section className="flex flex-col items-center justify-center p-1">
          <h1 className="text-2xl font-bold mt-2">
            {userAccounts.length > 0 ? userAccounts[0]?.name : "Loading..."}
          </h1>
          <h1 className="text-sm text-tg-hint mb-2">
            {userAccounts.length > 0 ? (
              <span
                className="flex items-center cursor-pointer"
                onClick={() => {
                  navigator.clipboard.writeText(userAccounts[0]?.publicKey)
                }}
              >
                {userAccounts[0]?.publicKey.slice(0, 7)} ...{" "}
                {userAccounts[0]?.publicKey.slice(-7)}
                <Copy className="ml-2" size={18} />
              </span>
            ) : (
              <>Loading ...</>
            )}
          </h1>
        </section>
      </header>
      <div className="flex flex-col text-tg-text m-4">
        <section className="flex flex-col justify-center items-center">
          <h1 className="text-5xl font-semibold m-5 text-tg-hint">
            {solanaBalance !== null
              ? `${solanaBalance.toFixed(4)} SOL`
              : "Loading..."}
          </h1>
        </section>
        <section className="grid grid-cols-4 gap-2 w-full mx-auto my-2">
          <button className="flex flex-col items-center bg-tg-secondary-bg justify-center border border-tg-border rounded-lg p-2">
            <Send size={24} /> Send
          </button>
          <button className="flex flex-col items-center bg-tg-secondary-bg justify-center border border-tg-border rounded-lg p-2">
            <HandCoins size={24} /> Airdrop
          </button>
          <button className="flex flex-col items-center bg-tg-secondary-bg justify-center border border-tg-border rounded-lg p-2">
            <ArrowRightLeft size={24} /> Swap
          </button>
          <button className="flex flex-col items-center bg-tg-secondary-bg justify-center border border-tg-border rounded-lg p-2">
            <Ellipsis size={24} /> More
          </button>
        </section>
        <section className="flex flex-col items-center justify-center mt-4 w-full">
          <div className="flex justify-between">
            <button
              className={`py-2 px-4 hover:text-tg-link focus:outline-none focus:text-tg-link focus:border-tg-link ${
                activeTab === "tokens"
                  ? "border-t-2 border-tg-link text-tg-link z-10"
                  : "text-tg-text"
              }`}
              onClick={() => setActiveTab("tokens")}
            >
              Tokens
            </button>
            <button
              className={`py-2 px-4 hover:text-tg-link focus:outline-none focus:text-tg-link focus:border-tg-link ${
                activeTab === "nfts"
                  ? "border-t-2 border-tg-link text-tg-link z-10"
                  : "text-tg-text"
              }`}
              onClick={() => setActiveTab("nfts")}
            >
              NFTs
            </button>
            <button
              className={`py-2 px-4 hover:text-tg-link focus:outline-none focus:text-tg-link focus:border-tg-link ${
                activeTab === "subscriptions"
                  ? "border-t-2 border-tg-link text-tg-link z-10"
                  : "text-tg-text"
              }`}
              onClick={() => setActiveTab("subscriptions")}
            >
              Subscriptions
            </button>
            <button
              className={`py-2 px-4 hover:text-tg-link focus:outline-none focus:text-tg-link focus:border-tg-link ${
                activeTab === "activity"
                  ? "border-t-2 border-tg-link text-tg-link z-10"
                  : "text-tg-text"
              }`}
              onClick={() => setActiveTab("activity")}
            >
              Activity
            </button>
          </div>
          <div className="mt-4 w-full">
            {/* Content for each tab will go here */}
            {activeTab === "tokens" && <Tokens />}
            {activeTab === "nfts" && <Nfts />}
            {activeTab === "subscriptions" && (
              <Subscriptions userId={userDataInfo?.id} />
            )}
            {activeTab === "activity" && <Activity />}
          </div>
        </section>
      </div>
    </main>
  )
}

export default Accounts
