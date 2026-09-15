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
	return { picture, given_name, family_name, is_suspended };
}

function getFormProduct(formData: FormData) {
	const name = formData.get("name");
	const brand = formData.get("brand");
	const price = Number(formData.get("price"));
	const inventory = Number(formData.get("inventory"));
	const description = formData.get("description");
	const colors = formData.getAll("colors").map(String) as ProductColor[];
	const sizes = formData.getAll("sizes").map(String) as ProductSize[];
	const categoryId = Number(formData.get("categoryId"));
	const images = formData.getAll("images").map(String);
	return {
		name,
		brand,
		price,
		inventory,
		description,
		colors,
		sizes,
		categoryId,
		images,
	};
}

function getFormOrder(formData: FormData) {
	const orderDate = new Date(formData.get("orderDate") as string);
	const totalPrice = Number(formData.get("totalPrice"));
	const orderStatus = formData.get("orderStatus") as OrderStatus;
	const userId = String(formData.get("userId"));
	return { orderDate, totalPrice, orderStatus, userId };
}

function getFormCart(formData: FormData) {
	const userId = String(formData.get("userId"));
	const totalPrice = Number(formData.get("totalPrice"));
	return { userId, totalPrice };
}

function getFormCategory(formData: FormData) {
	const name = formData.get("name") as string;
	const audience = formData.get("audience") as Audience;
	return { name, audience };
}

function getFormCartItem(formData: FormData) {
	const quantity = Number(formData.get("quantity"));
	const unitPrice = Number(formData.get("unitPrice"));
	const cartId = Number(formData.get("cartId"));
	const productId = Number(formData.get("productId"));
	return { quantity, unitPrice, cartId, productId };
}

function getFormOrderItem(formData: FormData) {
	const quantity = Number(formData.get("quantity"));
	const unitPrice = Number(formData.get("unitPrice"));
	const orderId = Number(formData.get("orderId"));
	const productId = Number(formData.get("productId"));
	return { quantity, unitPrice, orderId, productId };
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

export { getFormEntity, getFormUser };
