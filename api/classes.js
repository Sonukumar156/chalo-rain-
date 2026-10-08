// Kisi train ki classes aur rukne wale (halt) stations. Poora route nahi, sirf zaroori cheezein bhejte hain.
export default async function handler(req, res) {
  const train = String(req.query.train || "").trim();
  if (!/^\d{5}$/.test(train)) {
    return res.status(400).json({ success: false, error: { message: "Train number 5 ank ka hona chahiye." } });
  }
  const key = process.env.RAILRADAR_API_KEY;
  if (!key) return res.status(500).json({ success: false, error: { message: "Server par RAILRADAR_API_KEY set nahi hai." } });
  try {
    const r = await fetch(`https://api.railradar.in/v1/trains/${train}`, { headers: { Authorization: `Bearer ${key}` } });
    const j = await r.json();
    if (!r.ok) return res.status(r.status).json(j);
    const t = j.data?.train || {};
    // c=code, n=naam, a=aane ka time, d=jaane ka time, ad/dd=kaunsa din (1 se), km=origin se doori
    const halts = (j.data?.route || [])
      .filter((s) => s.isHalt)
      .map((s) => ({ c: s.station?.code, n: s.station?.name, a: s.arrival, d: s.departure, ad: s.arrivalDay, dd: s.departureDay, km: s.distance, pf: s.platform }));
    res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate=86400");
    return res.status(200).json({ success: true, data: { classes: t.availableClasses || t.classes || [], bookable: t.isPrsBookable !== false, halts } });
  } catch (e) {
    return res.status(502).json({ success: false, error: { message: "Data abhi nahi mil raha. Thodi der baad try karo." } });
  }
}
