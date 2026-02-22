import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

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
    async signIn({ user }) {
      console.log("🧪 signIn:", user.email);
      const isAllowed = user.email === process.env.ADMIN_GOOGLE_EMAIL;
      console.log("🧪 signIn allowed?", isAllowed);
      return isAllowed;
    },

    async redirect({ url, baseUrl }) {
      // After successful signIn, redirect to dashboard
      if (url.startsWith("/admin/dashboard")) return url;
      return `${baseUrl}/admin/dashboard`;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
