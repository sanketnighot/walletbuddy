import { Message } from "node-telegram-bot-api"
import SendBotResponse from "../utils/BotResponse"
import { getUser } from "@repo/database"
import logger from "../../../utils/logger"
import { getAccountDashboardMessage } from "../utils/messages"
import { getBalance } from "../../Solana/wallets"

export const sendAccountDashboard = async (msg: Message) => {
  try {
    const chatId = BigInt(msg.chat.id)
    const user = await getUser(chatId)
    if (!user) {
      await SendBotResponse(Number(chatId), "You are not registered")
      return
    }
    let dashboardMessage = await getAccountDashboardMessage(
      user.data?.username || "User"
    )
    const defaultSolWallet = (user.data?.walletInfo as { defaultWallet?: any })?.defaultWallet

    const defaultSolWalletBalance = await getBalance(
      defaultSolWallet
    )
    if ((defaultSolWallet?.length ?? 0) > 0) {
      dashboardMessage += `💳 <b><u>Default Wallet</u></b>: <code>${defaultSolWallet}</code>\n`
      dashboardMessage += `💰 <b><u>Balance</u></b>: ${defaultSolWalletBalance} SOL`
    }
    const inlineKeyboard = [
      [
        {
          text: "🔗 Open Solscan",
          web_app: {
            url: `https://solscan.io/account/${defaultSolWallet[0].publicKey}`,
          },
        },
        {
          text: "⚙️ Manage Wallets",
          callback_data: "dashboard/changeDefaultWallet",
        },
      ],
      [
        {
          text: "↗️ Export Private Key",
          callback_data: "dashboard/exportPrivateKey",
        },
      ],
    ]

    await SendBotResponse(Number(chatId), dashboardMessage, {
      reply_markup: { inline_keyboard: inlineKeyboard },
    })
  } catch (error) {
    logger.error("Error sending account dashboard", error)
    await SendBotResponse(msg.chat.id, "Something went wrong")
  }
}
