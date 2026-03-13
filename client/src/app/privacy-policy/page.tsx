import PolicyLayout from '@/components/PolicyLayout';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PrivacyPolicy() {
  return (
    <>
      <Header />
      <PolicyLayout title="Privacy Policy">
        <section>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">01. Information We Collect</h2>
          <p>We collect information you provide directly to us, such as when you create an account, place an order, or communicate with us. This may include your name, email, phone number, and shipping address.</p>
        </section>
        <section>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">02. How We Use Your Data</h2>
          <p>We use your information to process orders, provide customer support, and send you updates about our services. We do not sell your personal data to third parties.</p>
        </section>
        <section>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">03. Security</h2>
          <p>We implement industry-standard security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.</p>
        </section>
      </PolicyLayout>
      <Footer />
    </>
  );
}
