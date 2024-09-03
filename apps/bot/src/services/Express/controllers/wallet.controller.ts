import { Request, Response } from "express"
import { prisma } from "@repo/database"
import SendBotResponse from "../../TelegramBot/utils/BotResponse"
import { Transaction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js"

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

export const acceptWalletSession = async (req: Request, res: Response) => {
  try {
    const { sessionId, chatId } = req.body
    const walletSession = await prisma.walletSession.update({
      where: { id: sessionId },
      data: {
        status: "ACCEPTED",
        user: {
          connect: {
            chatId: chatId,
          }
        }
      }, 
      include: {
        user: true
      }
    })
    if (!walletSession) {
      return res.status(404).json({ error: 'Wallet session not found' })
    }

    interface Dapp {
      name: string;
      description?: string;
      url: string;
    }

    const dapp = walletSession.dapp as unknown as Dapp;

    let message = ""
    if (walletSession) {
      message += `Wallet connected to <b><u>${dapp?.name ?? "this dapp"}</u></b>\n\n`
      message += `<i>${dapp?.description ?? ""}</i>\n`
      message += `${dapp?.url ?? ""}`
    }
    console.log("walletSession", walletSession)
    await SendBotResponse(Number(walletSession.user?.chatId), message)
    return res.status(200).json({ status: "success", message: "Wallet connected" })
  } catch (error: any) {
    res.status(500).json({ status: "failed", error: error.message })
  }
}

export const rejectWalletSession = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.body
    const walletSession = await prisma.walletSession.update({
      where: { id: sessionId },
      data: {
        status: "REJECTED",
      },
    })
    if (!walletSession) {
      return res.status(404).json({ error: 'Wallet session not found' })
    }
    return res.status(200).json({ status: "success", message: "Wallet rejected" })
  } catch (error: any) {
    res.status(500).json({ status: "failed", error: error.message })
  }
}

export const signTransaction = async (req: Request, res: Response) => {
  try {
    const { transaction, sessionId } = req.body;
    console.log('Received base64 encoded transaction:', transaction);

    // Validate sessionId and transaction
    if (!sessionId || typeof sessionId !== 'string' || !transaction || typeof transaction !== 'string') {
      return res.status(400).json({ error: 'Invalid or missing sessionId or transaction' });
    }

    // Deserialize the transaction
    let deserializedTransaction;
    try {
      const transactionBuffer = Buffer.from(transaction, 'base64');
      deserializedTransaction = Transaction.from(transactionBuffer);
    } catch (error) {
      console.error('Error deserializing transaction:', error);
      return res.status(400).json({ error: 'Invalid transaction format' });
    }

    // Get the wallet session and associated user
    const walletSession = await prisma.walletSession.findUnique({
      where: { id: sessionId },
      include: { user: true },
    });

    if (!walletSession || !walletSession.user) {
      return res.status(404).json({ error: 'Wallet session or user not found' });
    }

    // Find the transfer instruction
    const transferInstruction = deserializedTransaction.instructions.find(
      (ix) => ix.programId.equals(SystemProgram.programId)
    );

    if (!transferInstruction) {
      return res.status(400).json({ error: 'No transfer instruction found in transaction' });
    }

    // Extract amount and recipient from the transfer instruction
    const amountInLamports = transferInstruction.data.readBigUInt64LE(4);
    const amountInSOL = Number(amountInLamports) / LAMPORTS_PER_SOL;
    const formattedAmount = amountInSOL.toFixed(4);
    const recipient = transferInstruction.keys[1].pubkey.toBase58();

    // Prepare transaction details for the message
    const transactionDetails = deserializedTransaction.instructions.map((instruction, index) => {
      return `Instruction ${index + 1}:
        Program: ${instruction.programId.toBase58()}
        Accounts: ${instruction.keys.map(key => key.pubkey.toBase58()).join(', ')}
      `;
    }).join('\n');

    const message = `
You have a new transaction to sign:

${transactionDetails}

Amount: ${formattedAmount} SOL
Recipient: ${recipient}

Do you want to sign this transaction?
    `;

    // Store the transaction in the database
    const walletTransaction = await prisma.walletTransaction.create({
      data: {
        sessionId: sessionId,
        txn: {
          base64: transaction,
          amount: amountInSOL.toString(),
          recipient: recipient,
        },
        status: 'PENDING',
      },
    });

    // Send the message to the user
    await SendBotResponse(Number(walletSession.user.chatId), message, {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "✅ Accept", web_app: { url: `${process.env.WEBAPP_URL}/sign?transactionId=${walletTransaction.id}`} },
            { text: "❌ Reject", callback_data: `sign_transaction_reject/${walletTransaction.id}` }
          ],
        ],
      },
    });

    res.status(200).json({ status: "success", message: "Transaction sent for user approval", transactionId: walletTransaction.id });
  } catch (error: any) {
    console.error('Error in signTransaction:', error);
    res.status(500).json({ error: error.message });
  }
}


export const getWalletSession = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.query
    console.log("sessionId", sessionId)
    if (!sessionId || typeof sessionId !== 'string') {
      return res.status(400).json({ error: 'Invalid or missing sessionId' })
    }

    const walletSession = await prisma.walletSession.findUnique({
      where: {
        id: sessionId,
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

    if (!walletSession) {
      return res.status(404).json({ error: 'Wallet session not found' })
    }

    const response = {
      id: walletSession.id,
      status: walletSession.status,
      dapp: walletSession.dapp,
      user: walletSession.status === 'ACCEPTED' ? {
        walletInfo: walletSession.user?.walletInfo.map((wallet: any) => ({
          publicKey: wallet.publicKey,
        }))
      } : undefined,
    }

    return res.status(200).json(response)
  } catch (error: any) {
    console.error('Error in getWalletSession:', error)
    res.status(500).json({ error: 'Internal server error' })
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

export const getTransaction = async (req: Request, res: Response) => {
  try {
    const { transactionId } = req.params;

    if (!transactionId) {
      return res.status(400).json({ error: 'Missing transaction ID' });
    }

    const transaction = await prisma.walletTransaction.findUnique({
      where: { id: transactionId },
      include: {
        session: {
          include: {
            user: {
              select: {
                walletInfo: true,
              },
            },
          },
        },
      },
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    // Extract relevant information
    const response = { transaction};

    res.status(200).json(response);
  } catch (error: any) {
    console.error('Error in getTransaction:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
