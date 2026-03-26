import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { name, email, note } = await req.json();

    if (!name?.trim() || !email?.trim() || !note?.trim()) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 },
      );
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    if (note.trim().length < 10) {
      return NextResponse.json(
        { error: "Note must be at least 10 characters." },
        { status: 400 },
      );
    }

    if (note.trim().length > 1000) {
      return NextResponse.json(
        { error: "Note must be under 1000 characters." },
        { status: 400 },
      );
    }

    const adminEmail =
      process.env.ADMIN_NOTIFY_EMAIL || process.env.ADMIN_GOOGLE_EMAIL;
    const submittedAt = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
    });

    const brevoRes = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: "MMS Website Enquiry",
          email: process.env.BREVO_SENDER_EMAIL,
        },
        to: [{ email: adminEmail }],
        replyTo: { email: email.trim(), name: name.trim() },
        subject: `New Enquiry from ${name.trim()} — M.M.S Water Diviners`,
        htmlContent: `
          <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:32px;background:#f0f9ff;border-radius:12px;">
            <div style="text-align:center;margin-bottom:24px;">
              <h1 style="color:#0077be;font-size:22px;margin:0;">M.M.S Water Diviners</h1>
              <p style="color:#6b7280;font-size:13px;margin:4px 0 0;">New Website Enquiry</p>
            </div>
            <div style="background:#fff;border-radius:10px;padding:28px;box-shadow:0 2px 12px rgba(0,119,190,0.1);">
              <table style="width:100%;border-collapse:collapse;">
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;width:110px;">
                    <span style="font-size:12px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;">Name</span>
                  </td>
                  <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;">
                    <span style="font-size:15px;font-weight:600;color:#1f2937;">${name.trim()}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;">
                    <span style="font-size:12px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;">Email</span>
                  </td>
                  <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;">
                    <a href="mailto:${email.trim()}" style="font-size:15px;color:#0077be;text-decoration:none;">${email.trim()}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 0 4px;vertical-align:top;">
                    <span style="font-size:12px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;">Message</span>
                  </td>
                  <td style="padding:14px 0 4px;">
                    <p style="font-size:15px;color:#374151;line-height:1.7;margin:0;white-space:pre-wrap;">${note.trim()}</p>
                  </td>
                </tr>
              </table>
            </div>
            <p style="font-size:12px;color:#9ca3af;text-align:center;margin-top:20px;">
              Submitted at ${submittedAt} IST · Reply directly to this email to respond to ${name.trim()}
            </p>
          </div>
        `,
      }),
    });

    if (!brevoRes.ok) {
      const err = await brevoRes.json();
      console.error("Brevo error:", err);
      return NextResponse.json(
        { error: "Failed to send. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
