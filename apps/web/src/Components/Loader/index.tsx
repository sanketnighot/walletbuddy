import React from "react"

const Loader: React.FC<{ size?: number }> = ({ size = 12 }) => (
  <div
    className={`w-${size} h-${size} border-4 border-tg-button rounded-full border-t-tg-bg animate-spin`}
  ></div>
)

export default Loader
