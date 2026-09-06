import { generateReactHelpers } from "@uploadthing/react";
import type { ImageItem } from "@/components/form-items/image-upload";
import type { OurFileRouter } from "@/lib/uploadthing/core";
import { EntityType } from "../entity/types";

const { uploadFiles } = generateReactHelpers<OurFileRouter>();

type FileRoute = "userPicture" | "productImage";

type ImageField = "picture" | "images";

const fieldRouteMap: Record<ImageField, FileRoute> = {
	picture: "userPicture",
	images: "productImage",
};

async function uploadImages(
	files: File[],
	fileRoute: FileRoute,
): Promise<string[]> {
	if (files.length === 0) return [];
	try {
		const res = await uploadFiles(fileRoute, { files });
		return res.map((file) => file.ufsUrl);
	} catch {
		throw new Error(`Failed to upload files. Please try again.`);
	}
}

async function addImagesToForm(
	formData: FormData,
	images: ImageItem[],
	field: ImageField,
) {
	const existingUrls = images.filter(
		(img): img is string => typeof img === "string",
	);
	const newFiles = images.filter((img): img is File => img instanceof File);
	const newUrls = await uploadImages(newFiles, fieldRouteMap[field]);

	formData.delete(field);
	for (const url of [...existingUrls, ...newUrls]) {
		formData.append(field, url);
	}
}

async function addImageToForm(
	formData: FormData,
	image: ImageItem,
	field: ImageField,
) {
	if (typeof image === "string") return;

	if (image instanceof File) {
		formData.delete(field);
		const urls = await uploadImages([image], fieldRouteMap[field]);
		formData.append(field, urls[0]);
	}
}

async function addFilesToForm(
	entity: EntityType,
	formData: FormData,
	images: ImageItem[],
) {
	if (entity === EntityType.users)
		await addImageToForm(formData, images[0], "picture");
	else if (entity === EntityType.products)
		await addImagesToForm(formData, images, "images");
}

export { addFilesToForm, uploadFiles, uploadImages };
