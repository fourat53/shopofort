import { generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "@/lib/uploadthing/core";

export const { uploadFiles } = generateReactHelpers<OurFileRouter>();

export async function uploadImages(files: File[]): Promise<string[]> {
	if (files.length === 0) return [];
	try {
		const res = await uploadFiles("productImage", { files });
		return res.map((file) => file.ufsUrl);
	} catch (error) {
		console.error(error);
		return [];
	}
}

export async function addImagesToForm(
	formData: FormData,
	images: (string | File)[],
) {
	const existingUrls = images.filter(
		(img): img is string => typeof img === "string",
	);
	const newFiles = images.filter((img): img is File => img instanceof File);
	const newUrls = await uploadImages(newFiles);

	formData.delete("images");
	for (const url of [...existingUrls, ...newUrls]) {
		formData.append("images", url);
	}
}
