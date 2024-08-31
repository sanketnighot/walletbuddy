import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Wallet Buddy Bot Web App",
  description: "Telegram bot for Web3 wallets",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <script src="https://telegram.org/js/telegram-web-app.js" />
      </head>
      <body>{children}</body>
    </html>
  )
}
