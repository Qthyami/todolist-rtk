const BEARER_TOKEN = "19a04bd9-9318-49b9-a399-9c6430487d09";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();

  const path = req.query.path || "";
  const targetUrl = `https://social-network.samuraijs.com/api/1.1${path}`;

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${BEARER_TOKEN}`,
      },
      body: req.method !== "GET" && req.method !== "DELETE" ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.json().catch(() => null);
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: "Proxy error", details: error.message });
  }
}
