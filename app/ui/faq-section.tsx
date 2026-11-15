import { formatPrice, products } from "../utils/pricing";
import { site } from "../utils/site";
import FaqItem from "./faq-item";

export default function FaqSection() {
  return (
    <section id="qa" className="site-section bg-background">
      <div className="site-container grid items-start gap-7 lg:grid-cols-[0.72fr_1.28fr] lg:gap-x-20">
        <h2 className="section-title">
          Questions &amp; <span className="text-primary">Answers</span>
        </h2>
        <div className="border-b border-border text-left">
          <FaqItem
            question="How do I make a GTA 6-style poster?"
            answers={[
              "Upload a photo, pick a style, and create your free preview. Once you’re happy with the artwork, order a printed poster or a digital download. You don’t need an account or payment card to preview your design.",
            ]}
          />
          <FaqItem
            question="What styles can I choose from?"
            answers={[
              "Cover Art arranges your subjects in comic-book panels. Character draws them in a cinematic Vice City scene. The Album sets them in a neon sunset with a soundtrack-cover layout.",
            ]}
          />
          <FaqItem
            question="Can I include friends, family, or pets?"
            answers={[
              "Yes. You can use a selfie, a couple’s photo, or a group photo. Pets can appear on their own or alongside people. Use clear photos where each subject’s face is visible.",
            ]}
          />
          <FaqItem
            question="What kind of photo works best?"
            answers={[
              "Choose a well-lit photo with visible facial features. An everyday phone photo works well. A clearer photo gives the illustrated poster a better chance of capturing your likeness.",
            ]}
          />
          <FaqItem
            question="How can I edit my preview?"
            answers={[
              "Click Edit to make another version. You can try a different art style or add a detail about the outfit, setting, or mood.",
            ]}
          />
          <FaqItem
            question="What are credits?"
            answers={[
              "Each new preview uses one credit. You get five free credits every 12 hours.",
            ]}
          />
          <FaqItem
            question="What’s the difference between a printed poster and a digital download?"
            answers={[
              "We print your artwork on glossy paper in A4, A3, A2, or A1 and ship it unframed. A high-resolution digital copy is included. You can also buy the file on its own and print it yourself.",
              "Both options remove the preview watermark. Printed colors can vary slightly from what you see on a screen.",
            ]}
          />
          <FaqItem
            question="How much does a custom poster cost?"
            answers={[
              `Printed posters start at ${formatPrice(products.Small.price)} and a digital download costs ${formatPrice(products.Digital.price)}. Prices are in USD. See the available sizes and total after creating your free preview.`,
            ]}
          />
          <FaqItem
            question="Where do you ship?"
            answers={[
              "Standard shipping is included to eligible destinations worldwide. Available destinations are shown at checkout. Delivery times vary, and we’ll email your tracking details once your poster ships.",
            ]}
          />
          <FaqItem
            question="When will I receive my digital download?"
            answers={[
              "We’ll email your download link once your finished file is ready. If you can’t find it, check your spam folder or get in touch.",
            ]}
          />
          <FaqItem
            question="What if there’s a problem with my poster?"
            answers={[
              `Email ${site.email} within 14 days of delivery if your poster arrives damaged or you’re unhappy with the print quality. Include your order number and photos of any damage so we can help. If your order hasn’t arrived, send us your tracking details.`,
            ]}
          />
        </div>
      </div>
    </section>
  );
}
