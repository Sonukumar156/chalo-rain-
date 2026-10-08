// Do stations ke beech chalne wali trains.
import { rr } from "./_rr.js";

export default async function handler(req, res) {
  const from = String(req.query.from || "").trim().toUpperCase();
  const to = String(req.query.to || "").trim().toUpperCase();
  const date = String(req.query.date || "").trim();
  const bad = (m) => res.status(400).json({ success: false, error: { message: m } });
  if (!/^[A-Z]{1,5}$/.test(from) || !/^[A-Z]{1,5}$/.test(to)) return bad("Dono station chuno.");
  if (from === to) return bad("Kahan se aur kahan tak alag hone chahiye.");
  if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) return bad("Date sahi daalo.");
  return rr(res, `/trains/between/${from}/${to}${date ? `?date=${date}` : ""}`, 300);
}
