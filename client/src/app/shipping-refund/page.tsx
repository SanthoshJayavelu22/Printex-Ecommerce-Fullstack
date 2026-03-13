import PolicyLayout from '@/components/PolicyLayout';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ShippingRefund() {
  return (
    <>
      <Header />
      <PolicyLayout title="Shipping & Refunds">
        <section>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">01. Shipping Timeline</h2>
          <p>Orders are typically processed within 2-3 business days. Shipping times vary based on your location and the shipping method selected at checkout.</p>
        </section>
        <section>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">02. Return Policy</h2>
          <p>Since our products are custom-made, we do not accept returns unless the product is defective or damaged upon arrival.</p>
        </section>
        <section>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">03. Refund Process</h2>
          <p>If you receive a damaged product, please contact us within 48 hours with proof of damage. Approved refunds will be processed to your original payment method within 7-10 business days.</p>
        </section>
      </PolicyLayout>
      <Footer />
    </>
  );
}
