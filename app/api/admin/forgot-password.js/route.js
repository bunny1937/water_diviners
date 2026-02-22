import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import Admin from "@/models/Admin";
import PasswordResetToken from "@/models/PasswordResetToken";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    await connectDB();
    const { email } = await req.json();

    if (!email)
      return NextResponse.json({ error: "Email required" }, { status: 400 });

    const admin = await Admin.findOne({ email });

    // Always return success — don't leak if email exists
    if (!admin) return NextResponse.json({ success: true });

    // Invalidate old tokens
    await PasswordResetToken.deleteMany({ adminId: admin._id });

    // Generate secure token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes

    await PasswordResetToken.create({ adminId: admin._id, token, expiresAt });

    const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/admin/reset-password?token=${token}`;

    await resend.emails.send({
      from: "M.M.S Water Diviners <onboarding@resend.dev>",
      to: email,
      subject: "Reset your admin password",
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#f0f9ff;border-radius:12px">
          <div style="text-align:center;margin-bottom:24px">
            <h1 style="color:#0077be;font-size:24px;margin:0">M.M.S Water Diviners</h1>
            <p style="color:#6b7280;font-size:13px;margin:4px 0 0">Admin Panel</p>
          </div>
          <div style="background:#fff;border-radius:10px;padding:28px;box-shadow:0 2px 12px rgba(0,119,190,0.1)">
            <h2 style="color:#1f2937;font-size:18px;margin:0 0 12px">Password Reset Request</h2>
            <p style="color:#6b7280;font-size:14px;line-height:1.7;margin:0 0 24px">
              We received a request to reset your admin password. Click the button below to set a new password. This link expires in <strong>30 minutes</strong>.
            </p>
            <div style="text-align:center;margin-bottom:24px">
              <a href="${resetUrl}"
                style="display:inline-block;padding:14px 32px;background:#0077be;color:#fff;text-decoration:none;border-radius:8px;font-weight:700;font-size:15px">
                Reset Password
              </a>
            </div>
            <p style="color:#9ca3af;font-size:12px;margin:0;text-align:center">
              If you didn't request this, ignore this email. Your password won't change.
            </p>
          </div>
          <p style="color:#9ca3af;font-size:11px;text-align:center;margin-top:20px">
            Link expires at ${expiresAt.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Forgot password error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
