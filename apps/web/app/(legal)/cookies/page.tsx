import Link from 'next/link';

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground mb-8 inline-block">&larr; Back to Home</Link>
        <h1 className="text-3xl font-bold mb-8">Cookie Policy</h1>
        <div className="prose prose-sm max-w-none space-y-6 text-muted-foreground">
          <p>Last updated: July 2024</p>

          <h2 className="text-xl font-semibold text-foreground mt-8">1. What Are Cookies</h2>
          <p>Cookies are small text files stored on your device by your web browser. They help websites remember your preferences, authentication state, and improve functionality.</p>

          <h2 className="text-xl font-semibold text-foreground mt-8">2. Cookies We Use</h2>

          <h3 className="text-lg font-semibold text-foreground mt-6">Essential Cookies</h3>
          <p>Required for platform operation. These enable authentication, session management, and security features. The platform cannot function without them.</p>

          <h3 className="text-lg font-semibold text-foreground mt-6">Analytics Cookies</h3>
          <p>Help us understand how users interact with the platform, which features are most popular, and how we can improve the user experience.</p>

          <h3 className="text-lg font-semibold text-foreground mt-6">Preference Cookies</h3>
          <p>Remember your settings such as language, theme preferences, and previously viewed content for a personalized experience.</p>

          <h2 className="text-xl font-semibold text-foreground mt-8">3. Third-Party Cookies</h2>
          <p>We may use trusted third-party services (analytics, payment processors) that set their own cookies. These are governed by their respective privacy policies.</p>

          <h2 className="text-xl font-semibold text-foreground mt-8">4. Managing Cookies</h2>
          <p>You can control cookie settings through your browser preferences. Blocking essential cookies may prevent the platform from functioning properly. Most browsers allow you to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>View cookies stored on your device</li>
            <li>Block third-party cookies</li>
            <li>Clear all cookies when closing the browser</li>
            <li>Set preferences for specific websites</li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground mt-8">5. Contact</h2>
          <p>For questions about our cookie practices, contact us at <a href="mailto:support@cmpapp.ng" className="text-primary hover:underline">support@cmpapp.ng</a>.</p>
        </div>
      </div>
    </div>
  );
}
