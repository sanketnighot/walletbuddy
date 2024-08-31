import { Subscription, User } from "@prisma/client"
import logger from "../utils/logger"
import { prisma } from "../client"

type userType = (User & {
  subscriptions: Subscription[]
}) | null

export const ensureUser = async (
  chatId: bigint,
  username: string,
): Promise<{
  success: boolean
  data?: Partial<User>
  error?: unknown
  message: string
}> => {
  try {
    if (chatId === BigInt(0)) {
      return { success: false, message: "Unable to get user id" }
    }
    const user = await prisma.user.upsert({
      where: { chatId },
      update: {
        username: username || undefined,
      },
      create: {
        chatId,
        username: username || undefined,
      },
    })
    const userToLog = {
      ...user,
      chatId: Number(user.chatId),
    }
    logger.info(`User ${userToLog.chatId} created/updated`, userToLog)
    return {
      success: true,
      data: user,
      message: "User created/updated successfully",
    }
  } catch (error) {
    logger.error(`Error creating/updating user ${chatId}`, error)
    return {
      success: false,
      error: error,
      message: "Error creating/updating user",
    }
  }
}

export const getUser = async (
  chatId: bigint
): Promise<{
  success: boolean
  data?: userType
  error?: unknown
  message: string
}> => {
  try {
    if (chatId === BigInt(0)) {
      return { success: false, message: "Unable to get user id" }
    }
    const user = await prisma.user.findUnique({
      where: { chatId },
      include: {
        subscriptions: true,
      },
    })
    if (!user) {
      return { success: false, message: "User not found" }
    }
    return {
      success: true,
      data: user,
      message: "User fetched successfully",
    }
  } catch (error) {
    logger.error(`Error getting user ${chatId}`, error)
    return {
      success: false,
      error: error,
      message: "Error getting user",
    }
  }
}

export const updateUser = async (
  chatId: bigint,
  data: Partial<User>
): Promise<{
  success: boolean
  data?: User
  error?: unknown
  message: string
}> => {
  try {
    const updatedData = {
      ...data,
      walletInfo: data.walletInfo ? { set: data.walletInfo } : undefined
    };

    const user = await prisma.user.update({
      where: { chatId },
      data: updatedData,
    })
    const userToLog = {
      ...user,
      chatId: Number(user.chatId),
    }
    logger.info(`User ${userToLog.chatId} updated`, userToLog)
    return {
      success: true,
      data: user,
      message: "User updated successfully",
    }
  } catch (error: unknown) {
    logger.error(`Error updating user ${chatId}`, error)
    return { success: false, error: error, message: "Error updating user" }
  }
}

export const deleteUser = async (
  chatId: bigint
): Promise<{
  success: boolean
  data?: Partial<User>
  error?: unknown
  message: string
}> => {
  try {
    const userData = await prisma.user.findUnique({
      where: { chatId },
    })
    if (!userData) {
      return { success: false, message: "User not found" }
    }
    const user = await prisma.user.delete({
      where: { chatId },
    })
    const userToLog = {
      ...user,
      chatId: Number(user.chatId),
    }
    logger.info(`User ${userToLog.chatId} deleted`)
    return {
      success: true,
      data: user,
      message: "User deleted successfully",
    }
  } catch (error) {
    logger.error(`Error deleting user ${chatId}`, error)
    return {
      success: false,
      error: error,
      message: "Error deleting user",
    }
  }
}
