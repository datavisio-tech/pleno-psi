(async function () {
  const body = {
    email: "integration+test@example.com",
    password: "testpass123",
    confirmPassword: "testpass123",
  };
  const url = "http://localhost:3000/api/register";

  for (let i = 1; i <= 2; i++) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const text = await res.text();
      console.log(`Attempt ${i} => status ${res.status}: ${text}`);
    } catch (err) {
      console.error(`Attempt ${i} failed:`, err.message || err);
    }
  }
})();
