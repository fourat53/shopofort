"use server";

import { updateTag } from "next/cache";
import { prisma } from "@/lib/prisma";

async function createProduct(formData: FormData) {
	const name = formData.get("name") as string;
	const brand = formData.get("brand") as string;
	const price = Number(formData.get("price"));
	const inventory = Number(formData.get("inventory"));
	const description = formData.get("description") as string;
	const categoryId = formData.get("categoryId")
		? Number(formData.get("categoryId"))
		: null;

	await prisma.product.create({
		data: {
			name,
			brand,
			price,
			inventory,
			description,
			categoryId,
		},
	});

	updateTag("products");
}

async function getProductsOptions() {
	const products = await prisma.product.findMany({
		select: { id: true, name: true },
		orderBy: { id: "asc" },
	});
	return products.map((p) => ({
		value: String(p.id),
		label: `${p.id} - ${p.name}`,
	}));
}

export { createProduct, getProductsOptions };
