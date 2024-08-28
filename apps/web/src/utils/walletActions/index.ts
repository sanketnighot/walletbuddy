import nacl from "tweetnacl"
import { generateMnemonic, mnemonicToSeedSync } from "bip39"
import { derivePath } from "ed25519-hd-key"
import { Keypair } from "@solana/web3.js"
import bs58 from "bs58"

type Response =
  | {
      success: true
      message: string
      data: any
    }
  | {
      success: false
      message: string
      error: any
    }

const coinDerivePath = {
  bitcoin: "m/44'/0",
  ethereum: "m/44'/60",
  solana: "m/44'/501",
  tezos: "m/44'/1729",
  aptos: "m/44'/1",
} as const

type CoinType = keyof typeof coinDerivePath

export const generateMnemonicForUser = async (): Promise<Response> => {
  try {
    const mnemonic = await generateMnemonic()
    return {
      data: mnemonic,
      success: true,
      message: "Mnemonic generated successfully",
    }
  } catch (error) {
    return {
      message: "Failed to generate mnemonic",
      success: false,
      error,
    }
  }
}

export const generateSeed = async (mnemonic: string): Promise<Response> => {
  try {
    const seed = await mnemonicToSeedSync(mnemonic)
    return {
      data: seed,
      success: true,
      message: "Seed generated successfully",
    }
  } catch (error) {
    return {
      message: "Failed to generate seed",
      success: false,
      error,
    }
  }
}

export const generateKeypair = async (
  seed: Buffer,
  coin: CoinType,
  index: number
): Promise<Response> => {
  try {
    const path = `${coinDerivePath[coin]}'/${index}'/0'`
    const derivedSeed = derivePath(path, seed.toString()).key
    const keypair = nacl.sign.keyPair.fromSeed(derivedSeed)
    return {
      data: keypair,
      success: true,
      message: "Keypair generated successfully",
    }
  } catch (error) {
    return {
      message: "Failed to generate keypair",
      success: false,
      error,
    }
  }
}

export const createSolanaKeys = async (
  keyPair: nacl.SignKeyPair
): Promise<Response> => {
  try {
    const publicKey = Keypair.fromSecretKey(
      keyPair.secretKey
    ).publicKey.toBase58()
    const secretKey = await encodeSecretKey(keyPair.secretKey)
    if (!secretKey || !secretKey.success || !secretKey.data) {
      throw new Error("Failed to encode secret key")
    }
    return {
      data: {
        publicKey,
        secretKey: secretKey.data,
      },
      success: true,
      message: "Public key generated successfully",
    }
  } catch (error) {
    console.log(error)
    return {
      message: "Failed to generate public key",
      success: false,
      error,
    }
  }
}

export const encodeSecretKey = async (
  secretKey: Uint8Array
): Promise<Response> => {
  const encodedSecretKey = bs58.encode(secretKey)
  return {
    data: encodedSecretKey,
    success: true,
    message: "Secret key encoded successfully",
  }
}

export const decodeSecretKey = async (
  encodedSecretKey: string
): Promise<Response> => {
  const decodedSecretKey = bs58.decode(encodedSecretKey)
  return {
    data: decodedSecretKey,
    success: true,
    message: "Secret key decoded successfully",
  }
}
