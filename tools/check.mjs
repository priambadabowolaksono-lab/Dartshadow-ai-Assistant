// Pemeriksaan cepat sebelum push: sintaks JS, dialog bawaan browser, nama top-level ganda.
// Pakai: node tools/check.mjs
import { readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const scripts = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]);
let ok = true;
const fail = msg => { ok = false; console.log("✗ " + msg); };

const dir = mkdtempSync(join(tmpdir(), "ds07-"));
scripts.forEach((src, i) => {
  const f = join(dir, `s${i}.js`); writeFileSync(f, src);
  try { execFileSync(process.execPath, ["--check", f], { stdio: "pipe" }); }
  catch (e) { fail(`sintaks skrip #${i}: ${String(e.stderr).split("\n").slice(0, 4).join(" ")}`); }
});
if (ok) console.log(`✓ sintaks ${scripts.length} skrip`);

const js = scripts.join("\n");
const dialogs = js.match(/(?<![\w.])(alert|confirm|prompt)\s*\(/g);
dialogs ? fail("dialog bawaan browser dipakai: " + dialogs.join(", ")) : console.log("✓ tanpa alert/confirm/prompt");

const names = [...js.matchAll(/^(?:async\s+)?(?:function\s+(\w+)|(?:const|let|var)\s+(\w+)\s*=)/gm)].map(m => m[1] || m[2]);
const dup = names.filter((n, i) => names.indexOf(n) !== i);
dup.length ? fail("nama top-level ganda: " + [...new Set(dup)].join(", ")) : console.log(`✓ ${names.length} nama top-level unik`);

process.exit(ok ? 0 : 1);
