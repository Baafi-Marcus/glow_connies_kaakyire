"use client";

import Link from "next/link";
import { ChevronLeftIcon, ScaleIcon } from "@heroicons/react/24/outline";

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto py-20 px-6 space-y-12">
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-brand-plum dark:text-brand-rosegold hover:translate-x-[-4px] transition-transform">
        <ChevronLeftIcon className="w-5 h-5" /> Back to Boutique
      </Link>

      <section className="space-y-6">
        <h1 className="text-5xl md:text-7xl font-serif italic text-brand-plum dark:text-brand-rosegold leading-tight">Terms of <br /> Service.</h1>
        <p className="text-gray-400 font-light text-xl">Last Updated: April 2026</p>
      </section>

      <div className="prose prose-lg dark:prose-invert max-w-none space-y-12 text-gray-700 dark:text-gray-300">
        <section className="space-y-4">
          <h2 className="text-2xl font-serif text-brand-plum dark:text-brand-rosegold">1. Agreement to Terms</h2>
          <p>By accesssing this boutique and placing an order, you agree to be bound by these luxury service terms. Glow by Connie provides premium beauty products delivered across Ghana.</p>
        </section>

        <section className="space-y-4 p-8 bg-gray-50 dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-serif text-brand-plum dark:text-brand-rosegold flex items-center gap-3">
            <ScaleIcon className="w-6 h-6" /> 2. Return & Refund Policy
          </h2>
          <p className="font-bold underline decoration-brand-rosegold decoration-2 underline-offset-4 mb-4">Pure Radiance Guarantee:</p>
          <ul className="list-disc pl-6 space-y-4">
            <li className="font-semibold text-brand-plum dark:text-brand-rosegold">We offer a 7-day return policy for all products.</li>
            <li>For health and hygiene reasons, <span className="font-black italic">Perfumes and Cosmetics</span> must be returned **unopened, with the original plastic wrap intact** and the product in its original condition.</li>
            <li>Handbags must have original tags and no visible signs of use.</li>
            <li>Refunds will be processed via Mobile Money or Store Credit once the item has been inspected by our team.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-serif text-brand-plum dark:text-brand-rosegold">3. Delivery & Ordering</h2>
          <p>Orders are finalized via WhatsApp for personalized care. While we strive for same-day delivery in Accra, regional shipping to Kumasi, Takoradi, etc., may take 24-72 hours. Delivery fees are non-refundable once an item has been dispatched.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-serif text-brand-plum dark:text-brand-rosegold">4. Authenticity</h2>
          <p>Glow by Connie guarantees the authenticity of all global brands sold. We do not sell replicates or &quot;tester-only&quot; versions advertised as full retail products.</p>
        </section>

        <section className="space-y-4 pt-10 border-t border-gray-100 dark:border-gray-800">
          <p className="text-sm italic text-gray-400 text-center">Thank you for choosing Glow by Connie. Elevate your glow with confidence.</p>
        </section>
      </div>
    </div>
  );
}
