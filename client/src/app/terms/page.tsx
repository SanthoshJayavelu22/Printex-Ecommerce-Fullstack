import PolicyLayout from '@/components/PolicyLayout';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Terms() {
  return (
    <>
      <Header />
      <PolicyLayout title="Terms of Service">
        <section>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">01. Acceptance of Terms</h2>
          <p>By accessing and using this website, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
        </section>
        <section>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">02. Products & Services</h2>
          <p>We strive to provide accurate descriptions of our products. However, we do not warrant that product descriptions or other content are error-free.</p>
        </section>
        <section>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">03. User Conduct</h2>
          <p>You agree not to use our website for any unlawful purpose or in any way that could damage or disrupt our services.</p>
        </section>
      </PolicyLayout>
      <Footer />
    </>
  );
}
