import React from "react"
import Image from "next/image"

const tokenData = [
  { name: "Solana", amount: "123.45" },
  { name: "USDC", amount: "100.00" },
  { name: "Raydium", amount: "500.75" },
  { name: "Serum", amount: "250.50" },
  { name: "USDC", amount: "100.00" },
  { name: "Raydium", amount: "500.75" },
  { name: "Serum", amount: "250.50" },
  { name: "USDC", amount: "100.00" },
  { name: "Raydium", amount: "500.75" },
  { name: "Serum", amount: "250.50" },
  { name: "USDC", amount: "100.00" },
  { name: "Raydium", amount: "500.75" },
  { name: "Serum", amount: "250.50" },
]

const Tokens = () => {
  return (
    <div className="space-y-3">
      {tokenData.map((token, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-2 border-b border-slate-700 last:border-b-0"
        >
          <div className="flex items-center">
            <Image
              src="/solana.png"
              alt={token.name}
              width={32}
              height={32}
              className="mr-3"
            />
            <span className="ml-2 text-lg">{token.name}</span>
          </div>
          <div className="text-right">
            <div className="font-semibold">{token.amount}</div>
            <div className="text-sm text-tg-hint">{token.name}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Tokens
