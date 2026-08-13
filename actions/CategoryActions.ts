"use server";
import { updateTag } from "next/cache";
import type { CategoryName, Gender } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";

function getFormCategory(formData: FormData) {
	const name = formData.get("name") as CategoryName;
	const gender = formData.get("gender") as Gender;
	return { name, gender };
}

async function createCategory(formData: FormData) {
	await prisma.category.create({
		data: getFormCategory(formData),
	});
	updateTag("categories");
}

async function updateCategory(id: number, formData: FormData) {
	await prisma.category.update({
		where: { id },
		data: getFormCategory(formData),
	});
	updateTag("categories");
}

export { createCategory, updateCategory };
