import { generateReactHelpers } from "@uploadthing/react";
import type { ImageItem } from "@/components/form-items/image-upload";
import { EntityType } from "@/lib/entity/types";
import type { OurFileRouter } from "@/lib/uploadthing/core";

const { uploadFiles } = generateReactHelpers<OurFileRouter>();

type FileRoute = "userPicture" | "productImage";
type ImageField = "picture" | "images";

interface UploadConfig {
	field: ImageField;
	fileRoute: FileRoute;
	multiple: boolean;
}

const uploadConfig: Partial<Record<EntityType, UploadConfig>> = {
	[EntityType.users]: {
		field: "picture",
		fileRoute: "userPicture",
		multiple: false,
	},
	[EntityType.products]: {
		field: "images",
		fileRoute: "productImage",
		multiple: true,
	},
};

async function uploadImages(
	files: File[],
	fileRoute: FileRoute,
): Promise<string[]> {
	if (files.length === 0) return [];
	try {
		const res = await uploadFiles(fileRoute, { files });
		return res.map((file) => file.ufsUrl);
	} catch (e) {
		console.error(e);
		throw e;
	}
}

async function addImagesToForm(
	formData: FormData,
	images: ImageItem[],
	field: ImageField,
	fileRoute: FileRoute,
) {
	const newFiles = images.filter((img) => img instanceof File);
	const newUrls = await uploadImages(newFiles, fileRoute);
	const oldUrls = images.filter((img) => typeof img === "string");

	formData.delete(field);

	for (const url of [...oldUrls, ...newUrls]) {
		formData.append(field, url);
	}
}

async function addImageToForm(
	formData: FormData,
	image: ImageItem | undefined,
	field: ImageField,
	fileRoute: FileRoute,
) {
	formData.delete(field);

	if (typeof image === "string") {
		formData.append(field, image);
	} else if (image === undefined) {
		formData.append(field, "");
	} else {
		const urls = await uploadImages([image], fileRoute);
		if (urls[0]) formData.append(field, urls[0]);
	}
}

async function addImages(
	entity: EntityType,
	formData: FormData,
	images: ImageItem[],
) {
	const { field, fileRoute, multiple } = uploadConfig[entity] ?? {};
	if (!field || !fileRoute) return;

	if (multiple) {
		await addImagesToForm(formData, images, field, fileRoute);
	} else {
		await addImageToForm(formData, images[0], field, fileRoute);
	}
}

export { addImages, uploadConfig };
