// RailRadar ko call karne ka common code. Underscore se shuru hai, isliye ye alag API nahi banta.
export async function rr(res, path, cacheSeconds) {
  const key = process.env.RAILRADAR_API_KEY;
  if (!key) {
    return res.status(500).json({ success: false, error: { message: "Server par RAILRADAR_API_KEY set nahi hai." } });
  }
  try {
    const r = await fetch(`https://api.railradar.in/v1${path}`, { headers: { Authorization: `Bearer ${key}` } });
    const data = await r.json();
    if (r.ok) res.setHeader("Cache-Control", `s-maxage=${cacheSeconds}, stale-while-revalidate=${cacheSeconds}`);
    return res.status(r.status).json(data);
  } catch (e) {
    return res.status(502).json({ success: false, error: { message: "Data abhi nahi mil raha. Thodi der baad try karo." } });
  }
}
