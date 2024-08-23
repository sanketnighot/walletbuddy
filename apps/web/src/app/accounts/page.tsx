"use client"

import React, { useEffect, useState } from "react"
import useBackButton from "@/hooks/useBackButton"
import useStorage from "@/hooks/useStorage"
import { ArrowRightLeft, Copy, Gamepad2, HandCoins, Send } from "lucide-react"
import Tokens from "@/Components/AccountTabs/tokens"
import Nfts from "@/Components/AccountTabs/nfts"
import Subscriptions from "@/Components/AccountTabs/subscriptions"
import Activity from "@/Components/AccountTabs/activity"

type Account = {
  name: string
  publicKey: string
  secretKey: string
}

const Accounts = () => {
  const [userAccounts, setUserAccounts] = useState<Account[]>([])
  const [activeTab, setActiveTab] = useState<string>("tokens")

  const {
    value: accounts,
    isLoading: accountsLoading,
    error: accountsError,
  } = useStorage("accounts")
  useBackButton()

  useEffect(() => {
    if (!accountsLoading && accounts) {
      console.log(JSON.parse(accounts))
      setUserAccounts(JSON.parse(accounts))
    }
  }, [accounts, accountsLoading])

  return (
    <main className="flex flex-col text-tg-text">
      <header className="flex items-center justify-center bg-tg-header-bg w-full h-16 text-tg-text">
        <section className="flex flex-col items-center justify-center p-1">
          <h1 className="text-2xl font-bold mt-2">
            {userAccounts.length >= 0 && userAccounts[0]?.name}
          </h1>
          <h1 className="text-sm text-tg-hint mb-2">
            {userAccounts.length >= 0 ? (
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
          <h1 className="text-5xl font-semibold m-5 text-tg-hint">0 SOL</h1>
        </section>
        <section className="grid grid-cols-4 gap-2 w-full mx-auto my-2">
          <button className="flex flex-col items-center bg-tg-accent-text justify-center border border-tg-border rounded-lg p-2">
            <Send size={24} /> Send
          </button>
          <button className="flex flex-col items-center bg-tg-accent-text justify-center border border-tg-border rounded-lg p-2">
            <HandCoins size={24} /> Airdrop
          </button>
          <button className="flex flex-col items-center bg-tg-accent-text justify-center border border-tg-border rounded-lg p-2">
            <ArrowRightLeft size={24} /> Swap
          </button>
          <button className="flex flex-col items-center bg-tg-accent-text justify-center border border-tg-border rounded-lg p-2">
            <Gamepad2 size={24} /> Games
          </button>
        </section>
        {/* <section className="flex flex-col items-center justify-center">
          <hr className="w-full border-tg-hint my-2" />
        </section> */}
        <section className="flex flex-col items-center justify-center mt-4">
          <div className="w-full">
            <div className="flex justify-between border-t border-tg-hint">
              <button
                className={`py-2 px-4 hover:text-tg-link focus:outline-none focus:text-tg-link border-t-2 border-transparent focus:border-tg-link ${
                  activeTab === "tokens"
                    ? "border-t-2 border-tg-link text-tg-link"
                    : "text-tg-text"
                }`}
                onClick={() => setActiveTab("tokens")}
              >
                Tokens
              </button>
              <button
                className={`py-2 px-4 hover:text-tg-link focus:outline-none focus:text-tg-link border-t-2 border-transparent focus:border-tg-link ${
                  activeTab === "nfts"
                    ? "border-t-2 border-tg-link text-tg-link"
                    : "text-tg-text"
                }`}
                onClick={() => setActiveTab("nfts")}
              >
                NFTs
              </button>
              <button
                className={`py-2 px-4 hover:text-tg-link focus:outline-none focus:text-tg-link border-t-2 border-transparent focus:border-tg-link ${
                  activeTab === "subscriptions"
                    ? "border-t-2 border-tg-link text-tg-link"
                    : "text-tg-text"
                }`}
                onClick={() => setActiveTab("subscriptions")}
              >
                Subscriptions
              </button>
              <button
                className={`py-2 px-4 hover:text-tg-link focus:outline-none focus:text-tg-link border-t-2 border-transparent focus:border-tg-link ${
                  activeTab === "activity"
                    ? "border-t-2 border-tg-link text-tg-link"
                    : "text-tg-text"
                }`}
                onClick={() => setActiveTab("activity")}
              >
                Activity
              </button>
            </div>
            <div className="mt-4">
              {/* Content for each tab will go here */}
              {activeTab === "tokens" && <Tokens />}
              {activeTab === "nfts" && <Nfts />}
              {activeTab === "subscriptions" && <Subscriptions />}
              {activeTab === "activity" && <Activity />}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default Accounts
