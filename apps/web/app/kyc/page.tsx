import Link from 'next/link';

export default function KYCPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground mb-8 inline-block">&larr; Back to Home</Link>
        <h1 className="text-3xl font-bold mb-8">KYC Policy</h1>
        <div className="prose prose-sm max-w-none space-y-6 text-muted-foreground">
          <p>Last updated: July 2024</p>

          <h2 className="text-xl font-semibold text-foreground mt-8">1. Purpose</h2>
          <p>Know Your Customer (KYC) verification helps CMPapp comply with anti-money laundering (AML) regulations, prevent fraud, and maintain a secure platform for all users.</p>

          <h2 className="text-xl font-semibold text-foreground mt-8">2. When KYC Is Required</h2>
          <p>KYC verification is required before withdrawing funds. We may also request verification if unusual account activity is detected or when required by applicable regulations.</p>

          <h2 className="text-xl font-semibold text-foreground mt-8">3. Required Documents</h2>
          <p>To complete KYC, you must provide:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Government-issued ID (National ID, International Passport, or Driver&apos;s License)</li>
            <li>Proof of address (utility bill or bank statement dated within 3 months)</li>
            <li>A clear selfie for identity matching</li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground mt-8">4. Verification Process</h2>
          <p>Documents are reviewed within 24&ndash;48 hours. You will be notified via email and in-app notification once verification is complete. If additional information is needed, we will contact you directly.</p>

          <h2 className="text-xl font-semibold text-foreground mt-8">5. Data Handling</h2>
          <p>All KYC documents are encrypted and stored securely. Access is restricted to authorized compliance personnel. Documents are retained for the duration required by applicable regulations and securely destroyed thereafter.</p>

          <h2 className="text-xl font-semibold text-foreground mt-8">6. Failed Verification</h2>
          <p>If verification fails, you will receive a clear explanation and an opportunity to resubmit corrected documents. Repeated failures may result in account restrictions.</p>

          <h2 className="text-xl font-semibold text-foreground mt-8">7. Appeals</h2>
          <p>If you believe your KYC status is incorrect, contact our support team at <a href="mailto:support@cmpapp.ng" className="text-primary hover:underline">support@cmpapp.ng</a> with your account details and supporting documents.</p>

          <h2 className="text-xl font-semibold text-foreground mt-8">8. Updates</h2>
          <p>We may update this KYC policy to reflect regulatory changes. Users will be notified of material changes via email or platform notice.</p>
        </div>
      </div>
    </div>
  );
}
