import { NextRequest } from "next/server";
import { lookupOrder, statusLabels } from "@/lib/orders";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id") ?? "";
  const v = req.nextUrl.searchParams.get("v") ?? "";
  const initial = await lookupOrder(id, v);
  if (!initial) return new Response("Not found", { status: 404 });

  const encoder = new TextEncoder();
  let timer: ReturnType<typeof setInterval> | null = null;
  const stream = new ReadableStream({
    start(controller) {
      const send = async () => {
        try {
          const o = await lookupOrder(id, v);
          if (!o) return;
          const payload = {
            status: o.status,
            statusLabel: statusLabels[o.status],
            events: o.events.map((e) => ({ id: e.id, status: e.status, message: e.message, createdAt: e.createdAt })),
          };
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
        } catch {}
      };
      send();
      timer = setInterval(send, 5000);
    },
    cancel() {
      if (timer) clearInterval(timer);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
