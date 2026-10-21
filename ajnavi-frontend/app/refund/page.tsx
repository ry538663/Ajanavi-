import type { Metadata } from "next";
import { PolicyPage, PolicySection } from "@/components/policy-page";

export const metadata: Metadata = { title: "Refund Policy — Ajnavi", description: "Ajnavi payment and refund information." };

export default function RefundPage() {
  return <PolicyPage eyebrow="Refund policy" title="Simple because Ajnavi is currently free." intro="Ajnavi does not currently charge users, offer subscriptions, or sell digital items. That means there is presently no purchase to refund.">
    <PolicySection title="No current charges"><p>You should not be asked to provide payment information to use the current service. If someone claims to represent Ajnavi and requests payment, do not pay them and contact us immediately.</p></PolicySection>
    <PolicySection title="Unauthorized charges"><p>If you see a charge that appears to reference Ajnavi, contact your bank or payment provider promptly and use the details on our <a href="/contacts">Contacts page</a> to send the date, amount, currency, and a redacted receipt. Never send full card or bank details.</p></PolicySection>
    <PolicySection title="If paid features are introduced"><p>Before any paid feature launches, its price, billing frequency, cancellation method, refund eligibility, and any statutory withdrawal rights will be shown before purchase. This policy will be updated to explain the applicable process.</p></PolicySection>
    <PolicySection title="How a future refund request would work"><p>If a paid feature is introduced and you believe a charge is eligible for review, contact us through our <a href="/contacts">Contacts page</a> with the payment date, amount and currency, payment provider, transaction or order reference, and a short explanation. Do not include a complete card number, bank password, PIN, or security code.</p></PolicySection>
    <PolicySection title="Third-party purchases"><p>Purchases completed through an app store or another payment platform may be governed by that provider’s refund process and timing. In that situation, you may need to submit the request directly to the provider that processed the charge.</p></PolicySection>
    <PolicySection title="Processing and bank timing"><p>If future paid services make a refund available, the applicable policy will state the review period. Once approved and issued, banks and payment providers may require additional business days to display the credit; that external processing time is outside Ajnavi’s control.</p></PolicySection>
    <PolicySection title="Consumer rights"><p>Nothing in this policy limits refund, cancellation, or consumer-protection rights that cannot be waived under applicable law.</p></PolicySection>
  </PolicyPage>;
}
