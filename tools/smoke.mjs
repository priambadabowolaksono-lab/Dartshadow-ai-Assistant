// Uji asap DS-07 di Chromium dengan window.claude tiruan (semua data dummy).
// Pakai: npm i -D playwright && npx playwright install chromium ; node tools/smoke.mjs
import { readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createRequire } from "node:module";

let chromium;
try { ({ chromium } = createRequire(import.meta.url)("playwright")); }
catch { console.log("• Playwright belum terpasang — uji asap dilewati (npm i -D playwright)."); process.exit(0); }

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const dir = mkdtempSync(join(tmpdir(), "ds07-smoke-"));
const page = join(dir, "page.html");
// meniru kerangka yang ditambahkan claude.ai saat publish
writeFileSync(page, `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><style>body{margin:0}[hidden]{display:none!important}</style></head><body>${html}</body></html>`);

const BRIEF = { tanggal:"Senin, 1 Januari 2027", aktif:3, terlambat:2, hariIni:1, besok:0, mingguIni:1, baru:1, selesai:1, tanpaPic:0,
  projects:[{id:"d1",bu:"KLIEN A",nama:"Poster Dummy",pic:"Dewi",deadline:"2026-12-01",status:"Approval Klien",telatHari:31,sisaHari:-31},
            {id:"d2",bu:"KLIEN B",nama:"Video Dummy",pic:"Budi",deadline:"2026-12-20",status:"Review Internal",telatHari:12,sisaHari:-12},
            {id:"d3",bu:"KLIEN C",nama:"Deck Dummy",pic:"Dewi",deadline:"2027-01-01",status:"Dikerjakan",telatHari:0,sisaHari:0}],
  beban:[{pic:"Dewi",aktif:2,terlambat:1},{pic:"Budi",aktif:1,terlambat:1}], masuk:["KLIEN C – Deck Dummy"], selesaiList:["KLIEN B – Banner Dummy"],
  saran:["Selesaikan review Video Dummy pagi ini.","Minta keputusan klien untuk Poster Dummy."] };

const mock = () => {
  const sample = async (msgs, o) => {
    const mem = (o.tools || []).find(t => t.name === "simpan_ingatan");
    if (mem) await mem.execute({ fakta:"Pengguna suka kopi hitam." }, {});
    const txt = "## Rencana\n1. **Satu** hal\n2. Dua\n\n| A | B |\n|---|---|\n| 1 | 2 |\n\n```js\nconsole.log(1)\n```";
    let acc = ""; for (const ch of txt.match(/.{1,10}/gs)) { acc += ch; o.onText && o.onText({ text:acc, delta:ch }); await new Promise(r => setTimeout(r, 5)); }
    return { text:acc, truncated:false, modelTierApplied:"default" };
  };
  sample.limits = async () => ({ maxPromptBytes:200000, tools:{ maxCount:8 }, images:{ maxCount:5, maxInputBytes:5e6, mediaTypes:["image/png","image/jpeg"] } });
  const tts = { speak:async () => ({ playedMs:1 }), stop:async () => {}, pause:async () => {}, resume:async () => {}, active:() => false, voices:async () => ["buttery","airy","glassy","rounded"] };
  const user = { me:async () => ({ id:"u1", name:"Penguji" }), isOwner:async () => true, id:async () => null };
  const caps = { sample, tts, user, downloads:{ save:async () => ({ status:"saved" }) } };
  window.claude = { use:async n => caps[n] ?? null };
};

let fail = 0;
const ok = (c, m) => { console.log((c ? "✓ " : "✗ ") + m); if (!c) fail++; };
const b = await chromium.launch();
for (const [w, h] of [[1440, 900], [390, 844]]) {
  const ctx = await b.newContext({ viewport:{ width:w, height:h } }); const p = await ctx.newPage();
  const errs = []; p.on("pageerror", e => errs.push(e.message)); p.on("console", m => { if (m.type() === "error") errs.push(m.text()); });
  await p.addInitScript(mock);
  await p.goto("file://" + page); await p.waitForTimeout(1200);
  // chat + usulan ingatan
  await p.fill("#inp", "Halo DS-07"); await p.keyboard.press("Enter"); await p.waitForTimeout(1200);
  ok(await p.locator(".msg.a .md table").count() === 1, `${w}px: jawaban markdown dirender`);
  ok(await p.locator("[data-keep]").count() === 1, `${w}px: usulan ingatan tampil`);
  // jembatan ChatGPT
  await p.fill("#inp", "Pertanyaan untuk GPT"); await p.click("#gptBtn");
  ok(/chatgpt\.com\/\?q=/.test(await p.getAttribute("#gOpen", "href")), `${w}px: link ChatGPT terisi`);
  await p.click(".gdlg [data-x]");
  // briefing dari awal sampai akhir
  await p.evaluate(br => { S.ops.ok = true; S.ops.config = {}; S.ops.reports = [{ id:"lap_dummy", kind:"laporan", date:todayISO(), ringkas:"Dummy", md:"", brief:br }]; bfOpen(false); }, BRIEF);
  await p.waitForTimeout(300); await p.focus("#bfHold"); await p.keyboard.press("Enter"); await p.waitForTimeout(1300);
  for (let i = 0; i < 12 && !(await p.$("[data-bf-go]")); i++) { await p.keyboard.press("ArrowRight"); await p.waitForTimeout(500); }
  ok(!!(await p.$("[data-bf-go]")), `${w}px: briefing sampai AFTERMATH`);
  await p.click("[data-bf-go]"); await p.waitForTimeout(1000);
  ok(!(await p.$(".bf")), `${w}px: briefing tertutup kembali ke chat`);
  ok(await p.evaluate(() => document.documentElement.scrollWidth - innerWidth) <= 0, `${w}px: tanpa scroll ke samping`);
  ok(errs.length === 0, `${w}px: tanpa error di console${errs.length ? " — " + errs.join(" | ") : ""}`);
  await ctx.close();
}
await b.close();
process.exit(fail ? 1 : 0);
