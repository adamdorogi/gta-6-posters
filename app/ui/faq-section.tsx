import { products } from "../utils/pricing";
import FaqItem from "./faq-item";

export default function FaqSection() {
  return (
    <section id="qa" className="px-4 py-10 md:py-16 mx-auto bg-muted w-full">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-serif italic font-black text-foreground mb-4 md:mb-6">
          Questions & <span className="text-accent-dark">Answers</span>
        </h2>
        <div className="mx-auto max-w-2xl text-left">
          <FaqItem
            question="How does it work?"
            answers={[
              "Upload your photo, choose a style, and see your portrait come to life in seconds. Free preview, no card or signup needed.",
            ]}
          />
          <FaqItem
            question="Digital File vs Physical Canvas: What’s the Difference?"
            answers={[
              "Your digital file is designed for viewing on screens, where colours may appear brighter and more vibrant due to screen brightness and settings.",
              "Your physical canvas is professionally printed to create a beautiful piece of artwork for your home. Printed colours can naturally appear slightly different from the digital preview, with a softer, more natural finish.",
              "This is a normal difference between digital displays and printed artwork. Your canvas is carefully produced to preserve the detail, character and quality of your portrait.",
            ]}
          />
          <FaqItem
            question="What are the prices?"
            answers={[
              `Our canvas portraits start from $${products.Small.price / 100}, and digital portraits are $${products.Digital.price / 100}. You’ll see the available sizes, offers, and your final options after creating your free preview. All prices are in Australian dollars.`,
            ]}
          />
          <FaqItem
            question="Is my photo good enough?"
            answers={[
              "Most photos work beautifully. For the best results, choose a clear, well-lit photo with your pet facing the camera. Phone photos are perfect too.",
            ]}
          />
          <FaqItem
            question="Can I include humans or groups?"
            answers={[
              "Absolutely! You can create portraits of pets, couples, families, and groups. Simply upload a photo with everyone included, choose your preferred style, and we’ll turn it into a timeless piece of artwork.",
              "Please note, if you include humans in your portrait, they may not look exactly like the original photo in the final artwork.",
            ]}
          />
          <FaqItem
            question="How can I edit my preview?"
            answers={[
              "Click the “Edit” button to create a new version of your portrait. You can choose a different style or add instructions to adjust details like the look, mood, or overall design. The more specific your request, the closer the final artwork will match your vision.",
            ]}
          />
          <FaqItem
            question="What are credits?"
            answers={[
              "Credits are used to create your portraits. You’ll receive free credits when you start, and they refresh every 12 hours. Each new portrait uses one credit.",
            ]}
          />
          <FaqItem
            question="How will the final portrait look?"
            answers={[
              "Your final portrait will look the same as the preview you approve before purchase.",
              "For canvas orders, the artwork is printed vertically and wrapped around the edges of the frame. This means a small portion of the outer image may continue around the sides and not be fully visible from the front.",
              "This is a standard canvas framing process. The main artwork and portrait details will match the preview shown.",
            ]}
          />
          <FaqItem
            question="How long does delivery take?"
            answers={[
              "Digital portraits are received within minutes after purchase. Canvas orders are carefully prepared after purchase and typically arrive within 5–10 business days with standard shipping.",
            ]}
          />
          <FaqItem
            question="Where is my portrait made?"
            answers={[
              "All portraits are produced in Victoria, Australia. Each canvas is printed on premium polycotton and finished with a New Zealand pinewood frame, creating a beautiful piece of artwork made to last.",
            ]}
          />
          <FaqItem
            question="What’s the refund policy after the portrait is delivered?"
            answers={[
              "We want you to love your portrait. If your order arrives and you’re not completely satisfied, please contact our support team at hello@turnroyal.com within 14 days of delivery. We’ll review your request and do our best to help resolve the issue.",
            ]}
          />
          <FaqItem
            question="What if my portrait arrives damaged or gets lost?"
            answers={[
              "We want your artwork to arrive safely. If your portrait is damaged or lost during delivery, please contact us at hello@turnroyal.com within 14 days and include photos of the issue so we can assist with a replacement.",
            ]}
          />
        </div>
      </div>
    </section>
  );
}
