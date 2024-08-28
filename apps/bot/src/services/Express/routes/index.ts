import Router from "express"
import { testBot } from "../controllers/bot.controller"
import { createWallet, getUserSubscriptions, getWallet, subscribeToSubscription, unsubscribeToSubscription } from "../controllers/wallet.controller"

const router = Router()

router.route("/test").get(testBot)

router.route("/wallet/create").post(createWallet)
router.route("/wallet/get").get(getWallet)
router.route("/wallet/getSubscriptions").get(getUserSubscriptions)
router.route("/wallet/subscribe").post(subscribeToSubscription)
router.route("/wallet/unsubscribe").post(unsubscribeToSubscription)

export default router
