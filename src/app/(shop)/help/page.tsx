import { Suspense } from "react";
import type { Metadata } from "next";
import { Mail, MessageCircle, Send } from "lucide-react";
import { Badge, Card, Container, PageFallback, SectionHeading } from "@/components/ui/primitives";
import { TicketForm } from "@/components/support/ticket-form";
import { JsonLd } from "@/components/json-ld";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Help & Support Center (FAQ, Live Chat, Contact)",
  description: "24/7 customer support, frequently asked questions, WhatsApp, Telegram and ticket support.",
};

async function HelpBody() {
  const [faqs, user] = await Promise.all([db.faqItem.findMany({ orderBy: { sortOrder: "asc" } }), getCurrentUser()]);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  const channels = [
    { Icon: Mail, title: "Email Support", value: site.supportEmail, href: `mailto:${site.supportEmail}`, sub: "Replies within a few hours" },
    { Icon: MessageCircle, title: "WhatsApp Support", value: site.whatsapp, href: site.whatsappHref, sub: "24/7 live messaging" },
    { Icon: Send, title: "Telegram Desk", value: site.telegram, href: site.telegramHref, sub: "Direct support channel" },
  ];

  return (
    <Container className="space-y-12 py-10">
      <JsonLd data={faqSchema} />

      <SectionHeading
        title="Help & Customer Support"
        subtitle="Browse common answers below, use the Support Chat button in the bottom-right corner, or contact our team directly."
      />

      {/* Clickable contact channels */}
      <div className="grid gap-4 md:grid-cols-3">
        {channels.map(({ Icon, title, value, href, sub }) => (
          <a key={title} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
            <Card className="h-full p-5 transition-colors hover:border-border-hover">
              <Icon className="h-4 w-4 text-brand" />
              <p className="mt-2.5 text-sm font-semibold text-foreground">{title}</p>
              <p className="mt-0.5 font-mono text-xs text-brand">{value}</p>
              <p className="mt-1 text-xs text-muted">{sub}</p>
            </Card>
          </a>
        ))}
      </div>

      {/* FAQ */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Frequently Asked Questions</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {faqs.map((f) => (
            <Card key={f.id} className="p-4">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold text-foreground">{f.question}</h3>
                <Badge tone="gray">{f.category}</Badge>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted">{f.answer}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Contact ticket */}
      <section id="contact" className="scroll-mt-24">
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-foreground">Submit a Support Ticket</h2>
          <p className="mb-5 mt-1 text-xs text-muted">Include your Order ID (GPS-XXXXXX) if your request is about an existing purchase.</p>
          <TicketForm defaultEmail={user?.email} defaultName={user?.name} />
        </Card>
      </section>
    </Container>
  );
}

export default function HelpPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <HelpBody />
    </Suspense>
  );
}
