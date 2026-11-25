// Verifies the entry: runs main.ts twice into two different output dirs,
// then checks the two entry.txt files are byte-identical, exactly one line,
// 1-140 characters, valid UTF-8, and not only whitespace.
import { execFileSync } from "node:child_process";
import { readFileSync, rmSync } from "node:fs";

const dirA = "/tmp/roast-verify-a";
const dirB = "/tmp/roast-verify-b";
for (const d of [dirA, dirB]) rmSync(d, { recursive: true, force: true });

execFileSync(process.execPath, ["main.ts", dirA], { stdio: "inherit" });
execFileSync(process.execPath, ["main.ts", dirB], { stdio: "inherit" });

const a = readFileSync(`${dirA}/entry.txt`);
const b = readFileSync(`${dirB}/entry.txt`);

const text = a.toString("utf8");
const roundTrip = Buffer.from(text, "utf8").equals(a); // valid UTF-8
const lines = text.split("\n");
const oneLine = lines.length === 2 && lines[1] === ""; // single line + trailing newline
const charCount = [...text.replace(/\n$/, "")].length;

console.log("byte-identical:", a.equals(b));
console.log("valid UTF-8:", roundTrip);
console.log("exactly one line:", oneLine);
console.log("characters (excl. trailing newline):", charCount);
console.log("in 1..140:", charCount >= 1 && charCount <= 140);
console.log("not only whitespace:", text.trim().length > 0);
console.log("line:", JSON.stringify(text.replace(/\n$/, "")));

const ok =
  a.equals(b) && roundTrip && oneLine && charCount >= 1 && charCount <= 140 && text.trim().length > 0;
if (!ok) {
  console.error("VERIFY FAILED");
  process.exit(1);
}
console.log("VERIFY OK");
