import React, { useState, useEffect } from "react"

// Define the Subscription type
type Subscription = {
  id: string
  name: string
  description: string
  price: number
  subscriberCount: number
}

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [userSubscriptions, setUserSubscriptions] = useState<string[]>([])

  useEffect(() => {
    // Fetch subscriptions and user's subscriptions from API
    fetchSubscriptions()
    fetchUserSubscriptions()
  }, [])

  const fetchSubscriptions = async () => {
    // TODO: Replace with actual API call
    const mockSubscriptions: Subscription[] = [
      {
        id: "1",
        name: "Basic",
        description: "Basic plan",
        price: 9.99,
        subscriberCount: 1000,
      },
      {
        id: "2",
        name: "Pro",
        description: "Pro plan",
        price: 19.99,
        subscriberCount: 500,
      },
      // Add more mock subscriptions as needed
    ]
    setSubscriptions(mockSubscriptions)
  }

  const fetchUserSubscriptions = async () => {
    // TODO: Replace with actual API call
    const mockUserSubscriptions = ["1"] // Assuming user is subscribed to Basic plan
    setUserSubscriptions(mockUserSubscriptions)
  }

  const handleSubscribe = (subscriptionId: string) => {
    // TODO: Implement subscribe logic
    console.log(`Subscribing to ${subscriptionId}`)
  }

  const handleUnsubscribe = (subscriptionId: string) => {
    // TODO: Implement unsubscribe logic
    console.log(`Unsubscribing from ${subscriptionId}`)
  }

  // Sort subscriptions: user's subscriptions first, then remaining
  const sortedSubscriptions = [
    ...subscriptions.filter((sub) => userSubscriptions.includes(sub.id)),
    ...subscriptions.filter((sub) => !userSubscriptions.includes(sub.id)),
  ]

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
                <h3 className="text-xl font-semibold text-gray-800">
                  {subscription.name}
                </h3>
                <p className="text-gray-600 mt-1 mb-3">
                  {subscription.description}
                </p>
                <p className="text-sm text-gray-500">
                  Subscribers: {subscription.subscriberCount}
                </p>
                <p className="font-bold text-gray-700 mt-2">
                  ${subscription.price.toFixed(2)}
                </p>
              </div>
              <div className="top-4 right-4">
                {userSubscriptions.includes(subscription.id) ? (
                  <button
                    onClick={() => handleUnsubscribe(subscription.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-300"
                  >
                    Unsubscribe
                  </button>
                ) : (
                  <button
                    onClick={() => handleSubscribe(subscription.id)}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-300"
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
