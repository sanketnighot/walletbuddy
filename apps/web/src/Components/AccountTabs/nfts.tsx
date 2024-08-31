import React, { useEffect, useState } from "react"
import Image from "next/image"
import { Metadata } from "@metaplex-foundation/mpl-token-metadata"
import { Connection, PublicKey } from "@solana/web3.js"
import { TOKEN_PROGRAM_ID } from "@solana/spl-token"
import { programs } from "@metaplex/js"
import Loader from "../Loader"

type TokenInfo = {
  mint: string
  balance: string
  decimals: number
  metadata: Metadata
}

const Nfts = ({ publicKey }: { publicKey: string }) => {
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
  // Mock data for NFTs (replace with actual data later)
  const nfts = Array(9).fill(null)

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {tokenData.length === 0 ? (
        <div>No NFTs found</div>
      ) : (
        tokenData.map((token, index) => (
          <div
            key={index}
            className="flex flex-col items-center bg-tg-secondary-bg rounded-lg p-2"
          >
            <img
              src={token.metadata.uri}
              alt={token.mint.slice(0, 10)}
              width={150}
              height={150}
              className="rounded-lg"
            />
            <p className="mt-2 text-sm truncate">
              {token.metadata.name.slice(0, 7)}...
            </p>
          </div>
        ))
      )}
    </div>
  )
}

export default Nfts
