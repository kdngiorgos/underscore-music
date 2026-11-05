import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });
const url = process.argv[2] ?? "http://localhost:8766/";
await page.goto(url);
await page.waitForTimeout(2500);
const before = await page.evaluate(() => ({
  status: document.querySelector("#status")?.textContent,
  started: window.__underscore?.started,
}));
await page.getByRole("button", { name: "Start the score" }).click();
await page.waitForTimeout(900);
const afterStart = await page.evaluate(() => ({
  status: document.querySelector("#status")?.textContent,
  started: window.__underscore?.started,
  audioState: window.__underscore?.audioContext?.state,
  gains: Object.fromEntries(
    Object.entries(window.__underscore?.gains ?? {}).map(([key, value]) => [
      key,
      Number(value.gain.value.toFixed(2)),
    ]),
  ),
}));
await page.getByRole("button", { name: "Summon boss" }).click();
await page.waitForTimeout(2600);
const afterBoss = await page.evaluate(() => ({
  status: document.querySelector("#status")?.textContent,
  scheduledTarget: window.__underscore?.scheduledTarget,
  transitionAt: window.__underscore?.transitionAt,
  gains: Object.fromEntries(
    Object.entries(window.__underscore?.gains ?? {}).map(([key, value]) => [
      key,
      Number(value.gain.value.toFixed(2)),
    ]),
  ),
}));
console.log(JSON.stringify({ before, afterStart, afterBoss }, null, 2));
await browser.close();
