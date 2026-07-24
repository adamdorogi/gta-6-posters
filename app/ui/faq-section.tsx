import FaqItem from "./faq-item";

export default function FaqSection() {
  return (
    <section id="qa" className="px-6 py-16 mx-auto bg-muted w-full">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl md:text-4xl font-serif italic font-black text-foreground mb-4">
          Questions & <span className="text-accent-dark">Answers</span>
        </h2>
        <div className="mt-10 mx-auto max-w-3xl text-left">
          <FaqItem
            question="How does it work?"
            answer="Upload your photo, pick a style, and our AI creates your portrait in seconds. Free preview — no card needed."
          />
          <FaqItem
            question="Is my photo good enough?"
            answer="Any well-lit photo works great. We recommend clear, front-facing photos for best results. Both phone and camera photos work perfectly."
          />
          <FaqItem
            question="What are credits?"
            answer="Credits let you generate AI portraits. You get free credits to start, which refresh every 12 hours. Each generation uses one credit."
          />
          <FaqItem
            question="How to edit the preview?"
            answer="You can click the “Edit” button to regenerate the portrait, with the option to change the portrait style or provide specific instructions and adjustments you would like made to the artwork. Please make sure your instructions are direct, clear, and detailed so the system can better understand what changes need to be made."
          />
          <FaqItem
            question="Can I include pets or groups?"
            answer="Absolutely! We support pets, couples, families, and groups. Just upload a photo with everyone in it and choose the right category."
          />
          <FaqItem
            question="How will the final portrait look?"
            answer="Your final physical canvas will be printed vertically and will look the same as the preview you are purchasing. Please note that, during the canvas wrapping process, the outer edges of the artwork are wrapped around the sides of the canvas frame. Because of this, a small portion near the edges of the image may not be fully visible from the front once printed. Aside from this standard canvas wrapping adjustment, the final portrait will match the preview shown. If you have any questions or would like confirmation of how your final portrait will appear before printing, please contact our customer support team at hello@turnroyal.com."
          />
          <FaqItem
            question="Digital File vs Physical Canvas – What’s the Difference?"
            answer="Please note that digital files will usually appear more vibrant, brighter, and more colorful when viewed on screens such as phones, computers, tablets, or laptops. This is because every screen has its own color calibration, brightness, and display settings, which can enhance how colors appear digitally. Physical canvases are professionally printed, but printed colors naturally appear slightly different compared to backlit digital screens. As a result, the physical canvas may look a bit darker or less vibrant than the digital preview you see on your device. This is a normal difference between digital displays and printed materials and applies to most printed artwork and photography products."
          />
          <FaqItem
            question="How long does delivery take?"
            answer="Digital downloads are instant after purchase. Canvas prints are sent to production after purchase and the delivery takes 5-10 business days with standard shipping."
          />
          <FaqItem
            question="What's the refund policy after the portrait is delivered?"
            answer="We want to ensure that you are happy with your portrait. However, if you are not satisfied with the received item, please contact our customer support team at hello@turnroyal.com within 14 days of delivery so we can assist you further."
          />
          <FaqItem
            question="The portrait damaged or lost?"
            answer="Please contact our customer support team at hello@turnroyal.com within 14 days of delivery if you would like to request a replacement. Kindly make sure to include clear photos showing the issue so we can assist you further."
          />
          <FaqItem
            question="What are the prices?"
            answer="You can find the prices and offers for our products once you create your free preview and scroll down."
          />
        </div>
      </div>
    </section>
  );
}
