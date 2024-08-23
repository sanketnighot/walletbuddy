import React from "react"

interface Transaction {
  id: string
  from: string
  to: string
  amount: string
  timestamp: number
}

const dummyTransactions: Transaction[] = [
  {
    id: "1",
    from: "0x123...",
    to: "0x456...",
    amount: "0.5 SOL",
    timestamp: 1647234567000,
  },
  {
    id: "2",
    from: "0x789...",
    to: "0xabc...",
    amount: "1.2 SOL",
    timestamp: 1647320967000,
  },
  {
    id: "3",
    from: "0xdef...",
    to: "0x123...",
    amount: "0.3 SOL",
    timestamp: 1647407367000,
  },
]

const Activity: React.FC = () => {
  return (
    <div className="p-4 bg-tg-section-bg">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {dummyTransactions.map((tx) => (
          <div
            key={tx.id}
            className=" bg-tg-secondary-bg rounded-lg shadow-md p-4"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">
                {new Date(tx.timestamp).toLocaleString()}
              </span>
              <span className="text-lg font-semibold text-green-600">
                {tx.amount}
              </span>
            </div>
            <div className="mb-2">
              <p className="text-sm text-gray-600">From:</p>
              <p className="font-mono text-sm truncate">{tx.from}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">To:</p>
              <p className="font-mono text-sm truncate">{tx.to}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Activity
