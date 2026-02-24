import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import Admin from "@/models/Admin";
import PasswordResetToken from "@/models/PasswordResetToken";

export async function POST(req) {
  try {
    await connectDB();
    const { email } = await req.json();
    console.log("📩 Email received:", email); // ← ADD THIS

    if (!email)
      return NextResponse.json({ error: "Email required" }, { status: 400 });

    const admin = await Admin.findOne({ email });
    console.log("👤 Admin found:", admin ? "YES" : "NO - NOT IN DB"); // ← ADD THIS

    if (!admin) return NextResponse.json({ success: true });

    await PasswordResetToken.deleteMany({ adminId: admin._id });

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30);

    await PasswordResetToken.create({ adminId: admin._id, token, expiresAt });

    const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/admin/reset-password?token=${token}`;
    console.log(
      "🔑 BREVO_API_KEY:",
      process.env.BREVO_API_KEY?.slice(0, 10) + "...",
    );
    console.log("📧 BREVO_SENDER_EMAIL:", process.env.BREVO_SENDER_EMAIL);
    console.log("📧 Sending to:", email);
    console.log("🔗 Reset URL:", resetUrl);

    // ✅ Raw fetch — no SDK, no import issues
    const brevoRes = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: {
          name: process.env.BREVO_SENDER_NAME,
          email: process.env.BREVO_SENDER_EMAIL,
        },
        to: [{ email }],
        subject: "Reset your admin password — M.M.S Water Diviners",
        htmlContent: `
          <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#f0f9ff;border-radius:12px">
            <div style="text-align:center;margin-bottom:24px">
              <h1 style="color:#0077be;font-size:24px;margin:0">M.M.S Water Diviners</h1>
              <p style="color:#6b7280;font-size:13px;margin:4px 0 0">Admin Panel</p>
            </div>
            <div style="background:#fff;border-radius:10px;padding:28px;box-shadow:0 2px 12px rgba(0,119,190,0.1)">
              <h2 style="color:#1f2937;font-size:18px;margin:0 0 12px">Password Reset Request</h2>
              <p style="color:#6b7280;font-size:14px;line-height:1.7;margin:0 0 24px">
                We received a request to reset your admin password.
                Click the button below. This link expires in <strong>30 minutes</strong>.
              </p>
              <div style="text-align:center;margin-bottom:24px">
                <a href="${resetUrl}" style="display:inline-block;padding:14px 32px;background:#0077be;color:#fff;text-decoration:none;border-radius:8px;font-weight:700;font-size:15px">
                  Reset Password
                </a>
              </div>
              <p style="color:#9ca3af;font-size:12px;margin:0;text-align:center">
                If you didn't request this, ignore this email.
              </p>
            </div>
            <p style="color:#9ca3af;font-size:11px;text-align:center;margin-top:20px">
              Link expires at ${expiresAt.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST
            </p>
          </div>
        `,
      }),
    });

    if (!brevoRes.ok) {
      const err = await brevoRes.json();
      console.error("❌ Brevo error:", err);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 },
      );
    }

    console.log("✅ Reset email sent to:", email);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ Forgot password error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
