import { Message } from "node-telegram-bot-api"
import SendBotResponse from "../utils/BotResponse"
import { getUser } from "@repo/database"
import logger from "../../../utils/logger"
import { getAccountDashboardMessage } from "../utils/messages"
import { getBalance } from "../../Solana/wallets"

export const sendAccountDashboard = async (msg: Message) => {
  try {
    console.log("Sending account dashboard")
    const chatId = BigInt(msg.chat.id)
    const user = await getUser(chatId)
    if (!user) {
      await SendBotResponse(Number(chatId), "You are not registered")
      return
    }
    let dashboardMessage = await getAccountDashboardMessage(
      user.data?.username || "User"
    )
    // const defaultSolWallet = (user.data?.walletInfo as { defaultWallet?: any })?.defaultWallet

    // const defaultSolWalletBalance = await getBalance(
    //   defaultSolWallet
    // )
    // if ((defaultSolWallet?.length ?? 0) > 0) {
    //   dashboardMessage += `💳 <b><u>Default Wallet</u></b>: <code>${defaultSolWallet}</code>\n`
    //   dashboardMessage += `💰 <b><u>Balance</u></b>: ${defaultSolWalletBalance} SOL`
    // }
    const inlineKeyboard = [
      [
        {
          text: "💳 Open Wallet",
          web_app: {
            url: `${process.env.WEBAPP_URL}/accounts?tab=tokens`,
          },
        },
        {
          text: "📱 Scan QR",
          web_app: {
            url: `${process.env.WEBAPP_URL}/scan`,
          },
        },
      ],
      [
        {
          text: "⚙️ Manage Wallets",
          callback_data: "dashboard/changeDefaultWallet",
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
