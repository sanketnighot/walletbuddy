import { prisma } from "@repo/database"
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
  const { user, dapp } = walletSession
  if (!user) {
    return false
  }
  const message = `Do you want to connect to the following dapp: ${dapp}`
  await SendBotResponse(Number(user.chatId), message, {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Connect', web_app: { url: `${process.env.WEBAPP_URL}/wallet-session/${walletSessionId}` } }],
        [{ text: 'Reject', callback_data: `reject_connect_${walletSessionId}` }],
      ],
    },
  })
  return true
}