import ReviewsSectionClient from "./ReviewsSectionClient";
import { connectDB } from "@/lib/db";
import Review from "@/models/Review";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function ReviewsSection() {
  await connectDB();
  const reviews = await Review.find({}).sort({ createdAt: -1 }).lean();
  const session = await getServerSession(authOptions);

  // Serialize for client
  const serialized = reviews.map((r) => ({
    _id: r._id.toString(),
    name: r.name,
    image: r.image || "",
    rating: r.rating,
    description: r.description,
    createdAt: r.createdAt.toISOString(),
  }));

  return (
    <ReviewsSectionClient
      initialReviews={serialized}
      userSession={
        session
          ? {
              name: session.user.name,
              image: session.user.image,
              email: session.user.email,
            }
          : null
      }
    />
  );
}
