import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

const RECIPIENT = "contact@therelec.fr"

function row(label: string, value: string | string[] | undefined) {
  if (!value || (Array.isArray(value) && value.length === 0)) return ""
  const display = Array.isArray(value) ? value.join(", ") : value
  return `
    <tr>
      <td style="padding:8px 12px;font-weight:600;color:#374151;background:#f9fafb;border:1px solid #e5e7eb;white-space:nowrap;font-size:13px;">${label}</td>
      <td style="padding:8px 12px;color:#111827;border:1px solid #e5e7eb;font-size:13px;">${display}</td>
    </tr>`
}

function section(title: string, rows: string) {
  if (!rows.trim()) return ""
  return `
    <tr><td colspan="2" style="padding:12px 12px 4px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#6b7280;border:none;">${title}</td></tr>
    ${rows}`
}

function buildElecHtml(d: Record<string, unknown>) {
  const s = (k: string) => d[k] as string | string[] | undefined
  return `
<div style="font-family:Arial,sans-serif;max-width:680px;margin:0 auto;">
  <div style="background:linear-gradient(135deg,#0A1628,#04599c);padding:24px 28px;border-radius:12px 12px 0 0;">
    <h1 style="color:#fff;margin:0;font-size:20px;">⚡ Demande d'intervention — Électricité</h1>
    <p style="color:rgba(255,255,255,.7);margin:6px 0 0;font-size:13px;">Reçue via therelec.fr</p>
  </div>
  <table style="width:100%;border-collapse:collapse;border-radius:0 0 12px 12px;overflow:hidden;">
    ${section("Contact", row("Nom", s("nom")) + row("Téléphone", s("tel")) + row("Email", s("email")) + row("Code postal", s("cp")))}
    ${section("Intervention", row("Nature", s("nature")) + row("Type de demande", s("typeDemande")))}
    ${section("Bâtiment", row("Type", s("typeBatiment")) + row("Surface", s("surface") ? `${s("surface")} m²` : "") + row("Hauteur plafond", s("hauteur") ? `${s("hauteur")} m` : ""))}
    ${section("Technique", row("Puissance", s("puissance")))}
    ${section("Travaux", row("Travaux concernés", s("travaux")))}
    ${section("Dépannage", row("Symptômes", s("depannage")))}
    ${section("Disponibilités", row("Jours", s("jours")) + row("Créneaux", s("creneaux")))}
  </table>
  <p style="font-size:11px;color:#9ca3af;text-align:center;margin:16px 0 0;">Therelec · contact@therelec.fr · 06 99 69 94 28</p>
</div>`
}

function buildClimHtml(d: Record<string, unknown>) {
  const s = (k: string) => d[k] as string | string[] | undefined
  return `
<div style="font-family:Arial,sans-serif;max-width:680px;margin:0 auto;">
  <div style="background:linear-gradient(135deg,#0A1628,#00B4D8);padding:24px 28px;border-radius:12px 12px 0 0;">
    <h1 style="color:#fff;margin:0;font-size:20px;">❄️ Demande d'intervention — Climatisation</h1>
    <p style="color:rgba(255,255,255,.7);margin:6px 0 0;font-size:13px;">Reçue via therelec.fr</p>
  </div>
  <table style="width:100%;border-collapse:collapse;border-radius:0 0 12px 12px;overflow:hidden;">
    ${section("Contact", row("Nom", s("nom")) + row("Téléphone", s("tel")) + row("Email", s("email")) + row("Code postal", s("cp")))}
    ${section("Intervention", row("Nature", s("nature")) + row("Type de demande", s("typeDemande")))}
    ${section("Équipement", row("Type", s("typeEquip")) + row("Configuration", s("config")) + row("Marque", s("marque")))}
    ${section("Symptômes", row("Problèmes", s("symptomes")))}
    ${section("Bâtiment", row("Type", s("typeBatiment")) + row("Surface", s("surface") ? `${s("surface")} m²` : "") + row("Hauteur plafond", s("hauteur") ? `${s("hauteur")} m` : ""))}
    ${section("Disponibilités", row("Jours", s("jours")) + row("Créneaux", s("creneaux")))}
  </table>
  <p style="font-size:11px;color:#9ca3af;text-align:center;margin:16px 0 0;">Therelec · contact@therelec.fr · 06 99 69 94 28</p>
</div>`
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { formType, ...data } = body as { formType: "electricite" | "climatisation" } & Record<string, unknown>

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    const isElec = formType === "electricite"
    const subject = isElec
      ? `⚡ Nouvelle demande Électricité — ${data.nom ?? "Inconnu"} (${data.cp ?? ""})`
      : `❄️ Nouvelle demande Climatisation — ${data.nom ?? "Inconnu"} (${data.cp ?? ""})`

    await transporter.sendMail({
      from: `"Therelec Site" <${process.env.SMTP_USER}>`,
      to: RECIPIENT,
      replyTo: (data.email as string) || RECIPIENT,
      subject,
      html: isElec ? buildElecHtml(data) : buildClimHtml(data),
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[contact/route] error:", err)
    return NextResponse.json({ ok: false, error: "Erreur serveur" }, { status: 500 })
  }
}
