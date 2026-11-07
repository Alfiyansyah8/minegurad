const PRIVATE_IPV4 = [
  /^10\./,
  /^127\./,
  /^169\.254\./,
  /^192\.168\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^0\./
];

function validHost(host) {
  if (typeof host !== "string" || host.length > 253) return false;
  const value = host.trim().toLowerCase().replace(/^\[|\]$/g, "");
  if (!value || value === "localhost" || value.endsWith(".local")) return false;
  if (PRIVATE_IPV4.some((re) => re.test(value))) return false;
  if (value.includes(":")) return false; // IPv6 literal deliberately unsupported
  return /^[a-z0-9.-]+$/.test(value) &&
    !value.startsWith(".") && !value.endsWith(".") &&
    !value.includes("..");
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const host = String(req.query.host || "").trim();
  const edition = String(req.query.edition || "java").toLowerCase();
  const rawPort = String(req.query.port || (edition === "bedrock" ? "19132" : "25565"));
  const port = Number(rawPort);

  if (!validHost(host)) return res.status(400).json({ error: "Masukkan hostname atau IPv4 publik yang valid." });
  if (!["java", "bedrock"].includes(edition)) return res.status(400).json({ error: "Edition tidak valid." });
  if (!Number.isInteger(port) || port < 1 || port > 65535) return res.status(400).json({ error: "Port harus 1–65535." });

  const started = Date.now();
  const url = `https://api.mcstatus.io/v2/status/${edition}/${encodeURIComponent(host)}:${port}`;

  try {
    const upstream = await fetch(url, {
      headers: { "Accept": "application/json" },
      signal: AbortSignal.timeout(8000)
    });
    if (!upstream.ok) throw new Error(`Status provider ${upstream.status}`);
    const data = await upstream.json();
    const latency = Date.now() - started;

    const players = data.players || {};
    const version = data.version || {};
    return res.status(200).json({
      online: Boolean(data.online),
      host,
      port,
      edition,
      latency,
      version: version.name_clean || version.name || "Tidak diketahui",
      playersOnline: Number.isFinite(players.online) ? players.online : 0,
      playersMax: Number.isFinite(players.max) ? players.max : 0,
      motd: data.motd?.clean || data.motd?.raw || "",
      checkedAt: new Date().toISOString()
    });
  } catch (error) {
    return res.status(502).json({ error: "Tidak dapat mengambil status server. Periksa host/port atau coba lagi." });
  }
    }
    
