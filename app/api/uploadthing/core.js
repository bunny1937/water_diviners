import { createUploadthing } from "uploadthing/next";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const f = createUploadthing();

async function verifyAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("adminToken")?.value;
  if (!token) return false;
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      if (!(await verifyAdmin())) throw new Error("Unauthorized");
      return {};
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.url };
    }),

  videoUploader: f({ video: { maxFileSize: "64MB", maxFileCount: 1 } })
    .middleware(async () => {
      if (!(await verifyAdmin())) throw new Error("Unauthorized");
      return {};
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.url };
    }),
};
