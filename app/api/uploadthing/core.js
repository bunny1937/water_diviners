import { createUploadthing } from "uploadthing/next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      const session = await getServerSession(authOptions);
      if (!session?.isAdmin) throw new Error("Unauthorized");
      return { email: session.user.email };
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.url };
    }),
};
