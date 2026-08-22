"use server";

import { updateTag } from "next/cache";
import {
	deleteUser,
	getUserById,
	getUsers,
	updateUser,
} from "@/actions/UserActions";
import type { SelectOption } from "@/components/form-items/select";
import type { EntityType } from "@/lib/entity/current-entity";
import { getFormEntity } from "@/lib/entity/entity-form";
import { prisma } from "@/lib/prisma";

const tagMap: Record<EntityType, string> = {
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
		if (entity === "user") {
			return await getUserById(id as string);
		}
		// @ts-expect-error - prisma dynamic model access
		const res = await prisma[entity].findUnique({
			where: { id },
		});

		return JSON.parse(JSON.stringify(res));
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
			default: {
				return [];
			}
		}
	} catch (error) {
		console.error("Failed to fetch filter options", error);
		return [];
	}
}

async function createEntity(
	entity: Exclude<EntityType, "user">,
	formData: FormData,
) {
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

async function deleteEntity(entity: EntityType, id: number | string) {
	try {
		if (entity === "user") {
			await deleteUser(id as string);
		} else {
			// @ts-expect-error - prisma dynamic model access
			await prisma[entity].delete({ where: { id } });
			updateTag(tagMap[entity]);
		}
	} catch (error) {
		console.error(error);
	}
}

async function deleteEntities(entity: EntityType, ids: (number | string)[]) {
	if (ids.length === 0) return;

	try {
		if (entity === "user") {
			await Promise.allSettled(ids.map((id) => deleteUser(id as string)));
		} else {
			// @ts-expect-error - prisma dynamic model access
			await prisma[entity].deleteMany({ where: { id: { in: ids } } });
			updateTag(tagMap[entity]);
		}
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
		if (entity === "user") {
			await updateUser(id as string, formData);
		} else {
			const data = getFormEntity(entity, formData);
			// @ts-expect-error - prisma dynamic model access
			await prisma[entity].update({
				where: { id },
				data,
			});
			updateTag(tagMap[entity]);
		}
	} catch (error) {
		console.error(error);
	}
}

async function updateEntities(
	entity: EntityType,
	ids: (number | string)[],
	formData: FormData,
) {
	if (ids.length === 0) return;
	if (entity === "user") {
		await Promise.allSettled(
			ids.map((id) => updateUser(id as string, formData)),
		);
	} else {
		const data = getFormEntity(entity, formData);
		// @ts-expect-error - prisma dynamic model access
		await prisma[entity].updateMany({
			where: { id: { in: ids as number[] } },
			data,
		});
		updateTag(tagMap[entity]);
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
