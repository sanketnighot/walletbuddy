import axios from "axios"
import React, { useState, useEffect } from "react"
import Loader from "../Loader"

// Update the Subscription type
type Subscription = {
  isSubscribed: boolean
  id: string
  name: string
  description: string
  price: number
  validity: number
  createdAt: Date
  updatedAt: Date
}

const Subscriptions = ({ userId }: { userId: any }) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Fetch subscriptions from API
    fetchSubscriptions()
  }, [userId])

  const fetchSubscriptions = async () => {
    setIsLoading(true)
    if (userId) {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_WEBHOOK_URL}/api/v1/wallet/getSubscriptions?chatId=${userId}`
        )
        setSubscriptions(response.data)
      } catch (error) {
        console.error("Error fetching subscriptions:", error)
      } finally {
        setIsLoading(false)
      }
    } else {
      setIsLoading(false)
    }
  }

  const handleSubscribe = async (subscriptionId: string) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_WEBHOOK_URL}/api/v1/wallet/subscribe`,
        {
          chatId: userId,
          subscriptionId: subscriptionId,
        }
      )
      fetchSubscriptions()
    } catch (error) {
      console.error("Error subscribing to subscription:", error)
    }
  }

  const handleUnsubscribe = async (subscriptionId: string) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_WEBHOOK_URL}/api/v1/wallet/unsubscribe`,
        {
          chatId: userId,
          subscriptionId: subscriptionId,
        }
      )
      fetchSubscriptions()
    } catch (error) {
      console.error("Error unsubscribing from subscription:", error)
    }
  }

  // Sort subscriptions: user's subscriptions first, then remaining
  const sortedSubscriptions = [
    ...subscriptions.filter((sub) => sub.isSubscribed),
    ...subscriptions.filter((sub) => !sub.isSubscribed),
  ]

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />
      </div>
    )
  }

  return (
    <div>
      <ul className="list-none p-0">
        {sortedSubscriptions.map((subscription) => (
          <li
            key={subscription.id}
            className="mb-6 border border-gray-300 rounded-lg shadow-md p-4 relative"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold text-tg-text">
                  {subscription.name
                    .split("_")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </h3>
                <p className="text-tg-hint mt-1 mb-3">
                  {subscription.description}
                </p>
                <p className="text-sm text-tg-text">
                  Validity: {subscription.validity} days
                </p>
                <p className="font-bold text-tg-link mt-2">
                  ${subscription.price.toFixed(2)}
                </p>
              </div>
              <div className="top-4 right-4">
                {subscription.isSubscribed ? (
                  <button
                    onClick={() => handleUnsubscribe(subscription.id)}
                    className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-300"
                  >
                    Unsubscribe
                  </button>
                ) : (
                  <button
                    onClick={() => handleSubscribe(subscription.id)}
                    className="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-300"
                  >
                    Subscribe
                  </button>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Subscriptions
