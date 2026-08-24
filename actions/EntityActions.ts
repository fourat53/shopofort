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
import { formatOptions, type OptionField } from "@/lib/entity/entity-fields";
import { getFormEntity, tagMap } from "@/lib/entity/entity-form";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/prisma/generated/prisma/client";

async function getFilterOptions(field: OptionField): Promise<SelectOption[]> {
	try {
		if (field === "categoryId") {
			const categories = await prisma.category.findMany({
				orderBy: { name: "asc" },
			});
			return categories.map((c) => formatOptions(c.id, [c.name, c.gender]));
		} else if (field === "productId") {
			const products = await prisma.product.findMany({
				select: { id: true, name: true },
				orderBy: { name: "asc" },
			});
			return products.map((p) => formatOptions(p.id, [p.id, p.name]));
		} else if (field === "cartId") {
			const carts = await prisma.cart.findMany({
				select: { id: true, userId: true },
				orderBy: { id: "asc" },
			});
			return carts.map((c) => formatOptions(c.id, [c.id, `UID: ${c.userId}`]));
		} else if (field === "orderId") {
			const orders = await prisma.order.findMany({
				select: { id: true, userId: true },
				orderBy: { id: "asc" },
			});
			return orders.map((o) => formatOptions(o.id, [o.id, `UID: ${o.userId}`]));
		} else if (field === "userId") {
			const users = await getUsers();
			return users.map((u) => formatOptions(u.id, [u.id, u.email]));
		} else if (field === "cartItemId") {
			const cartItems = await prisma.cartItem.findMany({
				select: { id: true, cartId: true, productId: true },
				orderBy: { id: "asc" },
			});
			return cartItems.map((c) =>
				formatOptions(c.id, [c.id, `CID: ${c.cartId} - PID: ${c.productId}`]),
			);
		} else if (field === "orderItemId") {
			const orderItems = await prisma.orderItem.findMany({
				select: { id: true, orderId: true, productId: true },
				orderBy: { id: "asc" },
			});
			return orderItems.map((o) =>
				formatOptions(o.id, [o.id, `OID: ${o.orderId} - PID: ${o.productId}`]),
			);
		} else return [];
	} catch (error) {
		console.error(error);
		return [];
	}
}

async function getEntityById(entity: EntityType, id: number | string) {
	const where = { where: { id: id as number } };
	try {
		if (entity === "user") {
			return await getUserById(id as string);
		} else if (entity === "cart") {
			return await prisma.cart.findUnique(where);
		} else if (entity === "order") {
			return await prisma.order.findUnique(where);
		} else if (entity === "product") {
			return await prisma.product.findUnique(where);
		} else if (entity === "category") {
			return await prisma.category.findUnique(where);
		} else if (entity === "cartItem") {
			return await prisma.cartItem.findUnique(where);
		} else if (entity === "orderItem") {
			return await prisma.orderItem.findUnique(where);
		}
	} catch (error) {
		console.error(error);
	}
}

async function createEntity(
	entity: Exclude<EntityType, "user">,
	formData: FormData,
) {
	const data = getFormEntity(entity, formData);
	try {
		if (entity === "cart") {
			await prisma.cart.create({
				data: data as Prisma.CartCreateInput,
			});
		} else if (entity === "order") {
			await prisma.order.create({
				data: data as Prisma.OrderCreateInput,
			});
		} else if (entity === "product") {
			await prisma.product.create({
				data: data as Prisma.ProductCreateInput,
			});
		} else if (entity === "category") {
			await prisma.category.create({
				data: data as Prisma.CategoryCreateInput,
			});
		} else if (entity === "cartItem") {
			await prisma.cartItem.create({
				data: data as unknown as Prisma.CartItemCreateInput,
			});
		} else if (entity === "orderItem") {
			await prisma.orderItem.create({
				data: data as unknown as Prisma.OrderItemCreateInput,
			});
		}
		updateTag(tagMap[entity]);
	} catch (error) {
		console.error(error);
	}
}

async function deleteEntity(entity: EntityType, id: number | string) {
	const where = { where: { id: id as number } };
	try {
		if (entity === "user") {
			await deleteUser(id as string);
		} else if (entity === "cart") {
			await prisma.cart.delete(where);
		} else if (entity === "order") {
			await prisma.order.delete(where);
		} else if (entity === "product") {
			await prisma.product.delete(where);
		} else if (entity === "category") {
			await prisma.category.delete(where);
		} else if (entity === "cartItem") {
			await prisma.cartItem.delete(where);
		} else if (entity === "orderItem") {
			await prisma.orderItem.delete(where);
		}
		updateTag(tagMap[entity]);
	} catch (error) {
		console.error(error);
	}
}

async function deleteEntities(entity: EntityType, ids: (number | string)[]) {
	if (ids.length === 0) return;
	const where = { where: { id: { in: ids as number[] } } };
	try {
		if (entity === "user") {
			await Promise.allSettled(ids.map((id) => deleteUser(id as string)));
		} else if (entity === "cart") {
			await prisma.cart.deleteMany(where);
		} else if (entity === "order") {
			await prisma.order.deleteMany(where);
		} else if (entity === "product") {
			await prisma.product.deleteMany(where);
		} else if (entity === "category") {
			await prisma.category.deleteMany(where);
		} else if (entity === "cartItem") {
			await prisma.cartItem.deleteMany(where);
		} else if (entity === "orderItem") {
			await prisma.orderItem.deleteMany(where);
		}
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
	const data = getFormEntity(entity, formData);
	const where = { id: id as number };
	try {
		if (entity === "user") {
			await updateUser(id as string, formData);
		} else if (entity === "cart") {
			await prisma.cart.update({
				where,
				data: data as Prisma.CartUpdateInput,
			});
		} else if (entity === "order") {
			await prisma.order.update({
				where,
				data: data as Prisma.OrderUpdateInput,
			});
		} else if (entity === "product") {
			await prisma.product.update({
				where,
				data: data as Prisma.ProductUpdateInput,
			});
		} else if (entity === "category") {
			await prisma.category.update({
				where,
				data: data as Prisma.CategoryUpdateInput,
			});
		} else if (entity === "cartItem") {
			await prisma.cartItem.update({
				where,
				data: data as Prisma.CartItemUpdateInput,
			});
		} else if (entity === "orderItem") {
			await prisma.orderItem.update({
				where,
				data: data as Prisma.OrderItemUpdateInput,
			});
		}
		updateTag(tagMap[entity]);
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
	const data = getFormEntity(entity, formData);
	const where = { id: { in: ids as number[] } };
	try {
		if (entity === "user") {
			await Promise.allSettled(
				ids.map((id) => updateUser(id as string, formData)),
			);
		} else if (entity === "cart") {
			await prisma.cart.updateMany({
				where,
				data: data as Prisma.CartUpdateManyMutationInput,
			});
		} else if (entity === "order") {
			await prisma.order.updateMany({
				where,
				data: data as Prisma.OrderUpdateManyMutationInput,
			});
		} else if (entity === "product") {
			await prisma.product.updateMany({
				where,
				data: data as Prisma.ProductUpdateManyMutationInput,
			});
		} else if (entity === "category") {
			await prisma.category.updateMany({
				where,
				data: data as Prisma.CategoryUpdateManyMutationInput,
			});
		} else if (entity === "cartItem") {
			await prisma.cartItem.updateMany({
				where,
				data: data as Prisma.CartItemUpdateManyMutationInput,
			});
		} else if (entity === "orderItem") {
			await prisma.orderItem.updateMany({
				where,
				data: data as Prisma.OrderItemUpdateManyMutationInput,
			});
		}
		updateTag(tagMap[entity]);
	} catch (error) {
		console.error(error);
	}
}

async function updateCache() {
	try {
		for (const tag of Object.values(tagMap)) {
			updateTag(tag);
		}
	} catch (error) {
		console.error(error);
	}
}

export {
	createEntity,
	deleteEntities,
	deleteEntity,
	getEntityById,
	getFilterOptions,
	updateCache,
	updateEntities,
	updateEntity,
};
