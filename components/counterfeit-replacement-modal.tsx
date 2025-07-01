"use client"

import type React from "react"

import { useState } from "react"
import { X, Upload, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

import type { Product } from "@/lib/models/product";

interface CounterfeitReplacementModalProps {
  product: Product;
}

export default function CounterfeitReplacementModal({ product }: CounterfeitReplacementModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    purchaseLocation: "",
    purchaseDate: "",
    additionalInfo: "",
  })
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const openModal = () => {
    setIsOpen(true)
    document.body.style.overflow = "hidden" // Prevent scrolling when modal is open
  }

  const closeModal = () => {
    setIsOpen(false)
    document.body.style.overflow = "auto" // Re-enable scrolling
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhotoFile(e.target.files[0])
    }
  }

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReceiptFile(e.target.files[0])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)

      // Reset form after 3 seconds
      setTimeout(() => {
        setIsOpen(false)
        setIsSubmitted(false)
        setFormData({
          name: "",
          email: "",
          phone: "",
          address: "",
          purchaseLocation: "",
          purchaseDate: "",
          additionalInfo: "",
        })
        setPhotoFile(null)
        setReceiptFile(null)
      }, 3000)
    }, 1500)
  }

  return (
    <>
      {/* Button to open the modal */}
      <Button
        onClick={openModal}
        className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-3 rounded-lg text-xs transition-all duration-300 shadow-sm hover:shadow-md"
      >
        Report Counterfeit
      </Button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          {/* Modal Content */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-indigo-600 text-white p-4 rounded-t-xl flex justify-between items-center">
              <h2 className="text-xl font-bold">Counterfeit Replacement Program</h2>
              <button onClick={closeModal} className="text-white hover:text-gray-200 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {!isSubmitted ? (
                <>
                  <p className="mb-4 text-gray-700 dark:text-gray-300">
                    We're sorry you may have purchased a counterfeit product. To help us verify and replace it with an
                    authentic {product?.name}, please provide the following information:
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="purchaseDate"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Purchase Date *
                        </label>
                        <input
                          type="date"
                          id="purchaseDate"
                          name="purchaseDate"
                          required
                          value={formData.purchaseDate}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="address"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Shipping Address *
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        required
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="purchaseLocation"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Where did you purchase the product? *
                      </label>
                      <input
                        type="text"
                        id="purchaseLocation"
                        name="purchaseLocation"
                        required
                        placeholder="Store name, website, or marketplace"
                        value={formData.purchaseLocation}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Upload Photo of Product *
                        </label>
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md p-4 text-center">
                          <input
                            type="file"
                            id="photoUpload"
                            accept="image/*"
                            required
                            onChange={handlePhotoUpload}
                            className="hidden"
                          />
                          <label
                            htmlFor="photoUpload"
                            className="cursor-pointer flex flex-col items-center justify-center"
                          >
                            <Upload className="w-8 h-8 text-gray-400 mb-2" />
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {photoFile ? photoFile.name : "Click to upload product photo"}
                            </span>
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Upload Receipt/Proof of Purchase *
                        </label>
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md p-4 text-center">
                          <input
                            type="file"
                            id="receiptUpload"
                            accept="image/*,.pdf"
                            required
                            onChange={handleReceiptUpload}
                            className="hidden"
                          />
                          <label
                            htmlFor="receiptUpload"
                            className="cursor-pointer flex flex-col items-center justify-center"
                          >
                            <Upload className="w-8 h-8 text-gray-400 mb-2" />
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {receiptFile ? receiptFile.name : "Click to upload receipt"}
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="additionalInfo"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Additional Information
                      </label>
                      <textarea
                        id="additionalInfo"
                        name="additionalInfo"
                        rows={3}
                        placeholder="Please describe how you identified the product as counterfeit and any other relevant details."
                        value={formData.additionalInfo}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 p-4 rounded">
                      <div className="flex">
                        <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2 flex-shrink-0" />
                        <p className="text-sm text-yellow-700 dark:text-yellow-300">
                          Our team will review your submission and contact you within 2-3 business days. If approved,
                          we'll send you an authentic {product?.name} at no cost.
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        type="button"
                        onClick={closeModal}
                        className="mr-3 bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Submitting..." : "Submit Request"}
                      </Button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-green-600 dark:text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Request Submitted Successfully!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Thank you for your submission. Our team will review your request and contact you within 2-3 business
                    days.
                  </p>
                  <Button onClick={closeModal} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                    Close
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
