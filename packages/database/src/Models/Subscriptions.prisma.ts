import { Subscription, User } from "@prisma/client"
import logger from "../utils/logger"
import {prisma} from "../client"

export const createSubscription = async (
  subscription: Partial<Subscription>
): Promise<{
  success: boolean
  data?: Subscription
  message: string
  error?: unknown
}> => {
  try {
    const result = await prisma.subscription.create({
      data: {
        name: subscription.name!,
        description: subscription.description!,
        price: subscription.price!,
      },
    })
    if (!result) {
      return {
        success: false,
        message: "Failed to create subscription.",
      }
    }
    return {
      success: true,
      data: result,
      message: "Subscription created successfully.",
    }
  } catch (error) {
    logger.error("Failed to create subscription.", error)
    return {
      success: false,
      message: "Failed to create subscription.",
      error,
    }
  }
}

export const updateSubscription = async (
  subscription: Partial<Subscription>
): Promise<{
  success: boolean
  data?: Subscription
  message: string
  error?: unknown
}> => {
  try {
    const result = await prisma.subscription.update({
      where: {
        id: subscription.id,
      },
      data: {
        name: subscription.name,
        description: subscription.description,
        price: subscription.price,
      },
    })
    if (!result) {
      return {
        success: false,
        message: "Failed to update subscription.",
      }
    }
    return {
      success: true,
      data: result,
      message: "Subscription updated successfully.",
    }
  } catch (error) {
    logger.error("Failed to update subscription.", error)
    return {
      success: false,
      message: "Failed to update subscription.",
      error,
    }
  }
}

export const getSubscription = async (
  id: string
): Promise<{
  success: boolean
  data?: (Subscription & { users: User[] }) | null
  message: string
  error?: unknown
}> => {
  try {
    const result = await prisma.subscription.findUnique({
      where: {
        id,
      },
      include: {
        users: true,
      },
    })
    if (!result) {
      return {
        success: false,
        message: "Failed to get subscription.",
      }
    }
    return {
      success: true,
      data: result,
      message: "Subscription retrieved successfully.",
    }
  } catch (error) {
    logger.error("Failed to get subscription.", error)
    return {
      success: false,
      message: "Failed to get subscription.",
      error,
    }
  }
}

export const getAllSubscriptions = async (): Promise<{
  success: boolean
  data?: (Subscription & { users: User[] })[]
  message: string
  error?: unknown
}> => {
  try {
    const result = await prisma.subscription.findMany({
      include: {
        users: true,
      },
    })
    if (!result) {
      return {
        success: false,
        message: "Failed to get all subscriptions.",
      }
    }
    return {
      success: true,
      data: result,
      message: "Subscriptions retrieved successfully.",
    }
  } catch (error) {
    logger.error("Failed to get all subscriptions.", error)
    return {
      success: false,
      message: "Failed to get all subscriptions.",
      error,
    }
  }
}

export const getSubscriptionsForUser = async (
  chatId: bigint
): Promise<{
  success: boolean
  data?: Subscription[]
  message: string
  error?: unknown
}> => {
  try {
    const result = await prisma.subscription.findMany({
      where: {
        users: {
          some: {
            chatId,
          },
        },
      },
    })
    if (!result) {
      return {
        success: false,
        message: "Failed to get subscription for user.",
      }
    }
    return {
      success: true,
      data: result,
      message: "Subscription retrieved successfully.",
    }
  } catch (error) {
    logger.error("Failed to get subscription for user.", error)
    return {
      success: false,
      message: "Failed to get subscription for user.",
      error,
    }
  }
}

export const handleSubscribeForUser = async (chatId: bigint, queryInfo: string) => {
  try {
    //  eslint-disable-next-line @typescript-eslint/no-unused-vars

    const user = await prisma.user.findUnique({
      where: { chatId },
      select: { subscriptions: { select: { id: true } } },
    })
    if (
      user?.subscriptions.some((subscription) => subscription.id === queryInfo)
    ) {
      return {
        status: "error",
        message: "You already have a subscription",
        error: "You already have a subscription",
      }
    }
    // TODO: Check if the user has enough balance to subscribe to the subscription.
    // TODO: Do the transaction according to the subscription type and it price.
    const newSubscription = await prisma.user.update({
      where: { chatId },
      data: {
        subscriptions: {
          connect: { id: queryInfo },
        },
      },
    })
    if (!newSubscription) {
      return {
        status: "error",
        message: "Error in subscribing to the subscription",
        error: "Error in subscribing to the subscription",
      }
    }
    return {
      status: "success",
      message: "Subscribed to the subscription",
    }
  } catch (error) {
    logger.error("Failed to handle subscription for user.", error)
    return {
      success: false,
      message: "Failed to handle subscription for user.",
      error,
    }
  }
}

export const handleUnsubscribeForUser = async (chatId: bigint, queryInfo: string) => {
  try {
    //  eslint-disable-next-line @typescript-eslint/no-unused-vars
    const user = await prisma.user.findUnique({
      where: { chatId},
      select: { subscriptions: { select: { id: true } } },
    })
    if (
      !user?.subscriptions.some(
        (subscription) => subscription.id === queryInfo
      )
    ) {
      return {
        status: "error",
        message: "You don't have any subscription",
        error: "You don't have any subscription",
      }
    }
    const newSubscription = await prisma.user.update({
      where: { chatId},
      data: {
        subscriptions: {
          disconnect: { id: queryInfo },
        },
      },
    })
    if (!newSubscription) {
      return {
        status: "error",
        message: "Error in unsubscribing from the subscription",
        error: "Error in unsubscribing from the subscription",
      }
    }
    return {
      success: true,
      message: "Unsubscribed from the subscription",
    }
  } catch (error) {
    logger.error("Failed to handle unsubscribe for user.", error)
    return {
      success: false,
      message: "Failed to handle unsubscribe for user.",
      error,
    }
  }
}
