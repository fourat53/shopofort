import type { EntityType } from "@/lib/entity/current-entity";
import type { CategoryName, Gender, OrderStatus } from "@/lib/entity/types";

function getFormUser(formData: FormData) {
	const picture = formData.get("picture") as string;
	const first_name = formData.get("first_name") as string;
	const last_name = formData.get("last_name") as string;
	const is_suspended = formData.get("is_suspended") as string;
	return { picture, first_name, last_name, is_suspended };
}

function getFormProduct(formData: FormData) {
	const name = formData.get("name") as string;
	const brand = formData.get("brand") as string;
	const price = Number(formData.get("price"));
	const inventory = Number(formData.get("inventory"));
	const description = formData.get("description") as string;
	const categoryId = Number(formData.get("categoryId"));
	return { name, brand, price, inventory, description, categoryId };
}

function getFormOrder(formData: FormData) {
	const orderDate = new Date(formData.get("orderDate") as string);
	const totalAmount = Number(formData.get("totalAmount"));
	const orderStatus = formData.get("orderStatus") as OrderStatus;
	const userId = String(formData.get("userId"));
	return { orderDate, totalAmount, orderStatus, userId };
}

function getFormCart(formData: FormData) {
	const userId = String(formData.get("userId"));
	const totalAmount = Number(formData.get("totalAmount")) || 0;
	return { userId, totalAmount };
}

function getFormCategory(formData: FormData) {
	const name = formData.get("name") as CategoryName;
	const gender = formData.get("gender") as Gender;
	return { name, gender };
}

function getFormCartItem(formData: FormData) {
	const quantity = Number(formData.get("quantity"));
	const unitPrice = Number(formData.get("unitPrice"));
	const totalPrice = Number(formData.get("totalPrice"));
	const cartId = Number(formData.get("cartId"));
	const productId = Number(formData.get("productId"));
	return { quantity, unitPrice, totalPrice, cartId, productId };
}

function getFormOrderItem(formData: FormData) {
	const quantity = Number(formData.get("quantity"));
	const price = Number(formData.get("price"));
	const orderId = Number(formData.get("orderId"));
	const productId = Number(formData.get("productId"));
	return { quantity, price, orderId, productId };
}

function getFormEntity(entity: EntityType, formData: FormData) {
	switch (entity) {
		case "product":
			return getFormProduct(formData);
		case "order":
			return getFormOrder(formData);
		case "cart":
			return getFormCart(formData);
		case "category":
			return getFormCategory(formData);
		case "cartItem":
			return getFormCartItem(formData);
		case "orderItem":
			return getFormOrderItem(formData);
	}
}

export { getFormEntity, getFormUser };
