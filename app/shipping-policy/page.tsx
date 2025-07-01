import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function ShippingPolicy() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[var(--bg-gradient-from)] via-[var(--bg-gradient-via)] to-[var(--bg-gradient-to)] text-[var(--text-primary)] py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Link href="/" className="inline-flex items-center text-red-600 dark:text-red-400 hover:underline mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Shipping Policy</h1>

          <div className="prose dark:prose-invert max-w-none">
            <p className="mb-4">Last Updated: {new Date().toLocaleDateString()}</p>

            <h2 className="text-xl font-semibold mt-6 mb-3">1. Shipping Information</h2>
            <p>
              At Tribal Force X, we strive to provide fast, reliable shipping for all orders. This Shipping Policy
              outlines our shipping procedures, delivery timeframes, and other important information regarding the
              delivery of your orders.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">2. Processing Time</h2>
            <p>
              All orders are processed within 1-2 business days (Monday through Friday, excluding holidays) after
              payment confirmation. Orders placed on weekends or holidays will be processed on the next business day.
            </p>
            <p>
              During high-volume periods, such as holidays or special promotions, processing times may be slightly
              longer. We will notify you if there are any significant delays in processing your order.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">3. Shipping Methods and Delivery Times</h2>
            <p>We offer the following shipping options for domestic orders (United States):</p>
            <ul className="list-disc pl-6 mb-4">
              <li>
                <strong>Standard Shipping:</strong> 5-7 business days
              </li>
              <li>
                <strong>Expedited Shipping:</strong> 3-5 business days
              </li>
              <li>
                <strong>Priority Shipping:</strong> 2-3 business days
              </li>
            </ul>

            <p>For international orders, shipping times vary by destination:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>
                <strong>Canada and Mexico:</strong> 7-14 business days
              </li>
              <li>
                <strong>Europe, Australia, and New Zealand:</strong> 10-21 business days
              </li>
              <li>
                <strong>All other countries:</strong> 14-30 business days
              </li>
            </ul>

            <p>
              Please note that these are estimated delivery times and do not include processing time. Actual delivery
              times may vary due to factors beyond our control, such as customs delays, weather conditions, or carrier
              issues.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">4. Shipping Costs</h2>
            <p>
              Shipping costs are calculated based on the shipping method, destination, and order weight. The exact
              shipping cost will be displayed during checkout before you complete your purchase.
            </p>
            <p>
              <strong>Free Shipping:</strong> We offer free standard shipping on all domestic orders over $99 and on all
              orders of 3 bottles or more. Free shipping promotions may be available during special sales events.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">5. Tracking Information</h2>
            <p>
              Once your order ships, you will receive a shipping confirmation email with a tracking number. You can use
              this tracking number to monitor the status of your delivery through the carrier's website.
            </p>
            <p>
              If you do not receive tracking information within 3 business days after your order has been processed,
              please contact our customer service team.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">6. International Shipping</h2>
            <p>
              We ship to most countries worldwide. Please note that international customers are responsible for all
              duties, import taxes, and customs fees that may be imposed by their country's government. These fees are
              not included in the shipping cost and will be collected by the delivery carrier or government agency upon
              delivery.
            </p>
            <p>
              Some countries have restrictions on importing dietary supplements. Please check your country's import
              regulations before placing an order to ensure that our products can be legally imported.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">7. Address Information</h2>
            <p>
              It is the customer's responsibility to provide accurate and complete shipping information. We are not
              responsible for orders shipped to incorrect addresses provided by customers.
            </p>
            <p>
              If you need to change your shipping address after placing an order, please contact us immediately. We will
              try to accommodate your request if the order has not yet been shipped.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">8. Shipping Delays and Issues</h2>
            <p>
              While we make every effort to ensure timely delivery, we cannot guarantee delivery dates and are not
              responsible for shipping delays caused by the carrier, weather conditions, customs delays, or other
              circumstances beyond our control.
            </p>
            <p>
              If your package appears to be lost or significantly delayed, please contact our customer service team, and
              we will work with the carrier to resolve the issue.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">9. Damaged or Lost Packages</h2>
            <p>
              If your package arrives damaged, please contact us within 48 hours of delivery with photos of the damaged
              package and products. We will arrange for a replacement shipment or refund.
            </p>
            <p>
              For packages that are lost during transit, we will file a claim with the carrier and either issue a refund
              or send a replacement once the claim is processed.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">10. Contact Information</h2>
            <p>
              If you have any questions about our shipping policy or need assistance with a shipment, please contact our
              customer service team:
            </p>
            <p className="mt-2">
              Email: shipping@tribalforcex.com
              <br />
              Phone: (800) 555-0123
              <br />
              Hours: Monday-Friday, 9:00 AM - 5:00 PM PST
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
