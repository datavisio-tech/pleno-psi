#!/usr/bin/env node
// Integration test for patient flow: register user, capture session cookie, submit /api/profile as patient
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
  const email = `integration+patient+${Date.now()}@example.com`;
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

  // Create unique CPF using timestamp to avoid conflicts
  const uniqueCpf = String(Date.now()).slice(-11);

  const profile = {
    full_name: "Integration Patient User",
    nome_social: "PacienteTest",
    cpf: uniqueCpf,
    phone: "11988887777",
    birth_date: "1995-05-05",
    gender: "female",
    role: "patient",
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
