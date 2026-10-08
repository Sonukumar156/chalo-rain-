// Station ka naam ya code likhte hi suggestions (IRCTC jaise: bade stations pehle).
// RailRadar ki limit 10 request/minute hai, isliye har akshar par unhe call nahi karte:
// poori station list ek baar laakar yahin memory mein rakhte hain aur search yahin hoti hai.

// Bade/mashhoor stations. Inhe hamesha upar rakha jaata hai.
const MAJOR = new Set(`NDLS DLI NZM ANVT DEE DEC DSA PNBE PNC RJPB DNR GAYA MFP DBG SV CPR BSB BSBS MGS ALD PRYJ CNB LKO LJN GKP GD BE MB AGC GWL JHS
BPL RKMP ITR JBP NGP CSMT LTT BCT MMCT DR PNVL TNA KYN PUNE NK BSL SUR KOP SBC YPR MAS MS TPJ MDU CBE ERS TVC CLT MAQ SC HYB KCG BZA VSKP BBS PURI CTC
HWH SDAH KOAA SRC KGP ASN DHN TATA RNC GHY KYQ NJP DBRG JP JU BKN AII ADI ST BRC RJT UDZ ABR KOTA CDG UMB LDH ASR JAT JRC DDN HW RK MTJ SGNR UBL MYS MAO
SPJ HJP BJU RXL JYG SHC KIR RNY NKE SEE MZS JSME ANDI SDLP JNU BDTS BVI KJM SMVB KCVL MV VGLB TDL RTM NAD AWY BTI FZR PTK AMV QLN`.split(/\s+/));

const JUNK = /siding|goods|shed|cabin|\bpvt\b|\bltd\b|sdg\b|loco|depot|workshop|\byard\b|\bcwd\b|private|kstpp|logistics|cement|colliery|power|plant|refiner|\bcoal\b|steel|container|\bicd\b|\bfci\b|\bbpcl\b|\bhpcl\b/i;
const BIG = /\b(jn|junction|central|terminus|terminal|city|cantt|cantonment)\b/i;

let cache = null;
let loadedAt = 0;
async function stationList(key) {
  if (cache && Date.now() - loadedAt < 24 * 3600e3) return cache;
  try {
    const r = await fetch("https://api.railradar.in/v1/lookup/stations", { headers: { Authorization: `Bearer ${key}` } });
    const j = await r.json();
    if (!r.ok || !j.data) throw Object.assign(new Error("upstream"), { status: r.status, body: j });
    cache = Object.entries(j.data).map(([code, name]) => ({ code, name, lcode: code.toLowerCase(), lname: String(name).toLowerCase() }));
    loadedAt = Date.now();
  } catch (e) {
    if (!cache) throw e; // purani list ho to wahi chala lo
  }
  return cache;
}

function score(s, q) {
  let n = 0;
  const wordStart = s.lname.split(/[\s(]+/).some((w) => w.startsWith(q));
  const prefix = s.lcode.startsWith(q) || wordStart; // beech ke akshar se match "prefix" nahi hai
  if (s.lcode === q) n += 150;
  else if (s.lcode.startsWith(q)) n += 25;
  if (MAJOR.has(s.code)) n += prefix ? 120 : 10;
  if (s.lname === q) n += 100;
  else if (s.lname.startsWith(q)) n += 60;
  else if (wordStart) n += 25;
  if (BIG.test(s.lname)) n += 20;
  if (/\bhalt\b/.test(s.lname)) n -= 15;
  n -= Math.min(s.lname.length, 40) / 10; // chhote naam thode upar
  return n;
}

export default async function handler(req, res) {
  const raw = String(req.query.q || "").trim();
  if (raw.length < 2 || raw.length > 40) {
    return res.status(400).json({ success: false, error: { message: "Kam se kam 2 akshar likho." } });
  }
  const key = process.env.RAILRADAR_API_KEY;
  if (!key) return res.status(500).json({ success: false, error: { message: "Server par RAILRADAR_API_KEY set nahi hai." } });
  try {
    const all = await stationList(key);
    const q = raw.toLowerCase();
    const list = all
      .filter((s) => (s.lcode.startsWith(q) || s.lname.includes(q)) && (!JUNK.test(s.name) || s.lcode === q))
      .map((s) => ({ s, n: score(s, q) }))
      .sort((a, b) => b.n - a.n)
      .slice(0, 8)
      .map(({ s }) => ({ code: s.code, name: s.name }));
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=3600");
    return res.status(200).json({ success: true, data: list });
  } catch (e) {
    if (e.body) return res.status(e.status || 502).json(e.body);
    return res.status(502).json({ success: false, error: { message: "Station list abhi nahi mil rahi. Thodi der baad try karo." } });
  }
}
