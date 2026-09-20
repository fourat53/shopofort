"use server";

import { updateTag } from "next/cache";
import {
	createCart,
	deleteCart,
	deleteCarts,
	getCartCount,
	getCartsPage,
	updateCart,
	updateCarts,
} from "@/actions/CartActions";
import {
	createCartItem,
	deleteCartItem,
	deleteCartItems,
	getCartItemCount,
	getCartItemsPage,
	updateCartItem,
	updateCartItems,
} from "@/actions/CartItemActions";
import {
	createCategory,
	deleteCategories,
	deleteCategory,
	getCategoriesPage,
	getCategoryCount,
	updateCategories,
	updateCategory,
} from "@/actions/CategoryActions";
import {
	createOrder,
	deleteOrder,
	deleteOrders,
	getOrderCount,
	getOrdersPage,
	updateOrder,
	updateOrders,
} from "@/actions/OrderActions";
import {
	createOrderItem,
	deleteOrderItem,
	deleteOrderItems,
	getOrderItemCount,
	getOrderItemsPage,
	updateOrderItem,
	updateOrderItems,
} from "@/actions/OrderItemActions";
import {
	createProduct,
	deleteProduct,
	deleteProducts,
	getProductCount,
	getProductsPage,
	updateProduct,
	updateProducts,
} from "@/actions/ProductActions";
import {
	deleteUser,
	deleteUsers,
	getUserById,
	getUserCount,
	getUsers,
	getUsersPage,
	updateUser,
	updateUsers,
} from "@/actions/UserActions";
import type { SelectOption } from "@/components/form-items/select";
import {
	type EntityRow,
	EntityType,
	OptionField,
	type ParameterType,
} from "@/lib/entity/types";
import { formatOption } from "@/lib/functions/server";
import { prisma } from "@/lib/prisma";

// GET
async function getEntitiesPage<T extends EntityType>(
	entity: T,
	filterParams: ParameterType = {},
	page: number = 1,
	pageSize: number = 10000,
	order: "asc" | "desc" = "asc",
	sortBy: string = "id",
): Promise<EntityRow<T>[]> {
	const params = [filterParams, page, pageSize, order, sortBy] as const;

	switch (entity) {
		case EntityType.users:
			return (await getUsersPage(...params)) as EntityRow<T>[];
		case EntityType.carts:
			return (await getCartsPage(...params)) as EntityRow<T>[];
		case EntityType.orders:
			return (await getOrdersPage(...params)) as EntityRow<T>[];
		case EntityType.products:
			return (await getProductsPage(...params)) as EntityRow<T>[];
		case EntityType.categories:
			return (await getCategoriesPage(...params)) as EntityRow<T>[];
		case EntityType["cart-items"]:
			return (await getCartItemsPage(...params)) as EntityRow<T>[];
		case EntityType["order-items"]:
			return (await getOrderItemsPage(...params)) as EntityRow<T>[];
		default:
			throw new Error(`Unsupported entity: ${entity}`);
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
		case EntityType["order-items"]:
			return await getOrderItemCount(filterParams);
	}
}

async function getEntityById(entity: EntityType, id: string | number) {
	const where = { where: { id: Number(id) } };
	let result: unknown;
	try {
		if (entity === EntityType.users) result = await getUserById(id as string);
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
		throw error;
	}
}

async function getFilterOptions(field: OptionField): Promise<SelectOption[]> {
	try {
		switch (field) {
			case OptionField.categoryId: {
				const categories = await prisma.category.findMany({
					orderBy: { name: "asc" },
				});
				return categories.map((c) => formatOption(c.id, [c.name, c.audience]));
			}
			case OptionField.productId: {
				const products = await prisma.product.findMany({
					select: { id: true, name: true },
					orderBy: { name: "asc" },
				});
				return products.map((p) => formatOption(p.id, [p.id, p.name]));
			}
			case OptionField.cartId: {
				const carts = await prisma.cart.findMany({
					select: { id: true, userId: true },
					orderBy: { id: "asc" },
				});
				return carts.map((c) => formatOption(c.id, [c.id, `UID: ${c.userId}`]));
			}
			case OptionField.orderId: {
				const orders = await prisma.order.findMany({
					select: { id: true, userId: true },
					orderBy: { id: "asc" },
				});
				return orders.map((o) =>
					formatOption(o.id, [o.id, `UID: ${o.userId}`]),
				);
			}
			case OptionField.userId: {
				const users = await getUsers();
				return users.map((u) => formatOption(u.id, [u.id, u.email]));
			}
			case OptionField.cartItemId: {
				const cartItems = await prisma.cartItem.findMany({
					select: { id: true, cartId: true, productId: true },
					orderBy: { id: "asc" },
				});
				return cartItems.map((c) =>
					formatOption(c.id, [c.id, `CID: ${c.cartId} - PID: ${c.productId}`]),
				);
			}
			case OptionField.orderItemId: {
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
		throw error;
	}
}

// CREATE
async function createEntity(
	entity: Exclude<EntityType, "user">,
	formData: FormData,
) {
	let result: unknown;
	try {
		if (entity === EntityType.carts) {
			result = await createCart(formData);
		} else if (entity === EntityType.orders) {
			result = await createOrder(formData);
		} else if (entity === EntityType.categories) {
			result = await createCategory(formData);
		} else if (entity === EntityType.products) {
			result = await createProduct(formData);
		} else if (entity === EntityType["cart-items"]) {
			result = await createCartItem(formData);
		} else if (entity === EntityType["order-items"]) {
			result = await createOrderItem(formData);
		}
		return JSON.parse(JSON.stringify(result));
	} catch (error) {
		console.error(error);
		throw error;
	} finally {
		updateTag(entity);
	}
}

// DELETE
async function deleteEntity(entity: EntityType, id: string | number) {
	let result: unknown;
	try {
		if (entity === EntityType.users) {
			result = await deleteUser(id as string);
		} else if (entity === EntityType.carts) {
			result = await deleteCart(id as number);
		} else if (entity === EntityType.orders) {
			result = await deleteOrder(id as number);
		} else if (entity === EntityType.products) {
			result = await deleteProduct(id as number);
		} else if (entity === EntityType.categories) {
			result = await deleteCategory(id as number);
		} else if (entity === EntityType["cart-items"]) {
			result = await deleteCartItem(id as number);
		} else if (entity === EntityType["order-items"]) {
			result = await deleteOrderItem(id as number);
		}
		return JSON.parse(JSON.stringify(result));
	} catch (error) {
		console.error(error);
		throw error;
	} finally {
		updateTag(entity);
	}
}

async function deleteEntities(entity: EntityType, ids: (string | number)[]) {
	if (ids.length === 0) return;
	let result: unknown;
	try {
		if (entity === EntityType.users) {
			result = await deleteUsers(ids as string[]);
		} else if (entity === EntityType.carts) {
			result = await deleteCarts(ids as number[]);
		} else if (entity === EntityType.orders) {
			result = await deleteOrders(ids as number[]);
		} else if (entity === EntityType.products) {
			result = await deleteProducts(ids as number[]);
		} else if (entity === EntityType.categories) {
			result = await deleteCategories(ids as number[]);
		} else if (entity === EntityType["cart-items"]) {
			result = await deleteCartItems(ids as number[]);
		} else if (entity === EntityType["order-items"]) {
			result = await deleteOrderItems(ids as number[]);
		}
		return JSON.parse(JSON.stringify(result));
	} catch (error) {
		console.error(error);
		throw error;
	} finally {
		updateTag(entity);
	}
}

// UPDATE
async function updateEntity(
	entity: EntityType,
	id: string | number,
	formData: FormData,
) {
	let result: unknown;
	try {
		if (entity === EntityType.users) {
			result = await updateUser(id as string, formData);
		} else if (entity === EntityType.carts) {
			result = await updateCart(id as number, formData);
		} else if (entity === EntityType.orders) {
			result = await updateOrder(id as number, formData);
		} else if (entity === EntityType.products) {
			result = await updateProduct(id as number, formData);
		} else if (entity === EntityType.categories) {
			result = await updateCategory(id as number, formData);
		} else if (entity === EntityType["cart-items"]) {
			result = await updateCartItem(id as number, formData);
		} else if (entity === EntityType["order-items"]) {
			result = await updateOrderItem(id as number, formData);
		}
		return JSON.parse(JSON.stringify(result));
	} catch (error) {
		console.error(error);
		throw error;
	} finally {
		updateTag(entity);
	}
}

async function updateEntities(
	entity: EntityType,
	ids: (string | number)[],
	formData: FormData,
) {
	if (ids.length === 0) return;
	let result: unknown;
	try {
		if (entity === EntityType.users) {
			result = await updateUsers(ids as string[], formData);
		} else if (entity === EntityType.carts) {
			result = await updateCarts(ids as number[], formData);
		} else if (entity === EntityType.orders) {
			result = await updateOrders(ids as number[], formData);
		} else if (entity === EntityType.products) {
			result = await updateProducts(ids as number[], formData);
		} else if (entity === EntityType.categories) {
			result = await updateCategories(ids as number[], formData);
		} else if (entity === EntityType["cart-items"]) {
			result = await updateCartItems(ids as number[], formData);
		} else if (entity === EntityType["order-items"]) {
			result = await updateOrderItems(ids as number[], formData);
		}
		return JSON.parse(JSON.stringify(result));
	} catch (error) {
		console.error(error);
		throw error;
	} finally {
		updateTag(entity);
	}
}

async function updateCache() {
	try {
		for (const entity of Object.values(EntityType)) {
			updateTag(entity);
		}
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export {
	createEntity,
	deleteEntities,
	deleteEntity,
	getEntitiesPage,
	getEntityById,
	getEntityCount,
	getFilterOptions,
	updateCache,
	updateEntities,
	updateEntity,
};
