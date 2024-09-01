import { CallbackQuery, Message } from "node-telegram-bot-api"
import { ensureUser } from "@repo/database"
import onStart from "./services/TelegramBot/commands/onStart"
import onHelp from "./services/TelegramBot/commands/onHelp"
import bot from "./services/TelegramBot"
import logger from "./utils/logger"
import {
  handleSubscription,
  manageSubscriptions,
} from "./services/TelegramBot/menu/manageSubscriptions"
import sendAboutMessage from "./services/TelegramBot/menu/aboutMessage"
import SendBotResponse from "./services/TelegramBot/utils/BotResponse"
import { createAccountKeyboard } from "./services/TelegramBot/utils/keyboards"
import { manageAccount } from "./services/TelegramBot/menu/manageAccount"
import { sendAccountDashboard } from "./services/TelegramBot/menu/accountDashboard"

import { passwordGenerationState } from "./services/TelegramBot/utils/globalStates"
import { connectWallet, rejectWallet } from "./services/TelegramBot/menu/manageSessions"

try {
  bot.on("polling_error", (error) => {
    logger.error("Polling Errors", error)
  })

  bot.on("message", async (msg: Message) => {
    await ensureUser(BigInt(msg.from?.id || 0), msg.from?.username || "")
    switch (msg.text) {
      case "❇️ Manage Subscriptions":
        await manageSubscriptions(msg)
        break
      case "🔑 Create/Import Account": {

          await SendBotResponse(
            msg.chat.id,
            "Select an option from the menu below",
            {
              reply_markup: createAccountKeyboard,
            }
          )
        break
      }
      case "ℹ️ About":
        await sendAboutMessage(msg)
        break
      case "🏦 My Account":
        await sendAccountDashboard(msg)
        break
    }
  })

  bot.on("callback_query", async (query: CallbackQuery) => {
    const [query_type, query_info] = query.data!.split("/")
    switch (query_type) {
      case "subscription":
        bot.answerCallbackQuery(query.id)
        await handleSubscription(query)
        break
      case "account":
        bot.answerCallbackQuery(query.id)
        await manageAccount(query)
        break
      case "wallet_connect":{
        bot.answerCallbackQuery(query.id)
        const res= await connectWallet(query_info)
        if (res) {
          SendBotResponse(query.from.id, "Wallet Connected")
        } else {
          SendBotResponse(query.from.id, "Failed to connect wallet")
        }
        break
      }
      case "wallet_reject":{
        bot.answerCallbackQuery(query.id)
        const res = await rejectWallet(query_info)
        if (res) {
          SendBotResponse(query.from.id, "Wallet Rejected")
        } else {
          SendBotResponse(query.from.id, "Failed to reject wallet")
        }
        break
      }
    }
  })

  bot.on("web_app_data", (message: Message) => {
    const webAppData = message.web_app_data
    console.log("Received web_app_data event:", webAppData)
  })

  bot.onText(/\/start/, async (msg: Message) => {
    await onStart(msg)
  })

  bot.onText(/\/webapp/, async (msg: Message) => {
    await SendBotResponse(msg.chat.id, "Web App", {
      reply_markup: {
        keyboard: [
          [
            {
              text: "Open Webapp",
              web_app: { url: process.env.WEBAPP_URL || "" },
            },
          ],
        ],
      },
    })
  })

  bot.onText(/\/help/, async (msg: Message) => {
    await onHelp(msg)
  })
} catch (error) {
  logger.error("Error at bot.on", error)
  process.exit(1)
}
