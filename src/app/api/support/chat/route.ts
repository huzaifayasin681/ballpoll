import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { statusLabels } from "@/lib/orders";
import { site } from "@/lib/site";

export async function POST(req: NextRequest) {
  const { message } = (await req.json().catch(() => ({}))) as { message?: string };
  const q = (message ?? "").trim();
  if (!q) return NextResponse.json({ reply: "Ask a question and I'll do my best to help." });

  // Direct order ID lookup (status only; full details stay behind the verified /track form)
  const idMatch = q.toUpperCase().match(/GPS-[A-Z0-9]{6}/);
  if (idMatch) {
    const order = await db.order.findUnique({ where: { trackingId: idMatch[0] }, select: { status: true, updatedAt: true } });
    if (!order) {
      return NextResponse.json({ reply: `I couldn't find an order with ID ${idMatch[0]}. Double-check the code or use the Track Order page.` });
    }
    return NextResponse.json({
      reply: `Order ${idMatch[0]} is currently: ${statusLabels[order.status]}.\nFor the full timeline, open /track and verify with your email or Unique ID.`,
    });
  }

  const lower = q.toLowerCase();
  if (lower.includes("human") || lower.includes("agent") || lower.includes("person") || lower.includes("whatsapp")) {
    return NextResponse.json({
      reply: `You can reach our team 24/7:\n• Email: ${site.supportEmail}\n• WhatsApp: ${site.whatsapp}\n• Telegram: ${site.telegram}\nOr open a ticket at /help#contact.`,
    });
  }

  // Keyword match against FAQ entries
  const faqs = await db.faqItem.findMany();
  const words = lower.split(/\W+/).filter((w) => w.length > 2);
  let best: { score: number; answer: string } = { score: 0, answer: "" };
  for (const f of faqs) {
    const hay = `${f.question} ${f.answer}`.toLowerCase();
    const score = words.reduce((s, w) => s + (hay.includes(w) ? (f.question.toLowerCase().includes(w) ? 3 : 1) : 0), 0);
    if (score > best.score) best = { score, answer: f.answer };
  }
  if (best.score > 0) return NextResponse.json({ reply: best.answer });

  return NextResponse.json({
    reply:
      "Here's what I can help with right away:\n• Paste your Order ID (GPS-XXXXXX) for a quick status check\n• Ask about delivery times, finding your Unique ID, refunds, or loyalty points\n• Or open /help#contact to reach a person.",
  });
}
