"use server";

import { updateTag } from "next/cache";
import type { SelectOption } from "@/components/form-items/select";
import { prisma } from "@/lib/prisma";
import { getAllUsers } from "@/queries/UserQueries";
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

async function getFilterOptions(field: string): Promise<SelectOption[]> {
	try {
		switch (field) {
			case "categoryId": {
				const categories = await prisma.category.findMany({
					select: { id: true, name: true },
					orderBy: { name: "asc" },
				});
				return categories.map((c) => ({
					value: c.id.toString(),
					label: [c.id, c.name],
				}));
			}
			case "productId": {
				const products = await prisma.product.findMany({
					select: { id: true, name: true },
					orderBy: { name: "asc" },
				});
				return products.map((p) => ({
					value: p.id.toString(),
					label: [p.id, p.name],
				}));
			}
			case "cartId": {
				const carts = await prisma.cart.findMany({
					select: { id: true, userId: true },
					orderBy: { id: "asc" },
				});
				return carts.map((c) => ({
					value: c.id.toString(),
					label: [c.id, c.userId],
				}));
			}
			case "orderId": {
				const orders = await prisma.order.findMany({
					select: { id: true, userId: true },
					orderBy: { id: "asc" },
				});
				return orders.map((o) => ({
					value: o.id.toString(),
					label: [o.id, o.userId],
				}));
			}
			case "userId": {
				const users = await getAllUsers();
				return users.map((u) => ({
					value: u.id,
					label: [u.id, u.email],
				}));
			}
			default:
				return [];
		}
	} catch (error) {
		console.error("Failed to fetch filter options", error);
		return [];
	}
}

export { deleteEntity, getEntityById, getFilterOptions };
