import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground mb-8 inline-block">&larr; Back to Home</Link>
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
        <div className="prose prose-sm max-w-none space-y-6 text-muted-foreground">
          <p>Last updated: July 2024</p>

          <h2 className="text-xl font-semibold text-foreground mt-8">1. Information We Collect</h2>
          <p>We collect information you provide directly: name, email address, phone number, and payment details when you register and use the Platform. We also collect usage data including tasks completed, music streamed, and reward transactions.</p>

          <h2 className="text-xl font-semibold text-foreground mt-8">2. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Create and manage your account</li>
            <li>Process rewards and payouts</li>
            <li>Improve platform features and user experience</li>
            <li>Send service-related communications</li>
            <li>Detect and prevent fraudulent activity</li>
            <li>Comply with legal obligations under Nigerian law</li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground mt-8">3. Data Sharing</h2>
          <p>We do not sell your personal information. We may share data with trusted third-party service providers for payment processing, identity verification, and analytics under strict confidentiality agreements.</p>

          <h2 className="text-xl font-semibold text-foreground mt-8">4. Data Security</h2>
          <p>We implement industry-standard encryption and security measures to protect your data. However, no electronic storage is 100% secure, and we cannot guarantee absolute security.</p>

          <h2 className="text-xl font-semibold text-foreground mt-8">5. Your Rights</h2>
          <p>Under the Nigeria Data Protection Regulation (NDPR), you have the right to access, correct, or delete your personal data. You may also withdraw consent for data processing at any time by contacting us.</p>

          <h2 className="text-xl font-semibold text-foreground mt-8">6. Data Retention</h2>
          <p>We retain your data for as long as your account is active and for a reasonable period afterward to comply with legal obligations, resolve disputes, and enforce agreements.</p>

          <h2 className="text-xl font-semibold text-foreground mt-8">7. Cookies</h2>
          <p>We use essential cookies for authentication and platform functionality. Analytics cookies help us improve performance. You can control cookie preferences through your browser settings. See our <Link href="/cookies" className="text-primary hover:underline">Cookie Policy</Link> for details.</p>

          <h2 className="text-xl font-semibold text-foreground mt-8">8. Third-Party Services</h2>
          <p>The Platform may link to third-party services. We are not responsible for their privacy practices. Please review their policies before providing personal information.</p>

          <h2 className="text-xl font-semibold text-foreground mt-8">9. Children&apos;s Privacy</h2>
          <p>The Platform is not intended for users under 18. We do not knowingly collect data from minors. If you believe a minor has provided personal data, please contact us immediately.</p>

          <h2 className="text-xl font-semibold text-foreground mt-8">10. Contact</h2>
          <p>For privacy-related inquiries, contact our Data Protection Officer at <a href="mailto:support@cmpapp.ng" className="text-primary hover:underline">support@cmpapp.ng</a>.</p>
        </div>
      </div>
    </div>
  );
}
