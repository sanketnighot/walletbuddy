import Router from "express"
import { testBot } from "../controllers/bot.controller"
import { createWallet, createWalletSession, getUserSubscriptions, getWallet, getWalletSession, subscribeToSubscription, unsubscribeToSubscription, updateWalletSession } from "../controllers/wallet.controller"

const router = Router()

// Test route
router.route("/test").get(testBot)

// Wallet routes
router.route("/wallet/create").post(createWallet)
router.route("/wallet/get").get(getWallet)
router.route("/wallet/getSubscriptions").get(getUserSubscriptions)
router.route("/wallet/subscribe").post(subscribeToSubscription)
router.route("/wallet/unsubscribe").post(unsubscribeToSubscription)

// Wallet Session routes
router.route("/session/create").post(createWalletSession)
router.route("/session/update").post(updateWalletSession)
router.route("/session").get(getWalletSession)

export default router
