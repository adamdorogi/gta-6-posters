import type { Metadata } from "next";
import NavBar from "../ui/nav-bar";
import Footer from "../ui/footer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Read Turn Royal's Terms and Conditions covering orders, digital downloads, canvas purchases, refunds, shipping, website use and customer responsibilities.",
};

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="flex-1 min-h-screen max-w-[680px] mx-auto px-4 py-10 bg-background text-foreground font-sans">
        <h1 className="font-serif font-black italic text-3xl md:text-4xl mb-8 text-foreground">
          Terms of Service
        </h1>
        <div className="space-y-6 text-sm leading-6 text-muted-foreground">
          <p>Last updated: August 6, 2026</p>
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              1. Overview
            </h2>
            <p>
              Throughout this website, <strong>turnroyal.com</strong> (the
              “Site”, “Turn Royal”, “we”, “us”, or “our”), the terms “you” and
              “your” refer to the user of the Site.
            </p>
            <p className="mt-2">
              By accessing or using the Site, you agree to be bound by these
              Terms of Service and all applicable laws and regulations. If you
              do not agree with any part of these terms, you must not use the
              Site.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              2. Service Description
            </h2>
            <p>
              Turn Royal provides an AI-powered portrait generation service. You
              upload one or more photographs, our artificial intelligence system
              (powered by OpenRouter and Replicate) transforms them into royal
              and Renaissance-style portraits, and you can preview watermarked
              versions for free. You may then purchase digital downloads of
              unwatermarked portraits, or order physical fine art prints —
              canvases.
            </p>
            <p className="mt-2">
              We reserve the right to modify, suspend, or discontinue the
              service (or any part thereof) at any time without prior notice. We
              shall not be liable to you or any third party for any
              modification, suspension, or discontinuance of the service.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              3. Sessions and Accounts
            </h2>
            <p>
              Our service operates on an anonymous, session-based model. You do
              not need to create an account to upload photos, generate
              portraits, or make purchases. An anonymous session is created
              automatically when you visit the Site and is maintained via a
              browser cookie.
            </p>
            <p className="mt-2">
              Your session is linked to your uploads, generations, and orders.
              If you clear your cookies or use a different device, you may lose
              access to your session. Preview URLs are persistent and can be
              bookmarked or shared.
            </p>
            <p className="mt-2">
              An email address is collected during the checkout process (via
              Stripe) and is used for order confirmations, download links, and
              shipping updates. You are responsible for providing an accurate
              email address.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              4. Uploaded Content &amp; Your Responsibility
            </h2>
            <p>
              You retain all ownership rights to the photographs you upload to
              the Site. By uploading photos, you grant us a limited,
              non-exclusive, royalty-free license to use, process, store, and
              transmit those photos solely for the purpose of providing the
              portrait generation service to you.
            </p>
            <h3 className="font-semibold text-foreground mt-4 mb-1">
              4.1 Your Representations and Warranties
            </h3>
            <p>
              You represent, warrant, and covenant that, for every photograph
              you upload to the Site:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                <strong>Age of uploader.</strong> You are at least 18 years of
                age (or the age of majority in your jurisdiction, if higher) and
                you have the legal capacity to agree to these Terms.
              </li>
              <li>
                <strong>Legal right to upload.</strong> You either took the
                photo yourself, own it outright, or have obtained all necessary
                licenses, permissions, releases, and consents from the
                photographer, copyright holder, and any other rights holders to
                upload it and have it processed by an AI portrait generation
                service.
              </li>
              <li>
                <strong>Consent of every person depicted.</strong> You have
                obtained the express consent of every identifiable individual
                shown in the photo (or, where the individual is a minor, from
                their parent or legal guardian) to have their likeness uploaded,
                processed by AI, transformed into a portrait, and — if
                applicable — printed and shipped.
              </li>
              <li>
                <strong>Photos of minors.</strong> You will only upload photos
                of children (anyone under 18, or under the age of majority in
                your jurisdiction) where you are the parent or legal guardian of
                every child depicted, or you have obtained written consent from
                every such parent or legal guardian. You will{" "}
                <strong>never</strong> upload photos of minors who are not your
                own children or wards.
              </li>
              <li>
                <strong>No nudity, sexual, or exploitative content.</strong> The
                photos contain no nudity, partial nudity, sexually suggestive
                content, or any content that sexualises, exploits, or endangers
                any person — and absolutely no such content involving minors
                under any circumstances. Uploading any sexual or exploitative
                content involving a minor is a serious crime and will be
                reported to the appropriate authorities.
              </li>
              <li>
                <strong>No illegal or harmful content.</strong> The photos do
                not depict, promote, or facilitate violence, self-harm, hate
                speech, harassment, terrorism, illegal activity, or any content
                that is defamatory, threatening, or otherwise unlawful.
              </li>
              <li>
                <strong>No infringement.</strong> The photos do not infringe
                upon any third party&apos;s intellectual property rights,
                privacy rights, publicity rights, moral rights, or any other
                legal or contractual rights.
              </li>
              <li>
                <strong>No deceptive or impersonating use.</strong> You will not
                upload photos with the intent to impersonate another person,
                deceive others, create non-consensual deepfakes, or generate
                portraits of public figures, celebrities, or other individuals
                without their consent.
              </li>
            </ul>
            <h3 className="font-semibold text-foreground mt-4 mb-1">
              4.2 Sole Responsibility
            </h3>
            <p>
              You are <strong>solely and exclusively responsible</strong> for
              every photograph you upload and for ensuring that your use of the
              service complies with all applicable laws (including, without
              limitation, copyright law, child protection law, data protection
              and privacy law, and the laws of your country of residence).
            </p>
            <p className="mt-2">
              Turn Royal does not pre-screen, review, or moderate every uploaded
              photo. We do not endorse, verify, or assume responsibility for any
              user-uploaded content, and we accept{" "}
              <strong>no liability whatsoever</strong> for any photo you upload,
              for any consequence of uploading it, or for any portrait generated
              from it. Any harm, claim, fine, prosecution, civil liability, or
              other consequence arising from an upload that breaches this
              Section 4 is entirely your own.
            </p>
            <p className="mt-2">
              You agree to fully indemnify, defend, and hold us harmless from
              and against any and all claims, damages, losses, costs, and
              expenses (including reasonable legal fees) arising from or related
              to any upload you make in breach of these Terms, in accordance
              with Section 10 (Indemnification) below.
            </p>
            <h3 className="font-semibold text-foreground mt-4 mb-1">
              4.3 Retention and Deletion of Uploaded Photos
            </h3>
            <p>
              We retain uploaded photographs indefinitely, but may delete them
              periodically. You may request immediate deletion of your photos at
              any time by emailing{" "}
              <Link
                href="mailto:hello@turnroyal.com"
                className="text-primary hover:underline"
              >
                hello@turnroyal.com
              </Link>
              . For the complete retention schedule, see Section 3 of our{" "}
              <Link className="text-primary hover:underline" href="/privacy">
                Privacy Policy
              </Link>
              .
            </p>
            <h3 className="font-semibold text-foreground mt-4 mb-1">
              4.4 Our Right to Remove Content and Terminate Access
            </h3>
            <p>
              We reserve the right, at our sole discretion and without prior
              notice, to refuse, remove, or block any upload or generated
              portrait that we believe — even on suspicion — violates these
              Terms or any applicable law. We may terminate your session, refuse
              service, retain evidence, and report the matter to law enforcement
              or to any other competent authority. Where suspected child sexual
              abuse material (CSAM) or similar content is involved, we will
              report it to the relevant authorities (such as NCMEC and the local
              equivalent in our jurisdiction) and cooperate fully with any
              investigation.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              5. Generated Content and Intellectual Property
            </h2>
            <p>
              Upon completing a purchase for a generated portrait, you receive a
              personal-use license for the unwatermarked version of that
              portrait. This means you may:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                Download, print, and display the portrait for personal,
                non-commercial use.
              </li>
              <li>
                Share the portrait on social media and with friends and family.
              </li>
              <li>Use the portrait as a gift.</li>
            </ul>
            <p className="mt-2">
              You may <strong>not</strong>, without our prior written
              permission:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                Resell, sublicense, or redistribute the generated portrait.
              </li>
              <li>
                Use the portrait for commercial purposes (e.g., merchandise,
                advertising).
              </li>
              <li>
                Claim the AI-generated artwork as your own original creation for
                commercial gain.
              </li>
            </ul>
            <p className="mt-2">
              Watermarked preview images are provided for evaluation purposes
              only. The watermark is permanently embedded in the image pixels
              and may not be removed, obscured, or circumvented. Unpurchased
              watermarked previews remain the property of Turn Royal.
            </p>
            <p className="mt-2">
              All other content on the Site, including but not limited to the
              design, layout, text, graphics, logos, and software, is the
              property of Turn Royal and is protected by applicable intellectual
              property laws.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              6. Pricing, Payments, and Refunds
            </h2>
            <h3 className="font-semibold text-foreground mt-4 mb-1">
              6.1 Pricing
            </h3>
            <p>
              All prices are displayed in Australian Dollars (AUD) and are
              inclusive of applicable taxes unless otherwise stated. We reserve
              the right to change prices at any time without notice. Price
              changes do not affect orders that have already been completed.
            </p>
            <h3 className="font-semibold text-foreground mt-4 mb-1">
              6.2 Payments
            </h3>
            <p>
              All payments are processed securely through Stripe. We do not
              store your payment card information on our servers. By making a
              purchase, you agree to Stripe&apos;s{" "}
              <Link
                href="https://stripe.com/legal"
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                terms of service
              </Link>
              . You are responsible for any fees charged by your bank or payment
              provider (e.g., currency conversion fees).
            </p>
            <h3 className="font-semibold text-foreground mt-4 mb-1">
              6.3 Digital Downloads
            </h3>
            <p>
              Digital downloads are delivered shortly after successful payment
              via a download link. Due to the nature of digital goods, refunds
              for digital downloads are generally not available. If you
              experience technical issues with your download, please contact us
              at{" "}
              <Link
                href="mailto:hello@turnroyal.com"
                className="text-primary hover:underline"
              >
                hello@turnroyal.com
              </Link>{" "}
              and we will work to resolve the issue.
            </p>
            <h3 className="font-semibold text-foreground mt-4 mb-1">
              6.4 Physical Prints: Canvases
            </h3>
            <p>
              For physical products (fine art prints: canvases), refunds or
              replacements are available under the following conditions:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                <strong>Before production:</strong> You may cancel your order
                and receive a full refund by contacting us before the item
                enters production.
              </li>
              <li>
                <strong>Damaged or defective:</strong> If your order arrives
                damaged or with a manufacturing defect, contact us within 14
                days of receipt with photos of the damage. We may provide a
                replacement or full refund at no additional cost.
              </li>
              <li>
                <strong>Dissatisfied with quality:</strong> If you are unhappy
                with the print quality, contact us within 14 days of receipt.
                Refunds for quality concerns are handled on a case-by-case
                basis.
              </li>
            </ul>
            <p className="mt-2">
              We do not accept returns for physical products unless they are
              damaged or defective. Custom-made products (which include all our
              AI-generated portraits printed to order) are exempt from the
              standard EU right of withdrawal under Article 16(c) of the
              Consumer Rights Directive.
            </p>
            <h3 className="font-semibold text-foreground mt-4 mb-1">
              6.5 Shipping &amp; Delivery
            </h3>
            <p>
              We print, package, and ship orders worldwide. Once your portrait
              has been printed and tracking becomes available, you will receive
              an email with the tracking details.
            </p>
            <p className="mt-2">
              Our standard shipping timeframe is 5–10 business days. Please note
              that while we do our best to ensure timely dispatch, we are unable
              to take responsibility for delays caused by the shipping carrier.
              In such cases, we recommend contacting the courier directly with
              your tracking number for the most accurate updates.
            </p>
            <p className="mt-2">
              By making a purchase on our website, you acknowledge and agree
              that Turn Royal is not obligated to provide a refund, correction,
              or reprint of the generated artwork if you contact us or raise a
              dispute more than 14 days after delivery, or more than 14 days
              from the date you received the digital file download link in the
              case of a digital download purchase.
            </p>
            <p className="mt-2">
              We kindly ask that you carefully review the quality of the
              physical canvas, framed canvas, or digital download before
              purchasing and inspect your order promptly upon delivery. If you
              experience any issues with your order, please contact us
              immediately at{" "}
              <Link
                href="mailto:hello@turnroyal.com"
                className="text-primary hover:underline"
              >
                hello@turnroyal.com
              </Link>
              .
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              7. Prohibited Use
            </h2>
            <p>You agree not to use the Site or service to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                Upload photos of individuals without their consent or knowledge.
              </li>
              <li>
                Upload content that is illegal, obscene, defamatory,
                threatening, harassing, or otherwise objectionable.
              </li>
              <li>
                Upload content depicting minors in any inappropriate context.
              </li>
              <li>
                Generate portraits intended to harass, defame, or deceive
                others.
              </li>
              <li>
                Attempt to circumvent, remove, or alter watermarks or other
                security measures.
              </li>
              <li>
                Attempt to access unwatermarked images without completing a
                valid purchase.
              </li>
              <li>
                Use automated tools, bots, scrapers, or similar technology to
                access or interact with the service.
              </li>
              <li>
                Overload, disrupt, or interfere with the service or its
                underlying infrastructure.
              </li>
              <li>
                Reverse-engineer, decompile, or attempt to extract the source
                code of the service.
              </li>
              <li>
                Use the service for any purpose that violates applicable laws or
                regulations.
              </li>
            </ul>
            <p className="mt-2">
              We reserve the right to terminate your session, block your access,
              and remove your content if we determine, in our sole discretion,
              that you have violated these terms.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              8. AI-Generated Content Disclaimer
            </h2>
            <p>
              Our portraits are generated by artificial intelligence and may not
              perfectly replicate the appearance of subjects in uploaded photos.
              AI outputs may contain artifacts, inconsistencies, or unexpected
              variations. We do not guarantee that any generated portrait will
              meet your expectations or be suitable for any particular purpose.
            </p>
            <p className="mt-2">
              You may use the free watermarked preview to evaluate the output
              before making a purchase. The “edit” feature allows you to
              generate additional variations at no cost. We encourage you to use
              these tools to ensure satisfaction before purchasing.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              9. Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by applicable law, Turn Royal and
              its officers, directors, employees, agents, and affiliates shall
              not be liable for any indirect, incidental, special,
              consequential, or punitive damages, including but not limited to
              loss of profits, data, or goodwill, arising out of or in
              connection with your use of the Site or service.
            </p>
            <p className="mt-2">
              Our total aggregate liability to you for all claims arising out of
              or relating to these Terms or the service shall not exceed the
              total amount you have paid to us in the twelve (12) months
              preceding the event giving rise to the claim.
            </p>
            <p className="mt-2">
              The service is provided “as is” and “as available” without
              warranties of any kind, whether express or implied, including but
              not limited to implied warranties of merchantability, fitness for
              a particular purpose, and non-infringement.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              10. Indemnification
            </h2>
            <p>
              You agree to indemnify, defend, and hold harmless Turn Royal and
              its officers, directors, employees, and agents from and against
              any claims, liabilities, damages, losses, and expenses (including
              reasonable legal fees) arising out of or in any way connected
              with: (a) your use of the service; (b) your uploaded content; (c)
              your violation of these Terms; or (d) your violation of any rights
              of a third party.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              11. Third-Party Links and Services
            </h2>
            <p>
              The Site may contain links to third-party websites or services
              (such as Stripe for payments). We are not responsible for the
              content, privacy practices, or availability of these third-party
              services. Your use of third-party services is at your own risk and
              subject to their respective terms and conditions.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              12. Online Data Collection, Analytics, and Advertising
              Technologies
            </h2>
            <p>
              When you visit or use the Site, we and third-party analytics and
              advertising partners acting on our behalf (including Vercel, Meta,
              and TikTok) collect information about your device and your
              interactions with the Site in real time using cookies, pixels, and
              similar technologies, as described in our{" "}
              <Link className="text-primary hover:underline" href="/privacy">
                Privacy Policy
              </Link>
              . This information may include the pages you view, the actions you
              take on the Site (such as generating a portrait preview or
              starting a checkout), your device and browser characteristics,
              your IP address, identifiers stored in cookies, and — where you
              provide it — your email address. Some of these services may
              reproduce or replay your interactions with the Site (such as mouse
              movements, clicks, scrolling, and the pages displayed to you) to
              help us diagnose usability issues and improve the service; these
              tools are configured to exclude your uploaded photos, generated
              portraits, and text you type into forms.
            </p>
            <p className="mt-2">
              By using the Site with notice of these Terms and our Privacy
              Policy, or by accepting cookies or tracking where a consent choice
              is presented to you, you expressly consent to this collection,
              recording, interception, and disclosure of your interaction data
              by us and the partners named in our Privacy Policy, to the fullest
              extent permitted by applicable law, including — without limitation
              — the California Invasion of Privacy Act and comparable state and
              federal statutes. If you do not consent, you must discontinue use
              of the Site, decline tracking where a choice is offered, or use
              browser-level controls (such as blocking third-party cookies or
              enabling Global Privacy Control) to limit this collection. You can
              read more about your choices, including how to opt out of the
              disclosure of personal information for advertising purposes, in
              our{" "}
              <Link className="text-primary hover:underline" href="/privacy">
                Privacy Policy
              </Link>
              .
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              13. Severability
            </h2>
            <p>
              If any provision of these Terms is found to be unlawful, void, or
              unenforceable, that provision shall be deemed severable and shall
              not affect the validity and enforceability of the remaining
              provisions.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              14. Changes to These Terms
            </h2>
            <p>
              We reserve the right to update or modify these Terms of Service at
              any time. Changes will be effective immediately upon posting the
              revised terms on this page with an updated “Last updated” date.
              Your continued use of the Site after any changes constitutes your
              acceptance of the revised terms. We encourage you to review these
              Terms periodically.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              15. Contact Information
            </h2>
            <p>
              For questions, concerns, or complaints regarding these Terms of
              Service, please contact us:
            </p>
            <ul className="list-none mt-2 space-y-1">
              <li>
                <strong>Email:</strong>{" "}
                <Link
                  href="mailto:hello@turnroyal.com"
                  className="text-primary hover:underline"
                >
                  hello@turnroyal.com
                </Link>
              </li>
              <li>
                <strong>Website:</strong> turnroyal.com
              </li>
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
