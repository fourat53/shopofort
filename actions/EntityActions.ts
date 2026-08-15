"use server";

import { updateTag } from "next/cache";
import {
	getKindeToken,
	getUsers,
	kindeIssuerUrl,
	mapUser,
} from "@/actions/UserActions";
import type { SelectOption } from "@/components/form-items/select";
import type { EntityType } from "@/lib/entity/current-entity";
import { getFormEntity, getFormUser } from "@/lib/entity/entity-form";
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

async function getEntityById(entity: EntityType, id: number | string) {
	try {
		if (entity === "user" && typeof id === "string") {
			const token = await getKindeToken();

			const res = await fetch(`${kindeIssuerUrl}/api/v1/user?id=${id}`, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
					Accept: "application/json",
				},
				cache: "no-store",
			});

			const user = await res.json();
			return mapUser(user);
		} else if (typeof id === "number") {
			// @ts-expect-error - prisma dynamic model access
			const res = await prisma[entity].findUnique({ where: { id } });
			return JSON.parse(JSON.stringify(res));
		}
	} catch (error) {
		console.error(error);
	}
}

async function deleteEntity(entity: EntityType, id: number | string) {
	try {
		if (typeof id === "string" && entity === "user") {
			const token = await getKindeToken();

			await fetch(`${kindeIssuerUrl}/api/v1/user?id=${id}`, {
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${token}`,
					Accept: "application/json",
				},
			});

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

async function createEntity(entity: EntityType, formData: FormData) {
	try {
		// @ts-expect-error - prisma dynamic model access
		await prisma[entity].create({
			data: getFormEntity(entity, formData),
		});
		updateTag(tagMap[entity]);
	} catch (error) {
		console.error(error);
	}
}

async function updateEntity(
	entity: EntityType,
	id: number | string,
	formData: FormData,
) {
	try {
		if (typeof id === "string" && entity === "user") {
			const token = await getKindeToken();

			const { picture, first_name, last_name, is_suspended } =
				getFormUser(formData);

			await fetch(`${kindeIssuerUrl}/api/v1/user?id=${id}`, {
				method: "PATCH",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				body: JSON.stringify({
					picture,
					given_name: first_name,
					family_name: last_name,
					is_suspended,
				}),
			});
		} else if (typeof id === "number") {
			// @ts-expect-error - prisma dynamic model access
			await prisma[entity].update({
				where: { id },
				data: getFormEntity(entity, formData),
			});
			updateTag("products");
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
					orderBy: { name: "asc" },
				});
				return categories.map((c) => ({
					value: c.id.toString(),
					label: [c.name, c.gender || "Any"],
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
				const users = await getUsers();
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

async function deleteEntities(entity: EntityType, ids: (number | string)[]) {
	if (ids.length === 0) return;
	await Promise.allSettled(ids.map((id) => deleteEntity(entity, id)));
}

async function updateEntities(
	entity: EntityType,
	ids: (number | string)[],
	formData: FormData,
) {
	if (ids.length === 0) return;
	if (entity === "user") {
		await Promise.allSettled(
			ids.map((id) => updateEntity(entity, id, formData)),
		);
	} else {
		const data = getFormEntity(entity, formData);
		// @ts-expect-error - prisma dynamic model access
		await prisma[entity].updateMany({
			where: { id: { in: ids as number[] } },
			data,
		});
		const tag = tagMap[entity];
		if (tag) updateTag(tag);
	}
}

export {
	createEntity,
	deleteEntities,
	deleteEntity,
	getEntityById,
	getFilterOptions,
	updateEntities,
	updateEntity,
};
