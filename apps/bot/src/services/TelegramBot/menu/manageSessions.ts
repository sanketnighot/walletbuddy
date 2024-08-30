import {prisma} from "@repo/database"


export const connectWallet = async (sessionId: string) => {
  try {
    const walletSession = await prisma.walletSession.update({
      where: { id: sessionId },
      data: {
        status: "ACCEPTED",
      },
    })
    if (!walletSession) {
      return false
    }
    return true
  } catch (error) {
    return false
  }
}

export const rejectWallet = async (sessionId: string) => {
  try {
    const walletSession = await prisma.walletSession.update({
      where: { id: sessionId },
      data: {
        status: "REJECTED",
      },
    })
    if (!walletSession) {
      return false
    }
    return true
  } catch (error) {
    return false
  }
}