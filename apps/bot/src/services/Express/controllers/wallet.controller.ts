import { Request, Response } from "express"
import { prisma, User, WalletSessionStatus } from "@repo/database"
import SendBotResponse from "../../TelegramBot/utils/BotResponse"

export const createWalletSession = async (req: Request, res: Response) => {
  try {
    const { dapp }: { dapp: {name: string, description?: string, url: string} } = req.body
    if (!dapp) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const walletSession = await prisma.walletSession.create({
      data: {
        dapp: dapp,
        status: "PENDING",
      },
    })

    return res.status(200).json({ walletSession })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const updateWalletSession = async (req: Request, res: Response) => {
  try {
    const { sessionId, username }: { sessionId: string, username: string} = req.body
    const user = await prisma.user.findFirst({
      where: {
        username,
      }
    })
    if (!user || !user.username) {
      return res.status(400).json({ error: 'User not found' })
    }
    const existingSession = await prisma.walletSession.findUnique({
      where: { id: sessionId },
    });

    if (!existingSession) {
      return res.status(404).json({ error: 'Invalid session' });
    }
    interface Dapp {
      name?: string;
      description?: string;
      url?: string;
    }
    // Ensure existingSession.dapp is typed as Dapp
    const dapp = existingSession.dapp as Dapp;
    let message = ""
    if (dapp) {
      message += `Would you like to connect your wallet to <b><u>${dapp?.name ?? "this dapp"}</u></b>?\n\n`
      message += `<i>${dapp?.description ?? ""}</i>\n`
      message += `${dapp?.url ?? ""}`
    }
    await SendBotResponse(Number(user.chatId), message, {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "✅ Connect", callback_data: `wallet_connect/${sessionId}` },
            { text: "❌ Reject", callback_data: `wallet_reject/${sessionId}` }
          ],
        ],
      },
    })
    const walletSession = await prisma.walletSession.update({
      where: { id: sessionId },
      data: {
        user: {
          connect: {
            id: user.id,
          }
        }
      },
    });
    return res.status(200).json({ walletSession })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const getWalletSession = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const walletSession = await prisma.walletSession.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        status: true,
        dapp: true,
        user: {
          select: {
            walletInfo: true,
          }
        },
      },    
    })

    return res.status(200).json({
      walletSession: {
        ...walletSession,
        user: {
          ...walletSession?.user,
          walletInfo: walletSession?.status === 'ACCEPTED'
            ? walletSession?.user?.walletInfo.map((wallet: any) => ({
                publicKey: wallet.publicKey,
              }))
            : undefined,
        },
      }
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}


export const createWallet = async (req: Request, res: Response) => {
  try {
    const walletInfo  = req.body
    let userWallet = await prisma.user.update({
      where: {
        chatId: BigInt(walletInfo.userId),
      },
      data: {
        walletInfo: {
          push: walletInfo.wallet,
        },
      },
    })
    if (walletInfo.encDerSeed) {
      userWallet = await prisma.user.update({
        where: {
          chatId: BigInt(walletInfo.userId),
        },
        data: {
          encSeed: walletInfo.encDerSeed,
        },
      })
    }
    return res.status(200).json(JSON.parse(JSON.stringify(userWallet, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    )));
  } catch (error: any) {
    console.log(error)
    res.status(500).json({ error: error.message })
  }
}

export const getWallet = async (req: Request, res: Response) => {
  try {
    const { chatId } = req.query
    if (!chatId) {
      return res.status(400).json({ error: 'Missing required fields' })
    }
    const wallets = await prisma.user.findFirst({
      where: {
        chatId: BigInt(chatId as string),
      }
    })
    return res.status(200).json(JSON.parse(JSON.stringify(wallets, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    )));
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const getUserSubscriptions = async (req: Request, res: Response) => {
  try {
    const { chatId } = req.query
    console.log("chatId", req.query)
    if (!chatId) {
      return res.status(400).json({ error: 'Missing required fields' })
    }
    const allSubscriptions = await prisma.subscription.findMany()
    const userSubscriptions = await prisma.user.findUnique({
      where: { chatId: BigInt(chatId as string) },
      select: { subscriptions: { select: { id: true } } },
    })

    const userSubscriptionIds = new Set(
      userSubscriptions?.subscriptions.map((a: { id: string }) => a.id) || []
    )

    const userSubscriptionsWithStatus = allSubscriptions.map(
      (subscription) => ({
        ...subscription,
        isSubscribed: userSubscriptionIds.has(subscription.id),
      })
    )
    return res.status(200).json(userSubscriptionsWithStatus)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const subscribeToSubscription = async (req: Request, res: Response) => {
  try {
    const { chatId, subscriptionId } = req.body
    if (!chatId || !subscriptionId) {
      return res.status(400).json({ error: 'Missing required fields' })
    }
    const user = await prisma.user.update({
      where: { chatId: BigInt(chatId as string) },
      data: {
        subscriptions: {
          connect: { id: subscriptionId },
        },
      },
    })
    return res.status(200).json(JSON.parse(JSON.stringify(user, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    )));
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const unsubscribeToSubscription = async (req: Request, res: Response) => {
  try {
    const { chatId, subscriptionId } = req.body
    if (!chatId || !subscriptionId) {
      return res.status(400).json({ error: 'Missing required fields' })
    }
    const user = await prisma.user.update({
      where: { chatId: BigInt(chatId as string) },
      data: {
        subscriptions: {
          disconnect: { id: subscriptionId },
        },
      },
    })
    return res.status(200).json(JSON.parse(JSON.stringify(user, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    )));
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
