// Usage: node scripts/ping-indexnow.js
const KEY = "e4593ef5-9884-4a1a-ba26-c69a0a1fdaf9"; // ← your actual UUID key
const SITE = "https://mmswaterdiviners.in";

async function ping() {
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      host: "mmswaterdiviners.in",
      key: KEY,
      keyLocation: `${SITE}/${KEY}.txt`,
      urlList: [
        `${SITE}/`,
        `${SITE}/services`,
        `${SITE}/about`,
        `${SITE}/contact`,
      ],
    }),
  });
  console.log("IndexNow:", res.status, res.ok ? "✅ SUCCESS" : "❌ FAILED");
}
ping();
