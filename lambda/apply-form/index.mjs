import { SendEmailCommand, SESClient } from "@aws-sdk/client-ses"

const ses = new SESClient({ region: process.env.AWS_REGION ?? "us-east-1" })

const SES_FROM = process.env.SES_FROM ?? "noreply@banpractice.com"
const NOTIFY_TO = process.env.NOTIFY_TO ?? "info@banpractice.com"
const LOGO_URL = process.env.LOGO_URL ?? "https://www.banpractice.com/email/ban-logo.png"

const REQUIRED = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "state",
  "certStatus",
  "situation",
  "interest",
]

const LABELS = {
  firstName: "First name",
  lastName: "Last name",
  email: "Email",
  phone: "Mobile phone",
  state: "State",
  certStatus: "BCBA certification status",
  situation: "Current professional situation",
  interest: "Primary interest",
  bcbaFinder: "BCBAfinder profile",
  message: "Short message",
}

const MAX_LEN = { message: 2000 }
const DEFAULT_MAX_LEN = 200
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const FONT = "'Montserrat','Helvetica Neue',Helvetica,Arial,sans-serif"
const FONT_IMPORT = `<link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap" rel="stylesheet" />
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap');
  </style>`

const ROYAL_BLUE = "#1660D4"
const INK = "#1A2D52"
const SECONDARY_TEXT = "#4A5F87"
const MUTED = "#6278A0"
const BORDER = "#E1E6F0"
const ICE = "#F4F7FC"

const json = (statusCode, body) => ({
  statusCode,
  headers: { "content-type": "application/json" },
  body: JSON.stringify(body),
})

const escapeHtml = (v) =>
  String(v).replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  )

const headerSafe = (v) => String(v).replace(/[\r\n]+/g, " ").trim()

function validate(d) {
  for (const key of REQUIRED) {
    if (!String(d[key] ?? "").trim()) return `${LABELS[key]} is required.`
  }
  if (!EMAIL_RE.test(String(d.email).trim())) return "Enter a valid email address."
  for (const [key, label] of Object.entries(LABELS)) {
    const max = MAX_LEN[key] ?? DEFAULT_MAX_LEN
    if (String(d[key] ?? "").length > max) return `${label} is too long.`
  }
  return null
}

function staffText(d) {
  const line = (key) => `${LABELS[key]}: ${String(d[key] ?? "").trim() || "—"}`
  return [
    "New Practice Partner application",
    "",
    line("firstName"),
    line("lastName"),
    line("email"),
    line("phone"),
    line("state"),
    "",
    line("certStatus"),
    line("situation"),
    line("interest"),
    line("bcbaFinder"),
    "",
    "Message:",
    String(d.message ?? "").trim() || "—",
    "",
    "Reply directly to this email to reach the applicant.",
  ].join("\n")
}

function staffHtml(d) {
  const val = (v) => escapeHtml(String(v ?? "").trim() || "—")
  const row = (label, value) => `
    <tr>
      <td style="padding:8px 0;font:400 14px/20px ${FONT};color:${MUTED};width:190px;vertical-align:top;border-bottom:1px solid ${BORDER};">${escapeHtml(label)}</td>
      <td style="padding:8px 0;font:600 14px/20px ${FONT};color:${INK};vertical-align:top;border-bottom:1px solid ${BORDER};">${value}</td>
    </tr>`

  const email = String(d.email ?? "").trim()
  const phone = String(d.phone ?? "").trim()
  const profile = String(d.bcbaFinder ?? "").trim()
  const message = String(d.message ?? "").trim()

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  ${FONT_IMPORT}
</head>
<body style="margin:0;padding:0;background:${ICE};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(`${d.firstName} ${d.lastName}`)} — ${val(d.state)} — ${val(d.interest)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${ICE};">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background:#ffffff;border:1px solid ${BORDER};border-radius:12px;">

          <tr>
            <td style="padding:28px 32px 20px;border-bottom:1px solid ${BORDER};">
              <img src="${LOGO_URL}" width="130" alt="Behavior Analyst Network" style="display:block;width:130px;max-width:130px;height:auto;border:0;" />
            </td>
          </tr>

          <tr>
            <td style="padding:28px 32px 4px;">
              <p style="margin:0 0 6px;font:700 12px/16px ${FONT};color:${ROYAL_BLUE};letter-spacing:0.08em;text-transform:uppercase;">New Practice Partner application</p>
              <h1 style="margin:0 0 20px;font:700 24px/32px ${FONT};color:${INK};">${escapeHtml(`${String(d.firstName).trim()} ${String(d.lastName).trim()}`)}</h1>
              <p style="margin:0 0 4px;font:400 15px/24px ${FONT};color:${SECONDARY_TEXT};">
                <a href="mailto:${escapeHtml(email)}" style="color:${ROYAL_BLUE};text-decoration:none;font-weight:600;">${escapeHtml(email)}</a>
                &nbsp;&middot;&nbsp;
                <a href="tel:${escapeHtml(phone.replace(/[^\d+]/g, ""))}" style="color:${ROYAL_BLUE};text-decoration:none;font-weight:600;">${escapeHtml(phone)}</a>
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:12px 32px 8px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                ${row("State", val(d.state))}
                ${row("Certification", val(d.certStatus))}
                ${row("Situation", val(d.situation))}
                ${row("Primary interest", val(d.interest))}
                ${row(
                  "BCBAfinder profile",
                  profile
                    ? `<a href="${escapeHtml(profile)}" style="color:${ROYAL_BLUE};text-decoration:none;">${escapeHtml(profile)}</a>`
                    : "—",
                )}
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 32px 8px;">
              <p style="margin:0 0 8px;font:700 12px/16px ${FONT};color:${ROYAL_BLUE};letter-spacing:0.08em;text-transform:uppercase;">Message</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${ICE};border-radius:10px;">
                <tr>
                  <td style="padding:16px 20px;font:400 15px/24px ${FONT};color:${INK};white-space:pre-wrap;">${message ? escapeHtml(message) : "—"}</td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 32px 28px;">
              <p style="margin:0;font:400 14px/22px ${FONT};color:${MUTED};">
                Reply to this email to reach ${escapeHtml(String(d.firstName).trim())} directly.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function applicantText(d) {
  return [
    `Hi ${String(d.firstName).trim()},`,
    "",
    "Thanks for applying to become a BAN Practice Partner. Your application is in.",
    "",
    "What happens next: a BCBA on our team reviews every application personally, and",
    "you'll hear back within two business days.",
    "",
    "What you told us:",
    `State: ${String(d.state).trim()}`,
    `Certification: ${String(d.certStatus).trim()}`,
    `Situation: ${String(d.situation).trim()}`,
    `Primary interest: ${String(d.interest).trim()}`,
    "",
    `Questions in the meantime? Just reply, or email ${NOTIFY_TO}.`,
    "",
    "— Behavior Analyst Network",
  ].join("\n")
}

function applicantHtml(d) {
  const row = (label, value) => `
    <tr>
      <td style="padding:6px 0;font:400 14px/20px ${FONT};color:${MUTED};width:150px;vertical-align:top;">${escapeHtml(label)}</td>
      <td style="padding:6px 0;font:600 14px/20px ${FONT};color:${INK};vertical-align:top;">${escapeHtml(String(value).trim())}</td>
    </tr>`

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  ${FONT_IMPORT}
</head>
<body style="margin:0;padding:0;background:${ICE};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">Your BAN Practice Partner application is in — a BCBA reviews every one, and you'll hear back within two business days.</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${ICE};">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background:#ffffff;border:1px solid ${BORDER};border-radius:12px;">

          <tr>
            <td style="padding:32px 32px 24px;border-bottom:1px solid ${BORDER};">
              <img src="${LOGO_URL}" width="160" alt="Behavior Analyst Network" style="display:block;width:160px;max-width:160px;height:auto;border:0;" />
            </td>
          </tr>

          <tr>
            <td style="padding:32px 32px 8px;">
              <h1 style="margin:0 0 16px;font:700 24px/32px ${FONT};color:${INK};">Thanks for applying, ${escapeHtml(String(d.firstName).trim())}.</h1>
              <p style="margin:0 0 16px;font:400 16px/26px ${FONT};color:${SECONDARY_TEXT};">
                Your application to become a BAN Practice Partner is in. A BCBA on our team reviews every application personally &mdash; you&rsquo;ll hear back <strong style="color:${INK};">within two business days</strong>.
              </p>
              <p style="margin:0 0 24px;font:400 16px/26px ${FONT};color:${SECONDARY_TEXT};">
                Nothing is shared without your say-so, and there&rsquo;s no obligation or cost to apply.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:0 32px 8px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${ICE};border-radius:10px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 12px;font:700 12px/16px ${FONT};color:${ROYAL_BLUE};letter-spacing:0.08em;text-transform:uppercase;">What you told us</p>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      ${row("State", d.state)}
                      ${row("Certification", d.certStatus)}
                      ${row("Situation", d.situation)}
                      ${row("Primary interest", d.interest)}
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:24px 32px 32px;">
              <p style="margin:0;font:400 15px/24px ${FONT};color:${SECONDARY_TEXT};">
                Questions in the meantime? Just reply to this email, or reach us at
                <a href="mailto:${NOTIFY_TO}" style="color:${ROYAL_BLUE};text-decoration:none;font-weight:600;">${NOTIFY_TO}</a>.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 32px;border-top:1px solid ${BORDER};">
              <p style="margin:0;font:400 13px/20px ${FONT};color:${MUTED};">
                Behavior Analyst Network<br />
                You received this because you applied at
                <a href="https://www.banpractice.com" style="color:${MUTED};text-decoration:underline;">banpractice.com</a>.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export const handler = async (event) => {
  let data
  try {
    data = JSON.parse(event.body ?? "{}")
  } catch {
    return json(400, { ok: false, error: "Malformed request." })
  }

  if (String(data.website ?? "").trim()) return json(200, { ok: true })

  const invalid = validate(data)
  if (invalid) return json(400, { ok: false, error: invalid })

  const applicant = String(data.email).trim()
  const name = headerSafe(`${data.firstName} ${data.lastName}`)

  try {
    await ses.send(
      new SendEmailCommand({
        Source: SES_FROM,
        Destination: { ToAddresses: [NOTIFY_TO] },
        ReplyToAddresses: [applicant],
        Message: {
          Subject: { Data: `New Practice Partner application — ${name}` },
          Body: {
            Text: { Data: staffText(data) },
            Html: { Data: staffHtml(data) },
          },
        },
      }),
    )
  } catch (error) {
    console.error("staff notification failed", error)
    return json(502, { ok: false, error: "Could not send your application." })
  }

  try {
    await ses.send(
      new SendEmailCommand({
        Source: SES_FROM,
        Destination: { ToAddresses: [applicant] },
        ReplyToAddresses: [NOTIFY_TO],
        Message: {
          Subject: { Data: "Your BAN Practice Partner application" },
          Body: {
            Text: { Data: applicantText(data) },
            Html: { Data: applicantHtml(data) },
          },
        },
      }),
    )
  } catch (error) {
    console.error("applicant confirmation failed", error)
  }

  return json(200, { ok: true })
}
