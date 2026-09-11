// SPDX-FileCopyrightText: 2026 Example project contributors
// SPDX-License-Identifier: Example-1.0
// Utility copied verbatim from a third-party MIT-licensed project.
// The original carried no header; its provenance is not the Example project.
export function formatBytes(n) {
  const u = ["B", "KB", "MB", "GB"];
  let i = 0;
  while (n >= 1024 && i < u.length - 1) { n /= 1024; i++; }
  return n.toFixed(1) + " " + u[i];
}
