import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import Review from "@/models/Review";
import User from "@/models/User";

// GET — fetch all reviews (public)
export async function GET() {
  try {
    await connectDB();
    const reviews = await Review.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ reviews });
  } catch (err) {
    console.error("GET reviews error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST — submit a review (must be logged in via Google)
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Find or create user
    let user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { error: "User not found. Please login again." },
        { status: 401 },
      );
    }

    // Anti-spam: 1 review per 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentReview = await Review.findOne({
      googleId: user.googleId,
      createdAt: { $gte: sevenDaysAgo },
    });
    if (recentReview) {
      return NextResponse.json(
        { error: "You can only post one review every 7 days." },
        { status: 429 },
      );
    }

    const { name, description, rating = 5 } = await req.json();

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be 1-5 stars." },
        { status: 400 },
      );
    }

    if (!name?.trim() || !description?.trim()) {
      return NextResponse.json(
        { error: "Name and description are required." },
        { status: 400 },
      );
    }
    if (description.trim().length < 10) {
      return NextResponse.json(
        { error: "Description must be at least 10 characters." },
        { status: 400 },
      );
    }
    if (description.trim().length > 600) {
      return NextResponse.json(
        { error: "Description must be under 600 characters." },
        { status: 400 },
      );
    }
    if (name.trim().length > 80) {
      return NextResponse.json({ error: "Name is too long." }, { status: 400 });
    }

    const review = await Review.create({
      userId: user._id,
      googleId: user.googleId,
      name: name.trim(),
      image: user.image || "",
      rating,
      description: description.trim(),
    });

    // Email admin
    try {
      const adminEmail =
        process.env.ADMIN_NOTIFY_EMAIL || process.env.ADMIN_GOOGLE_EMAIL;
      const brevoRes = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender: {
            name: "MMS Website",
            email: process.env.BREVO_SENDER_EMAIL,
          },
          to: [{ email: adminEmail }],
          subject: `New Review Posted by ${review.name}`,
          htmlContent: `
            <div style="font-family:system-ui,sans-serif;max-width:520px;margin:0 auto;padding:32px;background:#f0f9ff;border-radius:12px;">
              <h2 style="color:#0077be;margin:0 0 8px;">New Review on M.M.S Website</h2>
              <p style="color:#6b7280;font-size:13px;margin:0 0 24px;">A visitor just posted a review. Please check and delete if spam.</p>
              <div style="background:#fff;border-radius:10px;padding:24px;box-shadow:0 2px 12px rgba(0,119,190,0.1);">
                <div style="display:flex;align-items:center;gap:16px;margin-bottom:16px;">
                  ${review.image ? `<img src="${review.image}" alt="" style="width:48px;height:48px;border-radius:50%;object-fit:cover;" />` : ""}
                  <div>
                    <strong style="font-size:16px;color:#1f2937;">${review.name}</strong><br/>
                    <span style="font-size:12px;color:#9ca3af;">${user.email}</span>
                  </div>
                </div>
                <p style="color:#374151;font-size:15px;line-height:1.7;margin:0;">${review.description}</p>
              </div>
              <p style="font-size:12px;color:#9ca3af;text-align:center;margin-top:20px;">
                Posted at ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST
              </p>
            </div>
          `,
        }),
      });
      if (!brevoRes.ok) {
        const err = await brevoRes.json();
        console.error("Brevo error sending review notification:", err);
      }
    } catch (emailErr) {
      // Don't fail the request if email fails
      console.error("Failed to send admin review email:", emailErr);
    }

    return NextResponse.json({ review }, { status: 201 });
  } catch (err) {
    console.error("POST review error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
