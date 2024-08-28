import { prisma, WalletSessionType } from "@repo/database"
import SendBotResponse from "../utils/BotResponse"

export const sendWalletConnectionRequest = async (walletSessionId: string) => {
  const walletSession = await prisma.walletSession.findFirst({
    where: {
      id: walletSessionId,
    },
    include: {
      user: true
    }
  })
  if (!walletSession) {
    return false
  }
  const { user, type, dapp } = walletSession
  const message = `Do you want to ${type === WalletSessionType.CONNECTION_REQUEST ? 'connect' : 'sign'} the following dapp: ${dapp}`
  await SendBotResponse(Number(user.chatId), message, {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Connect', web_app: { url: `https://webapp.therapix.in/wallet-session/${walletSessionId}` } }],
        [{ text: 'Reject', callback_data: `reject_${type}_${walletSessionId}` }],
      ],
    },
  })
  return true
}