import type { Metadata } from "next";
import NavBar from "../ui/nav-bar";
import Footer from "../ui/footer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="flex-1 min-h-screen max-w-[680px] mx-auto px-4 py-10 text-foreground font-sans">
        <h1 className="font-serif italic text-3xl md:text-4xl mb-8 text-foreground">
          Privacy Policy
        </h1>
        <div className="space-y-6 text-sm leading-6 text-muted-foreground">
          <p>Last updated: May 24, 2026</p>
          <p>
            This Privacy Policy describes how UAB “Madcom” (the “Company”,
            “TurnMeRoyal”, “we”, “us”, or “our”), operating the website{" "}
            <strong>turnmeroyal.com</strong> (the “Site”), collects, uses, and
            shares your personal information when you use our AI portrait
            generation service. By using the Site, you agree to the collection
            and use of information in accordance with this policy.
          </p>
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              1. Information We Collect
            </h2>
            <p>
              We collect several types of information depending on how you
              interact with our Site:
            </p>
            <h3 className="font-semibold text-foreground mt-4 mb-1">
              1.1 Photos You Upload
            </h3>
            <p>
              When you use our AI portrait generation service, you upload one or
              more photographs. These photos are transmitted to our servers and
              processed by our AI system to generate royal-style portraits. We
              store uploaded photos securely and use them solely for the purpose
              of generating your portrait(s). Photos are not shared with third
              parties except as necessary for AI processing (see Section 4).
            </p>
            <h3 className="font-semibold text-foreground mt-4 mb-1">
              1.2 Order Information
            </h3>
            <p>
              When you make a purchase, we collect information necessary to
              process your order, including:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Email address (collected during Stripe checkout)</li>
              <li>
                Billing information (processed and stored by Stripe; we do not
                store full payment card details)
              </li>
              <li>
                Shipping address (for physical print and canvas orders only)
              </li>
              <li>Order details (product type, size, amount paid)</li>
            </ul>
            <h3 className="font-semibold text-foreground mt-4 mb-1">
              1.3 Device and Usage Information
            </h3>
            <p>
              When you visit the Site, we automatically collect certain
              information about your device and browsing activity, including:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>IP address and approximate geographic location</li>
              <li>Browser type and version, operating system</li>
              <li>
                Device type (desktop, mobile, tablet) and screen resolution
              </li>
              <li>Referring website or source</li>
              <li>Pages visited, time spent on pages, click behavior</li>
              <li>Session recordings and heatmap data (via Hotjar)</li>
            </ul>
            <h3 className="font-semibold text-foreground mt-4 mb-1">
              1.4 Session Information
            </h3>
            <p>
              We use anonymous sessions to allow you to use the Site without
              creating an account. A unique session identifier is stored in a
              cookie on your browser and linked to your uploads, generations,
              and orders. No personal information is required to start a
              session.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              2. How We Use Your Information
            </h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                <strong>Provide the service:</strong> Process your uploaded
                photos through our AI system to generate portraits, deliver
                digital downloads, and fulfill physical print/canvas orders.
              </li>
              <li>
                <strong>Process payments:</strong> Complete transactions
                securely through Stripe and maintain order records.
              </li>
              <li>
                <strong>Communicate with you:</strong> Send order confirmations,
                download links, shipping updates, and respond to support
                inquiries via email (powered by Klaviyo).
              </li>
              <li>
                <strong>Improve the service:</strong> Analyze usage patterns,
                identify issues, and optimize the user experience using
                analytics tools.
              </li>
              <li>
                <strong>Marketing:</strong> With your consent, send promotional
                emails about new features, templates, or offers. You can
                unsubscribe at any time.
              </li>
              <li>
                <strong>Prevent fraud and abuse:</strong> Monitor for
                unauthorized access, automated abuse, or attempts to circumvent
                our security measures.
              </li>
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              3. Photo Data Handling
            </h2>
            <p>
              We take the handling of your uploaded photos seriously. Here is
              how we treat your photo data:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                <strong>Purpose limitation:</strong> Uploaded photos are used
                solely for generating AI portraits. We do not use your photos
                for training AI models, selling to third parties, or any purpose
                other than fulfilling your portrait request.
              </li>
              <li>
                <strong>AI processing:</strong> Your photos are sent to our AI
                provider (Google) for portrait generation. The AI provider
                processes the images in real time and does not retain them after
                generation is complete.
              </li>
              <li>
                <strong>Storage:</strong> Uploaded photos are stored securely in
                our cloud infrastructure (Supabase Storage) with encryption at
                rest (AES-256), encrypted transport (TLS), and access controls.
                Only your session can access your uploads.
              </li>
              <li>
                <strong>No biometric templates:</strong> We do not extract,
                generate, or store face geometry, faceprints, or biometric
                identifier templates from uploaded photos. The AI processing is
                performed transiently in-memory by our AI provider on the
                photograph itself; no biometric data structure is retained by us
                or by the AI provider.
              </li>
              <li>
                <strong>Early deletion:</strong> You may request immediate
                deletion of your photos and generated portraits at any time by
                contacting us at{" "}
                <Link
                  href="mailto:help@turnmeroyal.com"
                  className="text-primary hover:underline"
                >
                  help@turnmeroyal.com
                </Link>
                .
              </li>
            </ul>
            <h3 className="font-semibold text-foreground mt-4 mb-1">
              3.1 Retention Schedule for Uploaded Photos
            </h3>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                <strong>Failed or abandoned generation attempts:</strong>{" "}
                original photo uploads are automatically deleted within{" "}
                <strong>90 days</strong> of the failed or abandoned attempt.
              </li>
              <li>
                <strong>Successful generations you have purchased:</strong>{" "}
                retained for as long as you maintain access to your account, so
                that you can re-download your portraits at any time.
              </li>
              <li>
                <strong>Successful generations you have not purchased:</strong>{" "}
                retained for up to <strong>12 months</strong> from the
                generation date, after which they may be deleted.
              </li>
              <li>
                <strong>Immediate deletion on request:</strong> contact{" "}
                <Link
                  href="mailto:help@turnmeroyal.com"
                  className="text-primary hover:underline"
                >
                  help@turnmeroyal.com
                </Link>{" "}
                to request deletion at any time.
              </li>
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              4. Third-Party Services
            </h2>
            <p>
              We share your information with the following third-party service
              providers, each for a specific purpose:
            </p>
            <h3 className="font-semibold text-foreground mt-4 mb-1">
              Payment Processing
            </h3>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                <strong>Stripe</strong> — Processes all payments. Stripe
                receives your email, billing details, and payment card
                information. Stripe&apos;s privacy policy:{" "}
                <Link
                  href="https://stripe.com/privacy"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  stripe.com/privacy
                </Link>
              </li>
            </ul>
            <h3 className="font-semibold text-foreground mt-4 mb-1">
              Data Storage
            </h3>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                <strong>Supabase</strong> — Hosts our database and file storage
                (uploaded photos, generated images, session data, order
                records). Data is stored in secure cloud infrastructure with
                encryption at rest.
              </li>
              <li>
                <strong>Vercel</strong> — Hosts our website application.
                Processes web requests and may log IP addresses and request
                metadata.
              </li>
            </ul>
            <h3 className="font-semibold text-foreground mt-4 mb-1">
              AI Processing
            </h3>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                <strong>Google</strong> — Primary AI provider. Processes your
                uploaded photos to generate AI portraits. Photos are transmitted
                securely and processed in real time. Google does not retain your
                images after processing per Google&apos;s API terms.
              </li>
              <li>
                <strong>OpenRouter</strong> — Used as a fallback AI provider
                when our primary provider is unavailable or rate-limited. Photos
                are transmitted to OpenRouter only when a fallback is triggered.
                OpenRouter does not retain images after processing.
              </li>
            </ul>
            <h3 className="font-semibold text-foreground mt-4 mb-1">
              Email Communications
            </h3>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                <strong>Klaviyo</strong> — Sends transactional emails (order
                confirmations, download links) and marketing emails (with your
                consent). Klaviyo receives your email address and order
                information. Klaviyo&apos;s privacy policy:{" "}
                <Link
                  href="https://www.klaviyo.com/legal/privacy"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  klaviyo.com/legal/privacy
                </Link>
              </li>
            </ul>
            <h3 className="font-semibold text-foreground mt-4 mb-1">
              Analytics and Tracking
            </h3>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                <strong>Google Tag Manager (GTM)</strong> — Manages analytics
                and marketing tags on our Site. GTM may load additional scripts
                from Google Analytics and other providers.
              </li>
              <li>
                <strong>Meta Pixel (Facebook)</strong> — Tracks conversions and
                enables retargeting advertising on Meta platforms (Facebook,
                Instagram). Collects browsing behavior and purchase events.
              </li>
              <li>
                <strong>Mixpanel</strong> — Tracks user interactions and events
                (e.g., photo uploads, generations, purchases) to help us
                understand usage patterns and improve the service.
              </li>
              <li>
                <strong>Hotjar</strong> — Records anonymized session replays and
                generates heatmaps to help us understand how users interact with
                our Site. Hotjar does not collect personal information from form
                fields.
              </li>
              <li>
                <strong>Meta Conversions API (CAPI)</strong> — In addition to
                the Meta Pixel, we transmit purchase confirmation and key
                conversion events to Meta server-side. We transmit hashed email
                addresses and order details for ad-attribution purposes. We do
                not transmit uploaded photos.
              </li>
            </ul>
            <h3 className="font-semibold text-foreground mt-4 mb-1">
              Error Monitoring
            </h3>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                <strong>Sentry</strong> — Captures application error events and
                crash data, which may include IP addresses, request URLs,
                browser/device metadata, and error stack traces. Sentry does not
                capture uploaded photos or authentication tokens.
              </li>
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              5. Cookies and Tracking Technologies
            </h2>
            <p>
              We use cookies and similar technologies for the following
              purposes:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                <strong>Essential cookies:</strong> Session identifier cookie (
                <code>tmr_session</code>) that allows you to use the Site
                without creating an account. This cookie is necessary for the
                service to function.
              </li>
              <li>
                <strong>Analytics cookies:</strong> Placed by Google Analytics,
                Mixpanel, and Hotjar to collect anonymized usage data and
                improve the service.
              </li>
              <li>
                <strong>Marketing cookies:</strong> Placed by Meta Pixel and
                Google to enable targeted advertising and measure ad campaign
                effectiveness.
              </li>
            </ul>
            <p className="mt-2">
              You can control cookie preferences through your browser settings.
              Disabling essential cookies may prevent the Site from functioning
              properly. Disabling analytics and marketing cookies will not
              affect core functionality but will limit our ability to improve
              the service and show you relevant advertisements.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              6. Behavioral Advertising
            </h2>
            <p>
              We use your personal information to provide you with targeted
              advertisements or marketing communications that we believe may be
              of interest to you. This is done through the following mechanisms:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                <strong>Meta (Facebook/Instagram):</strong> We use Meta Pixel to
                track actions on our Site (such as viewing a preview or
                completing a purchase) and create custom audiences for
                advertising on Meta platforms.
              </li>
              <li>
                <strong>Google Ads:</strong> We may use Google advertising
                services via GTM to display retargeting ads to visitors who have
                interacted with our Site.
              </li>
            </ul>
            <p className="mt-2">
              You can opt out of targeted advertising by adjusting your
              preferences on these platforms:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                Facebook:{" "}
                <Link
                  href="https://www.facebook.com/settings/?tab=ads"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  facebook.com/settings/?tab=ads
                </Link>
              </li>
              <li>
                Google:{" "}
                <Link
                  href="https://adssettings.google.com"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  adssettings.google.com
                </Link>
              </li>
              <li>
                Digital Advertising Alliance:{" "}
                <Link
                  href="https://optout.aboutads.info"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  optout.aboutads.info
                </Link>
              </li>
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              7. Data Retention
            </h2>
            <p>We retain your data for the following periods:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                <strong>Order records:</strong> Retained for as long as
                necessary for accounting, tax, and legal compliance purposes
                (typically 7 years).
              </li>
              <li>
                <strong>Session data:</strong> Anonymous session records are
                retained for 12 months, after which they are purged.
              </li>
              <li>
                <strong>Email and marketing data:</strong> Retained until you
                unsubscribe or request deletion.
              </li>
              <li>
                <strong>Analytics data:</strong> Retained according to each
                analytics provider&apos;s retention policies (typically 14–26
                months).
              </li>
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              8. Your Rights
            </h2>
            <p>
              We provide these rights to every user worldwide, regardless of
              which country or U.S. state you live in. These commitments meet or
              exceed the requirements of the EU General Data Protection
              Regulation (GDPR), the California Consumer Privacy Act
              (CCPA/CPRA), and comparable privacy laws in Colorado, Connecticut,
              Illinois, Montana, Oregon, Texas, Utah, Virginia, Washington, the
              UK, Canada, and other jurisdictions:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                <strong>Right to know / access:</strong> Request information
                about what personal data we hold about you, including a copy of
                that data.
              </li>
              <li>
                <strong>Right to delete / erasure:</strong> Request deletion of
                your personal data, including uploaded photographs and generated
                portraits.
              </li>
              <li>
                <strong>Right to correct / rectification:</strong> Request
                correction of inaccurate personal data we hold.
              </li>
              <li>
                <strong>Right to data portability:</strong> Request your data in
                a structured, commonly used, machine-readable format.
              </li>
              <li>
                <strong>Right to object / restrict processing:</strong> Object
                to or request that we limit how we process your data, including
                for direct marketing.
              </li>
              <li>
                <strong>Right to withdraw consent:</strong> Where processing is
                based on your consent, you may withdraw it at any time.
              </li>
              <li>
                <strong>Your photos are never sold or shared:</strong> We do not
                sell, lease, trade, or share your uploaded photographs or
                generated portraits with any third party for marketing, AI
                training, or commercial purposes. The only third party that ever
                receives your photos is the AI provider used to generate your
                portrait (Google, or OpenRouter as fallback), strictly for
                transient processing as described in Section 4 — and that
                provider does not retain your images after processing.
              </li>
              <li>
                <strong>No sale of personal information:</strong> We do not
                sell, lease, trade, or otherwise profit from your personal
                information.
              </li>
              <li>
                <strong>Limited ad-attribution sharing (with opt-out):</strong>{" "}
                Like most consumer websites, to measure advertising
                effectiveness and serve relevant ads, we transmit non-photo
                events (such as pageviews, purchase confirmations, and hashed
                email addresses) to our advertising partners (Meta, Google) via
                tools described in Section 4. You can opt out at any time using
                the platform opt-out links in Section 6.
              </li>
              <li>
                <strong>Non-discrimination:</strong> We will not deny service,
                change pricing, or otherwise penalize you for exercising any of
                these rights.
              </li>
              <li>
                <strong>Unsubscribe:</strong> Opt out of marketing emails using
                the link in any email we send, or by emailing us.
              </li>
            </ul>
            <p className="mt-2">
              To exercise any of these rights, email{" "}
              <Link
                href="mailto:help@turnmeroyal.com"
                className="text-primary hover:underline"
              >
                help@turnmeroyal.com
              </Link>
              . We respond to verifiable requests within 30 days. Residents of
              the EU, EEA, and UK additionally have the right to lodge a
              complaint with their local data protection authority.
            </p>
            <h3 className="font-semibold text-foreground mt-4 mb-1">
              Biometric data notice (Illinois BIPA and similar state laws):
            </h3>
            <p className="mt-1">
              Our AI generates royal-style portraits from photos you upload. The
              computer-vision processing on facial features is performed
              transiently and in-memory by our AI provider (Google); we do not
              retain a biometric template, faceprint, or face geometry vector.
              Original photographs are stored only for the purposes and
              retention periods stated in Section 3 above, and we do not sell,
              lease, trade, or otherwise profit from biometric information. By
              uploading a photo containing a face, you acknowledge this notice
              and provide written consent to this processing under the Illinois
              Biometric Information Privacy Act (740 ILCS 14) and any comparable
              biometric privacy law in your state of residence (including Texas
              CUBI and Washington&apos;s biometric privacy statute).
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              9. Data Security
            </h2>
            <p>
              We implement appropriate technical and organizational measures to
              protect your personal data against unauthorized access,
              alteration, disclosure, or destruction. These measures include
              encryption in transit (TLS/SSL), encryption at rest for stored
              data, access controls on file storage, and secure handling of
              payment information through Stripe (PCI DSS compliant). However,
              no method of transmission over the Internet or electronic storage
              is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              10. Children&apos;s Privacy
            </h2>
            <p>
              Our service is not directed to anyone under the age of 18. Per
              Section 4.1 of our{" "}
              <Link href="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>
              , users must be at least 18 years of age (or the age of majority
              in their jurisdiction, if higher) to upload photographs or
              otherwise use the service. We do not knowingly collect personal
              information from individuals under 18. If you become aware that
              someone under 18 has provided us with personal data, please
              contact us at{" "}
              <Link
                href="mailto:help@turnmeroyal.com"
                className="text-primary hover:underline"
              >
                help@turnmeroyal.com
              </Link>{" "}
              and we will take steps to delete such information. This commitment
              is at least as protective as the United States Children&apos;s
              Online Privacy Protection Act (COPPA, under 13) and Article 8 of
              the EU General Data Protection Regulation (GDPR, under 16).
            </p>
            <p className="mt-2">
              Note that uploading photographs that depict children is separately
              governed by Section 4 of our{" "}
              <Link href="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              — adult uploaders must be the parent or legal guardian of every
              child depicted, or have written consent from each such parent or
              legal guardian.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              11. International Data Transfers
            </h2>
            <p>
              Your information may be transferred to and processed in countries
              other than your country of residence, including the United States
              (where some of our service providers are located). We ensure that
              appropriate safeguards are in place for such transfers, including
              Standard Contractual Clauses (SCCs) where required under GDPR.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              12. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time to reflect
              changes in our practices or applicable law. We will post the
              updated policy on this page with a revised “Last updated” date. We
              encourage you to review this page periodically. Your continued use
              of the Site after any changes constitutes acceptance of the
              updated policy.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              13. Contact Us
            </h2>
            <p>
              If you have questions, concerns, or requests regarding this
              Privacy Policy or your personal data, please contact us:
            </p>
            <ul className="list-none mt-2 space-y-1">
              <li>
                <strong>Company:</strong> UAB “Madcom”
              </li>
              <li>
                <strong>Email:</strong>{" "}
                <Link
                  href="mailto:help@turnmeroyal.com"
                  className="text-primary hover:underline"
                >
                  help@turnmeroyal.com
                </Link>
              </li>
              <li>
                <strong>Website:</strong> turnmeroyal.com
              </li>
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
