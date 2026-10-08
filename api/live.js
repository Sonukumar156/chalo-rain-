// Ye server par chalta hai. Aapki API key yahan chhupi rehti hai, browser ko nahi dikhti.
export default async function handler(req, res) {
  const train = String(req.query.train || "").trim();
  if (!/^\d{5}$/.test(train)) {
    return res.status(400).json({ success: false, error: { message: "Train number 5 ank ka hona chahiye." } });
  }
  const key = process.env.RAILRADAR_API_KEY;
  if (!key) {
    return res.status(500).json({ success: false, error: { message: "Server par RAILRADAR_API_KEY set nahi hai." } });
  }
  try {
    const r = await fetch(`https://api.railradar.in/v1/trains/${train}/live?haltsOnly=true`, {
      headers: { Authorization: `Bearer ${key}` },
    });
    const data = await r.json();
    // 60 second tak result yaad rakho, taaki free limit (1000/mahina) jaldi khatam na ho
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=60");
    return res.status(r.status).json(data);
  } catch (e) {
    return res.status(502).json({ success: false, error: { message: "Train data abhi nahi mil raha. Thodi der baad try karo." } });
  }
}
