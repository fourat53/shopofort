"use server";

import { updateTag } from "next/cache";
import { prisma } from "@/lib/prisma";

const tagMap: Record<string, string> = {
	user: "users",
	product: "products",
	order: "orders",
	cart: "carts",
	category: "categories",
	cartItem: "cart-items",
	orderItem: "order-items",
};

async function getEntityById(entity: string, id: number) {
	try {
		let data = null;
		if (entity === "user") {
			data = await prisma.user.findUnique({
				where: { id },
				omit: {
					kindeId: true,
					providedId: true,
					givenName: true,
					familyName: true,
					password: true,
					createdOn: true,
					organizations: true,
					identities: true,
				},
			});
		} else {
			// @ts-expect-error - prisma dynamic model access
			data = await prisma[entity].findUnique({ where: { id } });
		}
		if (!data) return null;
		return JSON.parse(JSON.stringify(data));
	} catch (error) {
		console.error(error);
	}
}

async function deleteEntity(entity: string, id: number) {
	try {
		// @ts-expect-error - prisma dynamic model access
		await prisma[entity].delete({ where: { id } });

		const tag = tagMap[entity];
		if (tag) {
			updateTag(tag);
		}
	} catch (error) {
		console.error(error);
	}
}

export { deleteEntity, getEntityById };
