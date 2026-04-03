import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async signIn({ user, account }) {
      // Always allow — we do NOT restrict by email anymore for public users
      // But we DO persist public users to our DB
      try {
        if (account?.provider === "google") {
          await connectDB();
          await User.findOneAndUpdate(
            { googleId: account.providerAccountId },
            {
              googleId: account.providerAccountId,
              email: user.email,
              name: user.name,
              image: user.image || "",
            },
            { upsert: true, new: true },
          );
        }
      } catch (err) {
        console.error("Error upserting user on signIn:", err);
        // Don't block sign-in if DB write fails
      }
      return true; // allow all Google users
    },

    async jwt({ token, account, profile }) {
      if (account?.provider === "google") {
        token.googleId = account.providerAccountId;
        token.isAdmin = token.email === process.env.ADMIN_GOOGLE_EMAIL;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.googleId = token.googleId;
      session.isAdmin = token.isAdmin || false;
      return session;
    },

    async redirect({ url, baseUrl }) {
      // After admin login, go to dashboard
      if (url.startsWith("/admin") || url.includes("admindashboard")) {
        return `${baseUrl}/admin/dashboard`;
      }
      // For public users, go back to homepage
      return baseUrl;
    },
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

async function wrappedHandler(req, res) {
  const response = await handler(req, res);
  // Replace no-store with private to allow bfcache
  if (response instanceof Response) {
    const newHeaders = new Headers(response.headers);
    newHeaders.set("Cache-Control", "private, max-age=0, must-revalidate");
    return new Response(response.body, {
      status: response.status,
      headers: newHeaders,
    });
  }
  return response;
}

export { wrappedHandler as GET, wrappedHandler as POST };
