// Seat availability (14 din ka forecast).
import { rr } from "./_rr.js";

const CLASSES = ["1A", "2A", "3A", "3E", "CC", "EC", "EA", "FC", "SL", "2S", "VS", "CH", "SH", "VC", "EV"];
const QUOTAS = ["GN", "TQ", "PT", "LD", "DF", "FT", "SS", "YU", "DP", "HP", "PH"];

export default async function handler(req, res) {
  const q = req.query;
  const train = String(q.train || "").trim();
  const from = String(q.from || "").trim().toUpperCase();
  const to = String(q.to || "").trim().toUpperCase();
  const date = String(q.date || "").trim();
  const cls = String(q.class || "").trim().toUpperCase();
  const quota = String(q.quota || "GN").trim().toUpperCase();
  const bad = (m) => res.status(400).json({ success: false, error: { message: m } });
  if (!/^\d{5}$/.test(train)) return bad("Train number 5 ank ka hona chahiye.");
  if (!/^[A-Z]{1,5}$/.test(from) || !/^[A-Z]{1,5}$/.test(to)) return bad("Station code daalo (jaise NDLS, HWH).");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return bad("Date sahi daalo.");
  if (!CLASSES.includes(cls)) return bad("Class sahi chuno.");
  if (!QUOTAS.includes(quota)) return bad("Quota sahi chuno.");
  const p = new URLSearchParams({ source: from, destination: to, journeyDate: date, classCode: cls, quotaCode: quota });
  return rr(res, `/trains/${train}/seats?${p}`, 300);
}
