(async function () {
  const body = {
    email: "integration+test@example.com",
    password: "testpass123",
    confirmPassword: "testpass123",
  };
  const urls = [
    "http://localhost:3000/api/register",
    "http://localhost:3001/api/register",
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const text = await res.text();
      console.log(`Response from ${url} (status ${res.status}):\n${text}`);
      break;
    } catch (err) {
      console.error(`Failed to fetch ${url}:`, err.message || err);
    }
  }
})();
