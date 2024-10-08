import { CallbackQuery } from "node-telegram-bot-api"
import logger from "../../../utils/logger"
import SendBotResponse from "../utils/BotResponse"
import bot from ".."

export const manageAccount = async (query: CallbackQuery) => {
  try {
    //  eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, query_action, query_info, query_status] = query.data!.split("/")
    const chatId = query.message?.chat.id || 0
    if (!chatId || chatId === 0) {
      return
    }
    switch (query_info) {
      case "seed":
        if (query_action === "create") {
          // await createAccountUsingSeedPhrase()
          await SendBotResponse(
            query.message?.chat.id,
            "This feature is not available yet"
          )
        } else if (query_action === "import") {
          // await importAccountUsingSeedPhrase()
          await SendBotResponse(
            query.message?.chat.id,
            "This feature is not available yet"
          )
        }
        break
      // case "keypair":
      //   if (query_status === "c") {
      //     if (query_action === "create") {
      //       const createAccountResponse = await createAccountUsingKeypair(
      //         BigInt(chatId || 0),
      //         "password"
      //       )
      //       if (!createAccountResponse.success) {
      //         await SendBotResponse(
      //           chatId,
      //           "Error Creating Account Using Keypair"
      //         )
      //         return
      //       }
      //       let message = createAccountResponse.message
      //       message += `\n\nYour Public Key: <code>${createAccountResponse.data?.publicKey}</code>`
      //       await bot.deleteMessage(chatId || 0, query.message?.message_id || 0)
      //       await SendBotResponse(chatId, message, {
      //         reply_markup: mainMenuWithWallets,
      //       })
      //     } else if (query_action === "import") {
      //       await importAccountUsingKeypair()
      //       await SendBotResponse(chatId, "Importing Account Using Keypair")
      //     }
      //   } else if (query_status === "nc") {
      //     if (query_action === "create") {
      //       const inline_keyboard = [
      //         [
      //           {
      //             text: "✅ Confirm Transaction",
      //             callback_data: "account/create/keypair/c",
      //           },
      //         ],
      //       ]
      //       await SendBotResponse(chatId, "Creating Account Using Keypair", {
      //         reply_markup: {
      //           inline_keyboard,
      //         },
      //       })
      //     } else if (query_action === "import") {
      //       const inline_keyboard = [
      //         [
      //           {
      //             text: "✅ Confirm Transaction",
      //             callback_data: "account/import/keypair/c",
      //           },
      //         ],
      //       ]
      //       await SendBotResponse(chatId, "Importing Account Using Keypair", {
      //         reply_markup: {
      //           inline_keyboard,
      //         },
      //       })
      //     }
      //   }
        break
    }
  } catch (error) {
    logger.error("Error in manageAccount", error)
  }
}
