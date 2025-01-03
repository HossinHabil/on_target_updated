import { db } from "@/lib/db";
import { headers } from "next/headers";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const fileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const headersList = await headers();
      const transactionCode = headersList.get("id");

      return { user: transactionCode };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      try {
        const newUploadedUrl = file.url;
        if (!metadata.user) {
          return { uploadedUrl: newUploadedUrl };
        }

        const existingData = await db.client.findUnique({
          where: { transactionCode: metadata.user },
          select: { imageUrl: true }, // Only fetch the imageUrl field
        });

        if (!existingData) {
          throw new UploadThingError("Client not found");
        }

        const updatedImageUrl = existingData.imageUrl
          ? [...existingData.imageUrl, newUploadedUrl]
          : [newUploadedUrl];

        await db.client.update({
          where: { transactionCode: metadata.user },
          data: {
            imageUrl: updatedImageUrl,
          },
        });

        return { uploadedUrl: newUploadedUrl };
      } catch (error) {
        throw new UploadThingError("Something went wrong");
      }
    }),
} satisfies FileRouter;

export type AppFileRouter = typeof fileRouter;
