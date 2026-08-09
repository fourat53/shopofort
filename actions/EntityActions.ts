"use server";

import { updateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { deleteUser, getUserById } from "./UserActions";

const tagMap: Record<string, string> = {
	user: "users",
	product: "products",
	order: "orders",
	cart: "carts",
	category: "categories",
	cartItem: "cart-items",
	orderItem: "order-items",
};

async function getEntityById(entity: string, id: number | string) {
	try {
		let data = null;
		if (entity === "user" && typeof id === "string") {
			data = await getUserById(id);
		} else if (typeof id === "number") {
			// @ts-expect-error - prisma dynamic model access
			data = await prisma[entity].findUnique({ where: { id } });
		}
		if (!data) return null;
		return JSON.parse(JSON.stringify(data));
	} catch (error) {
		console.error(error);
	}
}

async function deleteEntity(entity: string, id: number | string) {
	try {
		if (entity === "user" && typeof id === "string") {
			await deleteUser(id);

			await prisma.cart.delete({ where: { userId: id } });
			updateTag("carts");

			await prisma.order.deleteMany({ where: { userId: id } });
			updateTag("orders");
		} else if (typeof id === "number") {
			// @ts-expect-error - prisma dynamic model access
			await prisma[entity].delete({ where: { id } });

			const tag = tagMap[entity];
			if (tag) {
				updateTag(tag);
			}
		}
	} catch (error) {
		console.error(error);
	}
}

async function filterEntity(entity: string) {
	try {
		if (entity === "user") {
		} else {
		}
	} catch (error) {
		console.error(error);
	}
}

export { deleteEntity, filterEntity, getEntityById };
