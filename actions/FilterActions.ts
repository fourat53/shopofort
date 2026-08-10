"use server";

import { prisma } from "@/lib/prisma";

export async function getFilterOptions(field: string) {
	try {
		switch (field) {
			case "categoryId": {
				const categories = await prisma.category.findMany({
					select: { id: true, name: true },
					orderBy: { name: "asc" },
				});
				return categories.map((c) => ({
					value: c.id.toString(),
					label: c.name,
				}));
			}
			case "productId": {
				const products = await prisma.product.findMany({
					select: { id: true, name: true },
					orderBy: { name: "asc" },
				});
				return products.map((p) => ({
					value: p.id.toString(),
					label: p.name,
				}));
			}
			case "cartId": {
				const carts = await prisma.cart.findMany({
					select: { id: true },
					orderBy: { id: "asc" },
				});
				return carts.map((c) => ({
					value: c.id.toString(),
					label: `Cart #${c.id}`,
				}));
			}
			case "orderId": {
				const orders = await prisma.order.findMany({
					select: { id: true },
					orderBy: { id: "asc" },
				});
				return orders.map((o) => ({
					value: o.id.toString(),
					label: `Order #${o.id}`,
				}));
			}
			case "userId": {
				const carts = await prisma.cart.findMany({
					select: { userId: true },
					distinct: ["userId"],
				});
				return carts.map((c) => ({
					value: c.userId,
					label: c.userId,
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
