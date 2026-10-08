// Waitlist PNR ke confirm hone ka andaza.
import { rr } from "./_rr.js";

export default async function handler(req, res) {
  const pnr = String(req.query.pnr || "").trim();
  if (!/^\d{10}$/.test(pnr)) {
    return res.status(400).json({ success: false, error: { message: "PNR 10 ank ka hona chahiye." } });
  }
  return rr(res, `/pnr/${pnr}/prediction`, 600);
}
