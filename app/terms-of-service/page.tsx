import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[var(--bg-gradient-from)] via-[var(--bg-gradient-via)] to-[var(--bg-gradient-to)] text-[var(--text-primary)] py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Link href="/" className="inline-flex items-center text-red-600 dark:text-red-400 hover:underline mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Terms of Service</h1>

          <div className="prose dark:prose-invert max-w-none">
            <p className="mb-4">Last Updated: {new Date().toLocaleDateString()}</p>

            <h2 className="text-xl font-semibold mt-6 mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the Tribal Force X website ("Site") and purchasing our products, you agree to be
              bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our Site
              or purchase our products.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">2. Products and Services</h2>
            <p>
              Tribal Force X is a dietary supplement designed for adult males. Our products are not intended to
              diagnose, treat, cure, or prevent any disease. The information provided on our Site is for informational
              purposes only and should not be considered medical advice.
            </p>
            <p>We reserve the right to modify, discontinue, or update our products at any time without prior notice.</p>

            <h2 className="text-xl font-semibold mt-6 mb-3">3. Ordering and Payment</h2>
            <p>
              By placing an order, you represent that you are at least 18 years old and that the information you provide
              is accurate and complete. We reserve the right to refuse or cancel any order for any reason, including but
              not limited to product availability, errors in pricing or product information, or suspected fraud.
            </p>
            <p>
              Payment must be made at the time of order. We accept major credit cards and other payment methods as
              indicated on our checkout page. All prices are in US dollars unless otherwise specified.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">4. Shipping and Delivery</h2>
            <p>
              We ship to addresses within the United States and select international destinations. Shipping times and
              costs vary based on location and shipping method selected. We are not responsible for delays caused by
              customs, weather, or other factors beyond our control.
            </p>
            <p>Risk of loss and title for items purchased pass to you upon delivery of the items to the carrier.</p>

            <h2 className="text-xl font-semibold mt-6 mb-3">5. Returns and Refunds</h2>
            <p>
              We offer a 60-day money-back guarantee on our products. Please refer to our Return Policy for detailed
              information on returns, refunds, and exchanges.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">6. Intellectual Property</h2>
            <p>
              All content on our Site, including text, graphics, logos, images, and software, is the property of Tribal
              Force X or its content suppliers and is protected by United States and international copyright laws. The
              compilation of all content on this Site is the exclusive property of Tribal Force X and is protected by
              United States and international copyright laws.
            </p>
            <p>
              You may not reproduce, modify, distribute, or republish any content from our Site without our prior
              written consent.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">7. User Conduct</h2>
            <p>
              You agree not to use our Site for any unlawful purpose or in any way that could damage, disable,
              overburden, or impair our Site or interfere with any other party's use and enjoyment of our Site.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">8. Disclaimer of Warranties</h2>
            <p>
              OUR SITE AND PRODUCTS ARE PROVIDED "AS IS" WITHOUT ANY WARRANTIES, EXPRESS OR IMPLIED. WE DISCLAIM ALL
              WARRANTIES, INCLUDING BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
              PURPOSE, AND NON-INFRINGEMENT.
            </p>
            <p>
              WE DO NOT WARRANT THAT OUR SITE WILL BE UNINTERRUPTED OR ERROR-FREE, THAT DEFECTS WILL BE CORRECTED, OR
              THAT OUR SITE OR THE SERVER THAT MAKES IT AVAILABLE ARE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">9. Limitation of Liability</h2>
            <p>
              IN NO EVENT SHALL TRIBAL FORCE X, ITS OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS, BE LIABLE FOR ANY
              INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATED TO YOUR USE OF
              OUR SITE OR PRODUCTS.
            </p>
            <p>OUR LIABILITY IS LIMITED TO THE MAXIMUM EXTENT PERMITTED BY LAW.</p>

            <h2 className="text-xl font-semibold mt-6 mb-3">10. Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless Tribal Force X, its officers, directors, employees,
              agents, and suppliers from and against all losses, expenses, damages, and costs, including reasonable
              attorneys' fees, resulting from any violation of these Terms or any activity related to your account.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">11. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the State of California,
              without giving effect to any principles of conflicts of law. Any dispute arising under or relating to
              these Terms shall be resolved exclusively in the state or federal courts located in Los Angeles County,
              California.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">12. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting
              on our Site. Your continued use of our Site following the posting of changes constitutes your acceptance
              of such changes.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">13. Contact Information</h2>
            <p>If you have any questions about these Terms, please contact us at:</p>
            <p className="mt-2">
              Email: support@tribalforcex.com
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
