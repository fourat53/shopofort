import { EntityType } from "./types";

type HeaderItem = { name: string; width?: string };

const CARTS_HEADER: HeaderItem[] = [
	{ name: "id", width: "150px" },
	{ name: "totalAmount" },
	{ name: "userId", width: "300px" },
];

const CART_ITEMS_HEADER: HeaderItem[] = [
	{ name: "id", width: "150px" },
	{ name: "unitPrice", width: "150px" },
	{ name: "quantity", width: "150px" },
	{ name: "totalPrice" },
	{ name: "cartId", width: "150px" },
	{ name: "productId", width: "150px" },
];

const CATEGORIES_HEADER: HeaderItem[] = [
	{ name: "id", width: "150px" },
	{ name: "name" },
	{ name: "gender", width: "300px" },
];

const ORDERS_HEADER: HeaderItem[] = [
	{ name: "id", width: "150px" },
	{ name: "orderDate", width: "160px" },
	{ name: "totalAmount", width: "150px" },
	{ name: "orderStatus" },
	{ name: "userId", width: "255px" },
];

const ORDER_ITEMS_HEADER: HeaderItem[] = [
	{ name: "id", width: "150px" },
	{ name: "price" },
	{ name: "quantity", width: "150px" },
	{ name: "orderId", width: "150px" },
	{ name: "productId", width: "150px" },
];

const PRODUCTS_HEADER: HeaderItem[] = [
	{ name: "id", width: "108px" },
	{ name: "name", width: "160px" },
	{ name: "price", width: "100px" },
	{ name: "brand", width: "120px" },
	{ name: "inventory", width: "100px" },
	{ name: "description", width: "264px" },
	{ name: "categoryId", width: "100px" },
	{ name: "images", width: "264px" },
];

const USERS_HEADER: HeaderItem[] = [
	{ name: "id", width: "255px" },
	{ name: "picture", width: " 72px" },
	{ name: "email", width: "264px" },
	{ name: "first_name", width: "120px" },
	{ name: "last_name", width: "120px" },
	{ name: "suspended", width: " 100px" },
	{ name: "total_sign_ins", width: "120px" },
	{ name: "failed_sign_ins", width: "120px" },
	{ name: "last_signed_in", width: "160px" },
	{ name: "created_on", width: "160px" },
	{ name: "updated_on", width: "160px" },
];

function getHeader(entity: EntityType): HeaderItem[] {
	if (entity === EntityType.users) return USERS_HEADER;
	else if (entity === EntityType.products) return PRODUCTS_HEADER;
	else if (entity === EntityType.carts) return CARTS_HEADER;
	else if (entity === EntityType.orders) return ORDERS_HEADER;
	else if (entity === EntityType.categories) return CATEGORIES_HEADER;
	else if (entity === EntityType["cart-items"]) return CART_ITEMS_HEADER;
	else if (entity === EntityType["order-items"]) return ORDER_ITEMS_HEADER;
	return [];
}

export {
	CART_ITEMS_HEADER,
	CARTS_HEADER,
	CATEGORIES_HEADER,
	getHeader,
	type HeaderItem,
	ORDER_ITEMS_HEADER,
	ORDERS_HEADER,
	PRODUCTS_HEADER,
	USERS_HEADER,
};
