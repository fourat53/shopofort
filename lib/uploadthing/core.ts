import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
	productImage: f({
		image: { maxFileSize: "8MB", maxFileCount: 100 },
	}).onUploadComplete(async ({ file }) => {
		return { url: file.ufsUrl };
	}),
	userPicture: f({
		image: { maxFileSize: "8MB", maxFileCount: 100 },
	}).onUploadComplete(async ({ file }) => {
		return { url: file.ufsUrl };
	}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
