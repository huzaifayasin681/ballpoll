import { Suspense } from "react";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { Container, PageFallback } from "@/components/ui/primitives";
import { JsonLd } from "@/components/json-ld";
import { ClubhousePageHero } from "@/components/clubhouse/page-hero";
import { HelpClient } from "@/components/support/help-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help & Support",
  description: "Search the help centre or talk to a person. We are online 24/7.",
};

async function getFaqs() {
  "use cache";
  cacheLife("hours");
  cacheTag("catalog");
  return db.faqItem.findMany({ orderBy: { sortOrder: "asc" } });
}

export default function HelpPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <HelpBody />
    </Suspense>
  );
}

async function HelpBody() {
  const [faqs, user] = await Promise.all([getFaqs(), getCurrentUser()]);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <div className="bg-cream pb-16">
      <JsonLd data={faqSchema} />
      <ClubhousePageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Help" }]}
        eyebrow="SUPPORT"
        title="How can we help?"
        subtitle="Search the help centre or talk to a person. We are online 24/7."
      />

      <Container className="mt-8">
        <HelpClient
          faqs={faqs.map((f) => ({
            id: f.id,
            question: f.question,
            answer: f.answer,
            category: f.category,
          }))}
          defaultName={user?.name ?? ""}
          defaultEmail={user?.email ?? ""}
        />
      </Container>
    </div>
  );
}
