export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const targetUrl = "https://social-network.samuraijs.com/api/1.1/" + (req.query.path || "");

  const response = await fetch(targetUrl, {
    method: req.method,
    headers: {
      "Content-Type": "application/json",
      "API-KEY": "9f3854f9-1c37-4311-8912-72c5f843df71"
    },
    body: req.method !== "GET" && req.method !== "DELETE" ? JSON.stringify(req.body) : undefined,
  });

  const data = await response.json().catch(() => null);

  res.status(response.status).json(data);
}
