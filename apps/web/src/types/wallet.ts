export type walletInfo = {
  encDerSeed: string
  wallets: Wallet[]
}

export type Wallet = {
  name: string
  publicKey: string
  encPrivateKey: string
  network: string
}

export type Network = {
  name: string
  rpc: string
  chainId: string
  explorer: string
  currency: string
  decimals: number
}
