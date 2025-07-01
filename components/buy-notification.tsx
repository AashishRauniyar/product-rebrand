"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingBag, X } from "lucide-react"

import type { Product } from "@/lib/models/product";

interface BuyNotificationProps {
  product: Product;
}

export default function BuyNotification({ product }: BuyNotificationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [notification, setNotification] = useState({
    name: "",
    location: "",
    quantity: 0,
  })

  const names = [
    "Shlomo Hoyt",
    "Vincent Dickens",
    "Elvin Godinez",
    "Rayshawn Kemp",
    "Javonte Stafford",
    "Marshall Doughty",
    "Demarcus Showalter",
    "Dale Deleon",
    "River Beers",
    "Joaquin Winn",
    "Jeremy Fountain",
    "Rasheed Welsh",
    "Treyton Wolf",
    "Allen Emerson",
    "Adolfo Mitchell",
    "Efrain Bustamante",
    "Gilbert Maher",
    "Carter Araujo",
    "George Burch",
    "Charles Pierce",
  ]

  const cities = [
    { city: "New York", state: "NY" },
    { city: "Los Angeles", state: "CA" },
    { city: "Chicago", state: "IL" },
    { city: "Houston", state: "TX" },
    { city: "Phoenix", state: "AZ" },
    { city: "Philadelphia", state: "PA" },
    { city: "San Antonio", state: "TX" },
    { city: "San Diego", state: "CA" },
    { city: "Dallas", state: "TX" },
    { city: "San Jose", state: "CA" },
    { city: "Austin", state: "TX" },
    { city: "Jacksonville", state: "FL" },
    { city: "Fort Worth", state: "TX" },
    { city: "Columbus", state: "OH" },
    { city: "Charlotte", state: "NC" },
    { city: "Indianapolis", state: "IN" },
    { city: "San Francisco", state: "CA" },
    { city: "Seattle", state: "WA" },
    { city: "Denver", state: "CO" },
    { city: "Boston", state: "MA" },
  ]

  const quantities = [1, 3, 6]

  const generateNotification = () => {
    const randomName = names[Math.floor(Math.random() * names.length)]
    const randomLocation = cities[Math.floor(Math.random() * cities.length)]
    const randomQuantity = quantities[Math.floor(Math.random() * quantities.length)]

    setNotification({
      name: randomName,
      location: `${randomLocation.city}, ${randomLocation.state}`,
      quantity: randomQuantity,
    })

    setIsVisible(true)

    // Hide after 5 seconds
    setTimeout(() => {
      setIsVisible(false)

      // After hiding, wait 5-6 seconds before showing the next notification
      const waitTime = Math.floor(Math.random() * (6000 - 5000 + 1)) + 5000
      setTimeout(() => {
        generateNotification()
      }, waitTime)
    }, 5000)
  }

  const closeNotification = () => {
    setIsVisible(false)

    // Schedule next notification after closing
    setTimeout(() => {
      generateNotification()
    }, 8000)
  }

  useEffect(() => {
    // Initial notification after a short delay
    const initialTimeout = setTimeout(() => {
      generateNotification()
    }, 3000)

    return () => {
      clearTimeout(initialTimeout)
    }
  }, []) // Only run on mount

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="fixed md:bottom-6 bottom-16 left-2 md:left-4 z-30 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 md:p-4 max-w-[calc(100vw-1rem)] md:max-w-xs border-l-4 border-indigo-500"
        >
          <button
            onClick={closeNotification}
            className="absolute top-1 right-1 md:hidden bg-gray-200 dark:bg-gray-700 rounded-full p-0.5"
            aria-label="Close notification"
          >
            <X className="w-3 h-3 text-gray-600 dark:text-gray-300" />
          </button>

          <div className="flex items-start">
            <div className="flex-shrink-0 bg-indigo-100 dark:bg-indigo-900 rounded-full p-1 md:p-2 mr-2 md:mr-3">
              <ShoppingBag className="w-3 h-3 md:w-5 md:h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <p className="text-xs md:text-sm font-medium text-gray-900 dark:text-white">
                {notification.name} from {notification.location}
              </p>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">
                just purchased {notification.quantity} {notification.quantity === 1 ? "bottle" : "bottles"} of {product?.name}
              </p>
              <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 mt-0.5 md:mt-1">Just now</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
