"use client"
import React, { useEffect, useState } from "react"
import Image from "next/image"
import { Connection, PublicKey } from "@solana/web3.js"
import { TOKEN_PROGRAM_ID } from "@solana/spl-token"
import { Metadata } from "@metaplex-foundation/mpl-token-metadata"
import { programs } from "@metaplex/js"
import Loader from "../Loader"

interface TokenInfo {
  mint: string
  balance: string
  decimals: number
  metadata: Metadata
}

const Tokens = ({ publicKey }: { publicKey: string }) => {
  const [tokenData, setTokenData] = useState<TokenInfo[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [imageError, setImageError] = useState<Record<string, boolean>>({})

  async function getTokenBalance(
    publicKey: string
  ): Promise<TokenInfo[] | null> {
    setIsLoading(true)
    try {
      const connection = new Connection(
        process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "",
        "confirmed"
      )
      const pubKey = new PublicKey(publicKey)
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        pubKey,
        {
          programId: TOKEN_PROGRAM_ID,
        }
      )

      const balances = await Promise.all(
        tokenAccounts.value.map(async (accountInfo) => {
          try {
            const parsedInfo = accountInfo.account.data.parsed.info
            const metadataPDA = await programs.metadata.Metadata.findByMint(
              connection,
              new PublicKey(parsedInfo.mint)
            )
            return {
              mint: parsedInfo.mint,
              balance: parsedInfo.tokenAmount.uiAmount.toFixed(2),
              decimals: parsedInfo.tokenAmount.decimals,
              metadata: metadataPDA.data.data,
            }
          } catch (error) {
            console.error("Error fetching Token balance", publicKey, error)
            return undefined
          }
        })
      )

      return balances.filter((token): token is TokenInfo => token !== undefined)
    } catch (error) {
      console.error("Error fetching Token balance", publicKey, error)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (publicKey) {
      getTokenBalance(publicKey).then((data) => {
        if (data) {
          setTokenData(data)
        }
      })
    }
  }, [publicKey])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader />
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {tokenData.length === 0 ? (
        <div>No tokens found</div>
      ) : (
        tokenData.map((token, index) => (
          <div
            key={token.mint}
            className="flex items-center justify-between p-2 border-b border-slate-700 last:border-b-0"
          >
            <div className="flex items-center">
              {!imageError[token.mint] ? (
                <img
                  src={token.metadata.uri}
                  alt={`Token ${token.metadata.name}`}
                  width={32}
                  height={32}
                  className="mr-3"
                  onError={() =>
                    setImageError((prev) => ({ ...prev, [token.mint]: true }))
                  }
                />
              ) : (
                <div className="w-8 h-8 mr-3 bg-gray-300 flex items-center justify-center">
                  <span className="text-xs">No img</span>
                </div>
              )}
              <span className="ml-2 text-lg">{token.metadata.name}</span>
            </div>
            <div className="text-right">
              <div className="font-semibold">{token.balance}</div>
              <div className="text-sm text-tg-hint">
                {token.mint.slice(0, 8)}...
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default Tokens
