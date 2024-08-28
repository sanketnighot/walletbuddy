import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import { TOKEN_PROGRAM_ID } from "@solana/spl-token"

export const getSolanaBalance = async (address: string): Promise<number> => {
  try {
    const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || ""
    const connection = new Connection(rpcUrl, "confirmed")
    const publicKeyObj = new PublicKey(address)
    const balance = await connection.getBalance(publicKeyObj)
    return balance / LAMPORTS_PER_SOL
  } catch (error) {
    console.error("Get balance error:", error)
    throw error
  }
}

export async function getTokenBalance(address: string) {
  try {
    const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || ""
    const connection = new Connection(rpcUrl, "confirmed")
    const pubKey = new PublicKey(address)
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
      pubKey,
      {
        programId: TOKEN_PROGRAM_ID,
      }
    )

    const balances = tokenAccounts.value
      .map((accountInfo) => {
        const parsedInfo = accountInfo.account.data.parsed.info
        return {
          mint: parsedInfo.mint,
          balance: parsedInfo.tokenAmount.uiAmount.toFixed(4),
          decimals: parsedInfo.tokenAmount.decimals,
        }
      })
      .filter((token) => token.balance > 0)

    return { totalTokens: balances.length, balances }
  } catch (error) {
    console.log("Error fetcing Token balance", address, error)
    return null
  }
}

export async function requestAirdrop(
  address: string,
  amount: number = 5
): Promise<{ success: boolean; signature?: string }> {
  try {
    const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || ""
    const connection = new Connection(rpcUrl, "confirmed")
    const publicKeyObj = new PublicKey(address)

    const signature = await connection.requestAirdrop(
      publicKeyObj,
      amount * LAMPORTS_PER_SOL
    )
    await connection.confirmTransaction(signature)

    return { success: true, signature }
  } catch (error) {
    console.error("Airdrop error:", error)
    return { success: false }
  }
}
