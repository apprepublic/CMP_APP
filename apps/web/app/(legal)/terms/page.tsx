import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground mb-8 inline-block">&larr; Back to Home</Link>
        <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
        <div className="prose prose-sm max-w-none space-y-6 text-muted-foreground">
          <p>Last updated: July 2024</p>

          <h2 className="text-xl font-semibold text-foreground mt-8">1. Acceptance of Terms</h2>
          <p>By accessing or using CMPapp (&ldquo;the Platform&rdquo;), you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.</p>

          <h2 className="text-xl font-semibold text-foreground mt-8">2. Eligibility</h2>
          <p>You must be at least 18 years old to use the Platform. By registering, you represent that you are legally capable of entering into binding contracts under Nigerian law.</p>

          <h2 className="text-xl font-semibold text-foreground mt-8">3. Account Registration</h2>
          <p>You are responsible for maintaining the confidentiality of your account credentials. You must provide accurate, current, and complete information during registration.</p>

          <h2 className="text-xl font-semibold text-foreground mt-8">4. CMP Coins &amp; Rewards</h2>
          <p>CMP Coins are virtual rewards earned through platform activities. They have no real-world value outside the Platform and are non-transferable except as explicitly permitted. All rewards are subject to verification and may be adjusted for fraudulent activity.</p>

          <h2 className="text-xl font-semibold text-foreground mt-8">5. User Conduct</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Use the Platform for any unlawful purpose</li>
            <li>Create multiple accounts to abuse referral or reward systems</li>
            <li>Attempt to manipulate task completion or streaming metrics</li>
            <li>Harass, abuse, or harm other users</li>
            <li>Upload malicious content or attempt to compromise platform security</li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground mt-8">6. Termination</h2>
          <p>We reserve the right to suspend or terminate accounts that violate these terms, engage in fraudulent activity, or at our sole discretion with notice where feasible.</p>

          <h2 className="text-xl font-semibold text-foreground mt-8">7. Limitation of Liability</h2>
          <p>CMPapp shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Platform, to the maximum extent permitted by Nigerian law.</p>

          <h2 className="text-xl font-semibold text-foreground mt-8">8. Changes to Terms</h2>
          <p>We may update these terms at any time. Continued use after changes constitutes acceptance of the new terms. We will notify users of material changes via email or platform notice.</p>

          <h2 className="text-xl font-semibold text-foreground mt-8">9. Governing Law</h2>
          <p>These terms are governed by the laws of the Federal Republic of Nigeria. Any disputes shall be resolved through binding arbitration in Lagos, Nigeria.</p>

          <h2 className="text-xl font-semibold text-foreground mt-8">10. Contact</h2>
          <p>For questions about these terms, contact us at <a href="mailto:support@cmpapp.ng" className="text-primary hover:underline">support@cmpapp.ng</a>.</p>
        </div>
      </div>
    </div>
  );
}
