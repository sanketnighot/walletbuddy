import { Request, Response } from "express"
import { prisma, User, WalletSessionStatus } from "@repo/database"

export const createWalletSession = async (req: Request, res: Response) => {
  try {
    const { userId, userName, type, dapp } = req.body
    if (!userId || !userName || !type || !dapp) {
      return res.status(400).json({ error: 'Missing required fields' })
    }
    let userInfo: User | null = null
    if (userName) {
      userInfo = await prisma.user.findFirst({
        where: {
          username: userName,
        },
      })
    }
    if (userId) {
      userInfo = await prisma.user.findFirst({
        where: {
          id: userId,
        },
      })
    }
    if (!userInfo) {
      return res.status(404).json({ error: 'User not found' })
    }

    const walletSession = await prisma.walletSession.create({
      data: {
        user: {
          connect: {
            id: userInfo.id,
          },
        },
        type,
        dapp,
        status: WalletSessionStatus.PENDING,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    })

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
    })
    return res.status(200).json({ walletSession })
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
