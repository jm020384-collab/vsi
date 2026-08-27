import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

import { auth } from "@/auth";

const f = createUploadthing();

/** Лише автентифікований фахівець може завантажувати файли профілю. */
async function requireTherapist() {
  const session = await auth();
  if (!session?.user || (session.user.role !== "THERAPIST" && session.user.role !== "ADMIN")) {
    throw new UploadThingError("Потрібно увійти як фахівець");
  }
  return { userId: session.user.id };
}

export const fileRouter = {
  profilePhoto: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(requireTherapist)
    .onUploadComplete(() => {}),

  diplomaDocument: f({
    image: { maxFileSize: "8MB", maxFileCount: 5 },
    pdf: { maxFileSize: "8MB", maxFileCount: 5 },
  })
    .middleware(requireTherapist)
    .onUploadComplete(() => {}),

  eventImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(requireTherapist)
    .onUploadComplete(() => {}),

  articleCover: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(requireTherapist)
    .onUploadComplete(() => {}),
} satisfies FileRouter;

export type AppFileRouter = typeof fileRouter;
