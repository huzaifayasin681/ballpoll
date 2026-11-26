import { MessageCircle } from "lucide-react";
import { site, whatsappLink } from "@/lib/site";
import { cn } from "@/lib/utils";

type WhatsAppCtaProps = {
  message: string;
  label?: string;
  showNumber?: boolean;
  size?: "sm" | "md";
  className?: string;
};

/**
 * Branded green WhatsApp call-to-action link with pre-filled inquiry message.
 */
export function WhatsAppCta({
  message,
  label = "WhatsApp",
  showNumber = false,
  size = "md",
  className,
}: WhatsAppCtaProps) {
  return (
    <a
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-[2px] border border-felt bg-felt font-semibold uppercase tracking-[0.14em] text-paper outline -outline-offset-[4px] outline-1 outline-brass/50 transition-all duration-150 hover:bg-felt-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-felt/40",
        size === "sm" ? "h-9 px-3.5 text-[11px]" : "h-10 sm:h-11 px-4 sm:px-5 text-xs",
        className,
      )}
    >
      <MessageCircle className={size === "sm" ? "h-3.5 w-3.5 shrink-0" : "h-4 w-4 shrink-0"} />
      <span>{showNumber ? `${label} ${site.whatsapp}` : label}</span>
    </a>
  );
}
