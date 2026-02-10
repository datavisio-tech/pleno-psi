#!/usr/bin/env node
// Integration local script: register a user, capture Set-Cookie and submit /api/profile
const fetch = global.fetch || require("node-fetch");

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function tryFetch(url, opts) {
  for (let i = 0; i < 30; i++) {
    try {
      return await fetch(url, opts);
    } catch (e) {
      await wait(500);
    }
  }
  throw new Error("Server not responding: " + url);
}

(async () => {
  const base = "http://localhost:3000";
  const email = `integration+${Date.now()}@example.com`;
  console.log("Registering", email);
  const regRes = await tryFetch(base + "/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      password: "testpass123",
      confirmPassword: "testpass123",
    }),
  });
  const regText = await regRes.text();
  console.log("Register status", regRes.status, regText);
  const setCookie = regRes.headers.get("set-cookie");
  console.log("Set-Cookie:", setCookie);
  if (!setCookie) {
    console.error("No session cookie received; aborting");
    process.exit(1);
  }

  // Submit profile
  const profile = {
    full_name: "Integration Test User",
    nome_social: "Tester",
    cpf: "00000000001",
    phone: "11999999999",
    birth_date: "1990-01-01",
    gender: "other",
    role: "professional",
    profession: "Psicóloga(o)",
  };

  const profRes = await tryFetch(base + "/api/profile", {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: setCookie },
    body: JSON.stringify(profile),
  });
  const profText = await profRes.text();
  console.log("Profile status", profRes.status, profText);

  process.exit(0);
})();
