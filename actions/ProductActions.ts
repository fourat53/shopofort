"use server";

import { updateTag } from "next/cache";
import { prisma } from "@/lib/prisma";

function getFormProduct(formData: FormData) {
	const name = formData.get("name") as string;
	const brand = formData.get("brand") as string;
	const price = Number(formData.get("price"));
	const inventory = Number(formData.get("inventory"));
	const description = formData.get("description") as string;
	const categoryId = formData.get("categoryId")
		? Number(formData.get("categoryId"))
		: null;
	return { name, brand, price, inventory, description, categoryId };
}

async function createProduct(formData: FormData) {
	await prisma.product.create({
		data: getFormProduct(formData),
	});
	updateTag("products");
}

async function updateProduct(id: number, formData: FormData) {
	await prisma.product.update({
		where: { id },
		data: getFormProduct(formData),
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

export { createProduct, getProductsOptions, updateProduct };
