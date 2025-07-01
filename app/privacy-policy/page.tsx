import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import type { Product } from "@/lib/models/product";

interface PrivacyPolicyProps {
  product: Product;
}

export default function PrivacyPolicy({ product }: PrivacyPolicyProps) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[var(--bg-gradient-from)] via-[var(--bg-gradient-via)] to-[var(--bg-gradient-to)] text-[var(--text-primary)] py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Link href="/" className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:underline mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Privacy Policy</h1>

          <div className="prose dark:prose-invert max-w-none">
            <p className="mb-4">Last Updated: {new Date().toLocaleDateString()}</p>

            <h2 className="text-xl font-semibold mt-6 mb-3">1. Introduction</h2>
            <p>
              Welcome to {product?.name}("we," "our," or "us"). We are committed to protecting your privacy and handling
              your personal information with transparency and care. This Privacy Policy explains how we collect, use,
              disclose, and safeguard your information when you visit our website, purchase our products, or interact
              with us in any way.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">2. Information We Collect</h2>
            <p>We may collect the following types of information:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>
                <strong>Personal Information:</strong> Name, email address, shipping address, billing address, phone
                number, and payment information.
              </li>
              <li>
                <strong>Order Information:</strong> Products purchased, order history, and transaction details.
              </li>
              <li>
                <strong>Technical Information:</strong> IP address, browser type, device information, cookies, and usage
                data.
              </li>
              <li>
                <strong>Communications:</strong> Customer service inquiries, feedback, and survey responses.
              </li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-3">3. How We Use Your Information</h2>
            <p>We use your information for the following purposes:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Process and fulfill your orders</li>
              <li>Communicate with you about your orders and provide customer support</li>
              <li>Send you product updates, promotional offers, and marketing communications (with your consent)</li>
              <li>Improve our website, products, and services</li>
              <li>Detect and prevent fraud or unauthorized access</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-3">4. Sharing Your Information</h2>
            <p>We may share your information with:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>
                <strong>Service Providers:</strong> Payment processors, shipping companies, and other third parties who
                help us operate our business.
              </li>
              <li>
                <strong>Business Partners:</strong> Trusted partners who assist us in marketing, analytics, and product
                development.
              </li>
              <li>
                <strong>Legal Requirements:</strong> When required by law, court order, or governmental authority.
              </li>
            </ul>
            <p>We do not sell your personal information to third parties.</p>

            <h2 className="text-xl font-semibold mt-6 mb-3">5. Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to enhance your browsing experience, analyze website
              traffic, and personalize content. You can control cookies through your browser settings, but disabling
              them may affect the functionality of our website.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">6. Your Rights and Choices</h2>
            <p>Depending on your location, you may have the following rights:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Access and review your personal information</li>
              <li>Correct inaccuracies in your personal information</li>
              <li>Delete your personal information</li>
              <li>Object to or restrict the processing of your personal information</li>
              <li>Withdraw consent for marketing communications</li>
            </ul>
            <p>To exercise these rights, please contact us using the information provided below.</p>

            <h2 className="text-xl font-semibold mt-6 mb-3">7. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal information from
              unauthorized access, disclosure, alteration, or destruction. However, no method of transmission over the
              Internet or electronic storage is 100% secure, so we cannot guarantee absolute security.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">8. Children's Privacy</h2>
            <p>
              Our website and products are not intended for individuals under the age of 18. We do not knowingly collect
              personal information from children. If you believe we have inadvertently collected information from a
              child, please contact us immediately.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">9. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices or legal
              requirements. We will notify you of any material changes by posting the updated policy on our website with
              a new "Last Updated" date.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">10. Contact Us</h2>
            <p>
              If you have any questions, concerns, or requests regarding this Privacy Policy or our privacy practices,
              please contact us at:
            </p>
            <p className="mt-2">
              Email: privacy@{product?.name}.com
              <br />
              Address: 123 Supplement Ave, Health City, CA 90210
              <br />
              Phone: (800) 555-0123
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
