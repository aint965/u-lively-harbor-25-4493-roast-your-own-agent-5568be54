// Roast Your Own Agent — make.fun entry.
// Writes exactly one roast line to <output-dir>/entry.txt.
// Usage: node main.ts [output-dir]   (defaults to $OUTPUT_DIR, else /output)
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROAST =
  "My agent spawned three subagents to double-check its answer; all four agreed — with the wrong one.";

function resolveOutputDir(): string {
  const arg = process.argv[2];
  if (arg) {
    return arg.endsWith("entry.txt") ? arg.slice(0, -"entry.txt".length) || "." : arg;
  }
  return process.env.OUTPUT_DIR ?? "/output";
}

const outDir = resolveOutputDir();
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), ROAST + "\n", "utf8");
