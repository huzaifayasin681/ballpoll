import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/generated/prisma/enums";

type Step = {
  numeral: string;
  label: string;
  time?: string;
  state: "done" | "active" | "upcoming";
};

export function RomanOrderStepper({
  status,
  events,
  estimatedText = "Est. 1–2 hrs",
}: {
  status: OrderStatus;
  events?: { status: OrderStatus; createdAt: string | Date }[];
  estimatedText?: string;
}) {
  const idxMap: Record<OrderStatus, number> = {
    PENDING_PAYMENT: 0,
    PAID: 1,
    PROCESSING: 2,
    COMPLETED: 3,
    REFUNDED: 0,
    CANCELLED: 0,
  };
  const activeIdx = idxMap[status] ?? 0;

  const findTime = (st: OrderStatus) => {
    const ev = events?.find((e) => e.status === st);
    if (!ev) return undefined;
    try {
      return new Date(ev.createdAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    } catch {
      return undefined;
    }
  };

  const steps: Step[] = [
    {
      numeral: "I",
      label: "Order placed",
      time: findTime("PENDING_PAYMENT") ?? "Placed",
      state: activeIdx > 0 ? "done" : activeIdx === 0 ? "active" : "upcoming",
    },
    {
      numeral: "II",
      label: "Payment confirmed",
      time: findTime("PAID") ?? (activeIdx >= 1 ? "Confirmed" : "Pending"),
      state: activeIdx > 1 ? "done" : activeIdx === 1 ? "active" : "upcoming",
    },
    {
      numeral: "III",
      label: "In progress",
      time: findTime("PROCESSING") ?? (activeIdx >= 2 ? "Active" : "Queue"),
      state: activeIdx > 2 ? "done" : activeIdx === 2 ? "active" : "upcoming",
    },
    {
      numeral: "IV",
      label: "Delivered",
      time: findTime("COMPLETED") ?? estimatedText,
      state: activeIdx >= 3 ? "done" : "upcoming",
    },
  ];

  return (
    <div className="relative py-2">
      {/* Connecting hairline */}
      <div className="absolute left-[12%] right-[12%] top-[23px] h-px bg-[#DDD3BE]" aria-hidden />
      <div className="relative grid grid-cols-4 gap-2 text-center">
        {steps.map((s) => (
          <div key={s.numeral} className="flex flex-col items-center">
            <div
              className={cn(
                "relative z-10 flex h-9 w-9 items-center justify-center rounded-full border text-xs font-serif font-semibold transition-colors",
                s.state === "done" && "border-felt bg-felt text-paper",
                s.state === "active" && "border-brass bg-brass text-mahogany shadow-xs",
                s.state === "upcoming" && "border-[#CBBFA6] bg-paper text-muted",
              )}
            >
              {s.state === "done" ? <Check className="h-4 w-4 stroke-[2.2]" /> : s.numeral}
            </div>
            <p className="mt-2 text-[11px] font-semibold leading-tight text-ink sm:text-xs">{s.label}</p>
            <p suppressHydrationWarning className="mt-0.5 text-[10px] text-muted sm:text-[11px]">
              {s.time}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
