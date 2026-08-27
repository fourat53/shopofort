"use server";

import { updateTag } from "next/cache";
import {
	deleteUser,
	getUserById,
	getUserCount,
	getUsers,
	updateUser,
} from "@/actions/UserActions";
import type { SelectOption } from "@/components/form-items/select";
import { getFormEntity } from "@/lib/entity/entity-form";
import { formatOption } from "@/lib/entity/entity-functions";
import {
	EntityType,
	type OptionField,
	type ParameterType,
	type StringNumber,
} from "@/lib/entity/types";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/prisma/generated/prisma/client";
import { getCartCount } from "./CartActions";
import { getCartItemCount } from "./CartItemActions";
import { getCategoryCount } from "./CategoryActions";
import { getOrderCount } from "./OrderActions";
import { getOrderItemCount } from "./OrderItemActions";
import { getProductCount } from "./ProductActions";

async function getFilterOptions(field: OptionField): Promise<SelectOption[]> {
	try {
		switch (field) {
			case "categoryId": {
				const categories = await prisma.category.findMany({
					orderBy: { name: "asc" },
				});
				return categories.map((c) => formatOption(c.id, [c.name, c.gender]));
			}
			case "productId": {
				const products = await prisma.product.findMany({
					select: { id: true, name: true },
					orderBy: { name: "asc" },
				});
				return products.map((p) => formatOption(p.id, [p.id, p.name]));
			}
			case "cartId": {
				const carts = await prisma.cart.findMany({
					select: { id: true, userId: true },
					orderBy: { id: "asc" },
				});
				return carts.map((c) => formatOption(c.id, [c.id, `UID: ${c.userId}`]));
			}
			case "orderId": {
				const orders = await prisma.order.findMany({
					select: { id: true, userId: true },
					orderBy: { id: "asc" },
				});
				return orders.map((o) =>
					formatOption(o.id, [o.id, `UID: ${o.userId}`]),
				);
			}
			case "userId": {
				const users = await getUsers();
				return users.map((u) => formatOption(u.id, [u.id, u.email]));
			}
			case "cartItemId": {
				const cartItems = await prisma.cartItem.findMany({
					select: { id: true, cartId: true, productId: true },
					orderBy: { id: "asc" },
				});
				return cartItems.map((c) =>
					formatOption(c.id, [c.id, `CID: ${c.cartId} - PID: ${c.productId}`]),
				);
			}
			case "orderItemId": {
				const orderItems = await prisma.orderItem.findMany({
					select: { id: true, orderId: true, productId: true },
					orderBy: { id: "asc" },
				});
				return orderItems.map((o) =>
					formatOption(o.id, [o.id, `OID: ${o.orderId} - PID: ${o.productId}`]),
				);
			}
			default:
				return [];
		}
	} catch (error) {
		console.error(error);
		return [];
	}
}

async function getEntityById(entity: EntityType, id: string) {
	const where = { where: { id: Number(id) } };
	let result: unknown;
	try {
		if (entity === EntityType.users) result = await getUserById(id);
		else if (entity === EntityType.carts)
			result = await prisma.cart.findUnique(where);
		else if (entity === EntityType.orders)
			result = await prisma.order.findUnique(where);
		else if (entity === EntityType.products)
			result = await prisma.product.findUnique(where);
		else if (entity === EntityType.categories)
			result = await prisma.category.findUnique(where);
		else if (entity === EntityType["cart-items"])
			result = await prisma.cartItem.findUnique(where);
		else if (entity === EntityType["order-items"])
			result = await prisma.orderItem.findUnique(where);

		return JSON.parse(JSON.stringify(result));
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
		switch (entity) {
			case EntityType.carts:
				return await prisma.cart.create({
					data: data as Prisma.CartCreateInput,
				});
			case EntityType.orders:
				return await prisma.order.create({
					data: data as Prisma.OrderCreateInput,
				});
			case EntityType.products:
				return await prisma.product.create({
					data: data as Prisma.ProductCreateInput,
				});
			case EntityType.categories:
				return await prisma.category.create({
					data: data as Prisma.CategoryCreateInput,
				});
			case EntityType["cart-items"]:
				return await prisma.cartItem.create({
					data: data as unknown as Prisma.CartItemCreateInput,
				});
			case EntityType["order-items"]:
				return await prisma.orderItem.create({
					data: data as unknown as Prisma.OrderItemCreateInput,
				});
		}
	} catch (error) {
		console.error(error);
	} finally {
		updateTag(entity);
	}
}

async function deleteEntity(entity: EntityType, id: StringNumber) {
	const where = { where: { id: id as number } };
	try {
		switch (entity) {
			case EntityType.users:
				return await deleteUser(id as string);
			case EntityType.carts:
				return await prisma.cart.delete(where);
			case EntityType.orders:
				return await prisma.order.delete(where);
			case EntityType.products:
				return await prisma.product.delete(where);
			case EntityType.categories:
				return await prisma.category.delete(where);
			case EntityType["cart-items"]:
				return await prisma.cartItem.delete(where);
			case EntityType["order-items"]:
				return await prisma.orderItem.delete(where);
		}
	} catch (error) {
		console.error(error);
	} finally {
		updateTag(entity);
	}
}

async function deleteEntities(entity: EntityType, ids: StringNumber[]) {
	if (ids.length === 0) return;
	const where = { where: { id: { in: ids as number[] } } };
	try {
		switch (entity) {
			case EntityType.users:
				return await Promise.allSettled(
					ids.map((id) => deleteUser(id as string)),
				);
			case EntityType.carts:
				return await prisma.cart.deleteMany(where);
			case EntityType.orders:
				return await prisma.order.deleteMany(where);
			case EntityType.products:
				return await prisma.product.deleteMany(where);
			case EntityType.categories:
				return await prisma.category.deleteMany(where);
			case EntityType["cart-items"]:
				return await prisma.cartItem.deleteMany(where);
			case EntityType["order-items"]:
				return await prisma.orderItem.deleteMany(where);
		}
	} catch (error) {
		console.error(error);
	} finally {
		updateTag(entity);
	}
}

async function updateEntity(
	entity: EntityType,
	id: StringNumber,
	formData: FormData,
) {
	const data = getFormEntity(entity, formData);
	const where = { id: id as number };
	try {
		switch (entity) {
			case EntityType.users:
				return await updateUser(id as string, formData);
			case EntityType.carts:
				return await prisma.cart.update({
					where,
					data: data as Prisma.CartUpdateInput,
				});
			case EntityType.orders:
				return await prisma.order.update({
					where,
					data: data as Prisma.OrderUpdateInput,
				});
			case EntityType.products:
				return await prisma.product.update({
					where,
					data: data as Prisma.ProductUpdateInput,
				});
			case EntityType.categories:
				return await prisma.category.update({
					where,
					data: data as Prisma.CategoryUpdateInput,
				});
			case EntityType["cart-items"]:
				return await prisma.cartItem.update({
					where,
					data: data as Prisma.CartItemUpdateInput,
				});
			case EntityType["order-items"]:
				return await prisma.orderItem.update({
					where,
					data: data as Prisma.OrderItemUpdateInput,
				});
		}
	} catch (error) {
		console.error(error);
	} finally {
		updateTag(entity);
	}
}

async function updateEntities(
	entity: EntityType,
	ids: StringNumber[],
	formData: FormData,
) {
	if (ids.length === 0) return;
	const data = getFormEntity(entity, formData);
	const where = { id: { in: ids as number[] } };
	try {
		switch (entity) {
			case EntityType.users:
				return await Promise.allSettled(
					ids.map((id) => updateUser(id as string, formData)),
				);
			case EntityType.carts:
				return await prisma.cart.updateMany({
					where,
					data: data as Prisma.CartUpdateManyMutationInput,
				});
			case EntityType.orders:
				return await prisma.order.updateMany({
					where,
					data: data as Prisma.OrderUpdateManyMutationInput,
				});
			case EntityType.products:
				return await prisma.product.updateMany({
					where,
					data: data as Prisma.ProductUpdateManyMutationInput,
				});
			case EntityType.categories:
				return await prisma.category.updateMany({
					where,
					data: data as Prisma.CategoryUpdateManyMutationInput,
				});
			case EntityType["cart-items"]:
				return await prisma.cartItem.updateMany({
					where,
					data: data as Prisma.CartItemUpdateManyMutationInput,
				});
			case EntityType["order-items"]:
				return await prisma.orderItem.updateMany({
					where,
					data: data as Prisma.OrderItemUpdateManyMutationInput,
				});
		}
	} catch (error) {
		console.error(error);
	} finally {
		updateTag(entity);
	}
}

async function getEntityCount(
	entity: EntityType,
	filterParams: ParameterType = {},
) {
	switch (entity) {
		case EntityType.users:
			return await getUserCount(filterParams);
		case EntityType.carts:
			return await getCartCount(filterParams);
		case EntityType.orders:
			return await getOrderCount(filterParams);
		case EntityType.products:
			return await getProductCount(filterParams);
		case EntityType.categories:
			return await getCategoryCount(filterParams);
		case EntityType["cart-items"]:
			return await getCartItemCount(filterParams);
		case "order-items":
			return await getOrderItemCount(filterParams);
		default:
			return 0;
	}
}

async function updateCache() {
	try {
		for (const tag of Object.values(EntityType)) updateTag(tag);
	} catch (error) {
		console.error(error);
	}
}

export {
	createEntity,
	deleteEntities,
	deleteEntity,
	getEntityById,
	getEntityCount,
	getFilterOptions,
	updateCache,
	updateEntities,
	updateEntity,
};
