"use client";

export function DownloadReceiptButton({
  trackingId,
  itemsSummary,
  uniqueId,
  totalText,
  placedAt,
}: {
  trackingId: string;
  itemsSummary: string;
  uniqueId: string;
  totalText: string;
  placedAt: string;
}) {
  function download() {
    const content = [
      "GLOBALPOOLSTORE — THE CLUBHOUSE RECEIPT",
      "========================================",
      `Order ID:   ${trackingId}`,
      `Placed:     ${placedAt}`,
      `Items:      ${itemsSummary}`,
      `Unique ID:  ${uniqueId || "N/A"}`,
      `Total Paid: ${totalText}`,
      "========================================",
      "Thank you for shopping at GlobalPoolStore.",
    ].join("\n");

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${trackingId}-receipt.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      type="button"
      onClick={download}
      className="inline-flex h-10 cursor-pointer items-center justify-center rounded-[2px] border border-[#D4C9B2] bg-paper px-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink transition hover:border-brass"
    >
      Download receipt
    </button>
  );
}
