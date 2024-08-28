import {
  ReplyKeyboardMarkup,
  InlineKeyboardMarkup,
} from "node-telegram-bot-api"

export const mainMenuWithoutWallets: ReplyKeyboardMarkup = {
  keyboard: [
    [{ text: "🔑 Create/Import Account" }, { text: "❇️ Manage Subscriptions" }],
    [{ text: "ℹ️ About" }],
  ],
  resize_keyboard: true,
  is_persistent: true,
  input_field_placeholder: "Select option from below",
}

export const mainMenuWithWallets: ReplyKeyboardMarkup = {
  keyboard: [
    [{ text: "🏦 My Account" }, { text: "🔑 Create/Import Account" }],
    [{ text: "❇️ Manage Subscriptions" }, { text: "💰 Airdrop (Devnet)" }],
    [{ text: "🎮 Play Mini Games" }, { text: "🖼️ NFT Gallery" }],
    [{ text: "⚙️ Settings" }, { text: "ℹ️ About" }],
  ],
  resize_keyboard: true,
  is_persistent: true,
  input_field_placeholder: "Select option from below",
}

export const createAccountKeyboard: InlineKeyboardMarkup = {
  inline_keyboard: [
    [
      {
        text: "🔑 Create/Import Account",
        web_app: {
          url: "https://webapp.therapix.in",
        },
      },
    ],
  ],
}
