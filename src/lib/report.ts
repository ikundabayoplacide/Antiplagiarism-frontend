import type { ScanRecord } from "./types";

export function buildReportText(scan: ScanRecord): string {
  const date = new Date(scan.createdAt).toLocaleString();
  const lines = [
    "ANTI-PLAGIARISM SYSTEM — PLAGIARISM REPORT",
    "=".repeat(50),
    "",
    `Document: ${scan.fileName}`,
    `Date: ${date}`,
    `Algorithm: N-gram (trigram) analysis`,
    "",
    "SUMMARY",
    "-".repeat(30),
    `Plagiarism similarity: ${scan.plagiarismPercent}%`,
    `Original content: ${scan.originalPercent}%`,
    `Words analyzed: ${scan.wordCount}`,
    `Status: ${scan.status === "flagged" ? "FLAGGED" : "ORIGINAL"}`,
    "",
    "MATCHED PASSAGES",
    "-".repeat(30),
  ];

  if (scan.matchedSections.length === 0) {
    lines.push("No significant N-gram matches found.");
  } else {
    scan.matchedSections.forEach((m, i) => {
      lines.push("");
      lines.push(`${i + 1}. ${m.similarity}% match — Source: ${m.source}`);
      lines.push(`   "${m.text}"`);
    });
  }

  lines.push("", "=".repeat(50), "End of report");
  return lines.join("\n");
}

export function downloadScanReport(scan: ScanRecord) {
  const text = buildReportText(scan);
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${scan.fileName.replace(/\.[^.]+$/, "")}_plagiarism_report.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
