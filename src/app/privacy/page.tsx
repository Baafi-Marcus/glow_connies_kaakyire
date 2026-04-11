"use client";

import Link from "next/link";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto py-20 px-6 space-y-12">
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-brand-plum dark:text-brand-rosegold hover:translate-x-[-4px] transition-transform">
        <ChevronLeftIcon className="w-5 h-5" /> Back to Boutique
      </Link>

      <section className="space-y-6">
        <h1 className="text-5xl md:text-7xl font-serif italic text-brand-plum dark:text-brand-rosegold leading-tight">Privacy <br /> Policy.</h1>
        <p className="text-gray-400 font-light text-xl">Last Updated: April 2026</p>
      </section>

      <div className="prose prose-lg dark:prose-invert max-w-none space-y-10 text-gray-700 dark:text-gray-300">
        <section className="space-y-4">
          <h2 className="text-2xl font-serif text-brand-plum dark:text-brand-rosegold">1. Introduction</h2>
          <p>Welcome to Glow by Connie. We respect your privacy and are committed to protecting the personal data we collect during your luxury shopping experience with us in Ghana.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-serif text-brand-plum dark:text-brand-rosegold">2. Data We Collect</h2>
          <p>When you browse our catalog or place an order via WhatsApp, we may collect:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Name and contact details (WhatsApp number).</li>
            <li>Delivery address in Accra, Kumasi, or other regions.</li>
            <li>Purchase history and beauty preferences.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-serif text-brand-plum dark:text-brand-rosegold">3. How We Use Data</h2>
          <p>We use your information exclusively to provide premium service, including:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Fulfilling your orders and arranging delivery.</li>
            <li>Communicating product availability and new perfume arrivals.</li>
            <li>Ensuring a personalized shopping experience.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-serif text-brand-plum dark:text-brand-rosegold">4. Data Security</h2>
          <p>Since our orders are processed via WhatsApp, your payment data (Mobile Money or Cash on Delivery) is handled securely through individual encrypted sessions. We do not store your financial details on our servers.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-serif text-brand-plum dark:text-brand-rosegold">5. Contact Us</h2>
          <p>If you have questions about your data, please message us directly on WhatsApp as you would for an order.</p>
        </section>
      </div>
    </div>
  );
}
