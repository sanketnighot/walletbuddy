"use client"

import React, { useEffect, useState, Suspense } from "react"
import { useRouter } from "next/navigation"
import useBackButton from "@/hooks/useBackButton"
import { ArrowRightLeft, Copy, Ellipsis, HandCoins, Send } from "lucide-react"
import Tokens from "@/Components/AccountTabs/tokens"
import Nfts from "@/Components/AccountTabs/nfts"
import Subscriptions from "@/Components/AccountTabs/subscriptions"
import Activity from "@/Components/AccountTabs/activity"
import { getSolanaBalance, requestAirdrop } from "@/utils/solana"
import useUserData from "@/hooks/useUserData"
import Loader from "@/Components/Loader"

const moreOptions = [
  { id: 0, label: "Import wallet" },
  { id: 1, label: "Create new token" },
  { id: 2, label: "Create new NFT" },
  { id: 3, label: "Play Minigames" },
  { id: 4, label: "Add Network" },
  { id: 5, label: "Reset wallet" },
]

const Accounts = () => {
  const [userAccounts, setUserAccounts] = useState<any[]>([])
  const [solanaBalance, setSolanaBalance] = useState<number | null>(null)
  const [userDataInfo, setUserDataInfo] = useState<any | null>(null)
  const [isCopied, setIsCopied] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [isAirdropLoading, setIsAirdropLoading] = useState(false)
  const [isMorePopupOpen, setIsMorePopupOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("tokens")

  const router = useRouter()

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

  useEffect(() => {
    setIsClient(true)
  }, [])

  const MorePopup = () => (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
      onClick={() => setIsMorePopupOpen(false)}
    >
      <div
        className="bg-tg-bg rounded-lg p-4 w-4/6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-2">
          {moreOptions.map((option, index) => (
            <React.Fragment key={option.id}>
              <button className="w-full text-left p-2 hover:bg-tg-hint rounded transition-colors duration-200 text-tg-text">
                {option.label}
              </button>
              {index < moreOptions.length - 1 && (
                <hr className="border-tg-border opacity-10" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  )

  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <Loader />
      </div>
    )
  }

  return (
    <Suspense fallback={<Loader />}>
      <main className="flex flex-col text-tg-text">
        <header className="flex items-center justify-center bg-tg-header-bg w-full h-16 text-tg-text">
          <section className="flex flex-col items-center justify-center p-1">
            <h1 className="text-2xl font-bold mt-2">
              {userAccounts.length > 0 ? userAccounts[0]?.name : "Loading..."}
            </h1>
            <h1 className="text-sm text-tg-hint mb-2">
              {userAccounts.length > 0 ? (
                <span
                  className={`flex items-center cursor-pointer ${isCopied ? "text-green-500" : ""}`}
                  onClick={() => {
                    navigator.clipboard.writeText(userAccounts[0]?.publicKey)
                    setIsCopied(true)
                    setTimeout(() => setIsCopied(false), 1000)
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
            <button
              className="flex flex-col items-center bg-tg-secondary-bg justify-center border border-tg-border rounded-lg p-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              disabled={!userAccounts[0]?.publicKey}
            >
              <Send size={24} /> Send
            </button>
            <button
              className="flex flex-col items-center bg-tg-secondary-bg justify-center border border-tg-border rounded-lg p-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              disabled={!userAccounts[0]?.publicKey || isAirdropLoading}
              onClick={() => {
                setIsAirdropLoading(true)
                requestAirdrop(userAccounts[0]?.publicKey).then((res) => {
                  console.log("res", res)
                  if (res.success) {
                    alert("Airdrop sent successfully")
                    setTimeout(() => {
                      setIsAirdropLoading(false)
                    }, 1000)
                  } else {
                    alert("Failed to send airdrop")
                    setTimeout(() => {
                      setIsAirdropLoading(false)
                    }, 1000)
                  }
                })
              }}
            >
              {isAirdropLoading ? <Loader size={7} /> : <HandCoins size={24} />}
              Airdrop
            </button>
            <button
              className="flex flex-col items-center bg-tg-secondary-bg justify-center border border-tg-border rounded-lg p-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              disabled={!userAccounts[0]?.publicKey}
            >
              <ArrowRightLeft size={24} /> Swap
            </button>
            <button
              className="flex flex-col items-center bg-tg-secondary-bg justify-center border border-tg-border rounded-lg p-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              disabled={!userAccounts[0]?.publicKey}
              onClick={() => setIsMorePopupOpen(true)}
            >
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
              {activeTab === "tokens" && (
                <Tokens publicKey={userAccounts[0]?.publicKey} />
              )}
              {activeTab === "nfts" && (
                <Nfts publicKey={userAccounts[0]?.publicKey} />
              )}
              {activeTab === "subscriptions" && (
                <Subscriptions userId={userDataInfo?.id} />
              )}
              {activeTab === "activity" && <Activity />}
            </div>
          </section>
        </div>
        {isMorePopupOpen && <MorePopup />}
      </main>
    </Suspense>
  )
}

export default Accounts
