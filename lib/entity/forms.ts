import {
	type Audience,
	EntityType,
	type OrderStatus,
	type ProductColor,
	type ProductSize,
} from "@/lib/entity/types";

function getFormUser(formData: FormData) {
	const picture = formData.get("picture");
	const given_name = formData.get("first_name");
	const family_name = formData.get("last_name");
	const is_suspended = formData.get("is_suspended");

	const data: Record<string, unknown> = {};
	if (picture !== null) data.picture = picture;
	if (given_name !== null) data.given_name = given_name;
	if (family_name !== null) data.family_name = family_name;
	if (is_suspended !== null) data.is_suspended = is_suspended;
	return data;
}

function getFormProduct(formData: FormData) {
	const name = formData.get("name");
	const brand = formData.get("brand");
	const price = formData.get("price");
	const inventory = formData.get("inventory");
	const description = formData.get("description");
	const colors = formData.getAll("colors").map(String) as ProductColor[];
	const sizes = formData.getAll("sizes").map(String) as ProductSize[];
	const categoryId = formData.get("categoryId");
	const images = formData.getAll("images").map(String);

	const data: Record<string, unknown> = {};
	if (name !== null) data.name = name;
	if (brand !== null) data.brand = brand;
	if (price !== null) data.price = Number(price);
	if (inventory !== null) data.inventory = Number(inventory);
	if (description !== null) data.description = description;
	if (colors.length > 0) data.colors = colors;
	if (sizes.length > 0) data.sizes = sizes;
	if (categoryId !== null) data.categoryId = Number(categoryId);
	if (images.length > 0) data.images = images;
	return data;
}

function getFormOrder(formData: FormData) {
	const orderDate = formData.get("orderDate");
	const totalPrice = formData.get("totalPrice");
	const orderStatus = formData.get("orderStatus");
	const userId = formData.get("userId");

	const data: Record<string, unknown> = {};
	if (orderDate !== null) data.orderDate = new Date(orderDate as string);
	if (totalPrice !== null) data.totalPrice = Number(totalPrice);
	if (orderStatus !== null) data.orderStatus = orderStatus as OrderStatus;
	if (userId !== null) data.userId = String(userId);
	return data;
}

function getFormCart(formData: FormData) {
	const userId = formData.get("userId");
	const totalPrice = formData.get("totalPrice");

	const data: Record<string, unknown> = {};
	if (userId !== null) data.userId = String(userId);
	if (totalPrice !== null) data.totalPrice = Number(totalPrice);
	return data;
}

function getFormCategory(formData: FormData) {
	const name = formData.get("name");
	const audience = formData.get("audience");

	const data: Record<string, unknown> = {};
	if (name !== null) data.name = String(name);
	if (audience !== null) data.audience = audience as Audience;
	return data;
}

function getFormCartItem(formData: FormData) {
	const quantity = formData.get("quantity");
	const unitPrice = formData.get("unitPrice");
	const cartId = formData.get("cartId");
	const productId = formData.get("productId");

	const data: Record<string, unknown> = {};
	if (quantity !== null) data.quantity = Number(quantity);
	if (unitPrice !== null) data.unitPrice = Number(unitPrice);
	if (cartId !== null) data.cartId = Number(cartId);
	if (productId !== null) data.productId = Number(productId);
	return data;
}

function getFormOrderItem(formData: FormData) {
	const quantity = formData.get("quantity");
	const unitPrice = formData.get("unitPrice");
	const orderId = formData.get("orderId");
	const productId = formData.get("productId");

	const data: Record<string, unknown> = {};
	if (quantity !== null) data.quantity = Number(quantity);
	if (unitPrice !== null) data.unitPrice = Number(unitPrice);
	if (orderId !== null) data.orderId = Number(orderId);
	if (productId !== null) data.productId = Number(productId);
	return data;
}

function getFormEntity(entity: EntityType, formData: FormData) {
	switch (entity) {
		case EntityType.products:
			return getFormProduct(formData);
		case EntityType.orders:
			return getFormOrder(formData);
		case EntityType.carts:
			return getFormCart(formData);
		case EntityType.categories:
			return getFormCategory(formData);
		case EntityType["cart-items"]:
			return getFormCartItem(formData);
		case EntityType["order-items"]:
			return getFormOrderItem(formData);
	}
}

export {
	getFormCart,
	getFormCartItem,
	getFormCategory,
	getFormEntity,
	getFormOrder,
	getFormOrderItem,
	getFormProduct,
	getFormUser,
};
