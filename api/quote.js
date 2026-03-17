// api/quote.js — Vercel Serverless Function
// Receives quote form submissions and sends an SMS to the owner via Twilio.
// Deployed automatically by Vercel when placed in the /api directory.

const twilio = require('twilio');

// Required fields that must be present in every submission
const REQUIRED_FIELDS = ['firstName', 'lastName', 'phone', 'moveDate', 'homeSize', 'pickupZip', 'dropoffZip'];

// Simple 5-digit zip validation
const ZIP_RE = /^\d{5}$/;

// 10-digit phone (digits only after stripping formatting)
function isValidPhone(raw) {
  return raw.replace(/\D/g, '').length === 10;
}

module.exports = async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body;

  // ── Server-side validation ───────────────────────────────────────────────
  // This guards against direct POST abuse bypassing the browser form.

  for (const field of REQUIRED_FIELDS) {
    if (!body[field] || !String(body[field]).trim()) {
      return res.status(400).json({ error: `Missing required field: ${field}` });
    }
  }

  if (!isValidPhone(body.phone)) {
    return res.status(400).json({ error: 'Invalid phone number' });
  }

  if (!ZIP_RE.test(body.pickupZip) || !ZIP_RE.test(body.dropoffZip)) {
    return res.status(400).json({ error: 'Invalid zip code' });
  }

  // ── Build SMS message ────────────────────────────────────────────────────
  const notes = body.notes && body.notes.trim() ? body.notes.trim() : 'None';

  const message = [
    `New quote request from ${body.firstName} ${body.lastName}`,
    `Phone: ${body.phone}`,
    `Date: ${body.moveDate} | Size: ${body.homeSize}`,
    `${body.pickupZip} -> ${body.dropoffZip}`,
    `Notes: ${notes}`,
  ].join('\n');

  // ── Send via Twilio ──────────────────────────────────────────────────────
  // Credentials are set as environment variables in the Vercel dashboard.
  // Never commit these values — use .env.local for local dev.

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken  = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_FROM_NUMBER;
  const ownerPhone = process.env.OWNER_PHONE;

  if (!accountSid || !authToken || !fromNumber || !ownerPhone) {
    console.error('Missing Twilio environment variables');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const client = twilio(accountSid, authToken);

    await client.messages.create({
      body: message,
      from: fromNumber,
      to:   ownerPhone,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Twilio error:', err.message);
    return res.status(500).json({ error: 'Failed to send notification' });
  }
};
