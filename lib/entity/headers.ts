import { EntityType, ListEntityType } from "@/lib/entity/types";

type HeaderItem = { name: string; width: `${number}px` | "auto" };

const CARTS_HEADER: HeaderItem[] = [
	{ name: "id", width: "150px" },
	{ name: "totalPrice", width: "auto" },
	{ name: "userId", width: "260px" },
];

const CART_ITEMS_HEADER: HeaderItem[] = [
	{ name: "id", width: "150px" },
	{ name: "quantity", width: "150px" },
	{ name: "color", width: "150px" },
	{ name: "size", width: "150px" },
	{ name: "cartId", width: "150px" },
	{ name: "productId", width: "150px" },
];

const CATEGORIES_HEADER: HeaderItem[] = [
	{ name: "id", width: "150px" },
	{ name: "name", width: "auto" },
	{ name: "audience", width: "300px" },
];

const ORDERS_HEADER: HeaderItem[] = [
	{ name: "id", width: "150px" },
	{ name: "orderDate", width: "170px" },
	{ name: "totalPrice", width: "150px" },
	{ name: "orderStatus", width: "auto" },
	{ name: "userId", width: "260px" },
];

const ORDER_ITEMS_HEADER: HeaderItem[] = [
	{ name: "id", width: "150px" },
	{ name: "quantity", width: "150px" },
	{ name: "color", width: "150px" },
	{ name: "size", width: "150px" },
	{ name: "orderId", width: "150px" },
	{ name: "productId", width: "150px" },
];

const PRODUCTS_HEADER: HeaderItem[] = [
	{ name: "id", width: "108px" },
	{ name: "name", width: "160px" },
	{ name: "brand", width: "120px" },
	{ name: "price", width: "100px" },
	{ name: "inventory", width: "100px" },
	{ name: "description", width: "264px" },
	{ name: "colors", width: "264px" },
	{ name: "sizes", width: "180px" },
	{ name: "rating", width: "100px" },
	{ name: "votes", width: "100px" },
	{ name: "categoryId", width: "100px" },
	{ name: "images", width: "264px" },
];

const USERS_HEADER: HeaderItem[] = [
	{ name: "id", width: "255px" },
	{ name: "picture", width: " 72px" },
	{ name: "email", width: "264px" },
	{ name: "first_name", width: "120px" },
	{ name: "last_name", width: "120px" },
	{ name: "is_suspended", width: " 110px" },
	{ name: "total_sign_ins", width: "120px" },
	{ name: "failed_sign_ins", width: "120px" },
	{ name: "last_signed_in", width: "170px" },
	{ name: "created_on", width: "170px" },
	{ name: "updated_on", width: "170px" },
];

const RATINGS_HEADER: HeaderItem[] = [
	{ name: "userId", width: "260px" },
	{ name: "productId", width: "150px" },
	{ name: "rating", width: "auto" },
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

function getListHeader(entity: ListEntityType): HeaderItem[] {
	if (entity === ListEntityType.products) return PRODUCTS_HEADER;
	else if (entity === ListEntityType["cart-items"]) return CART_ITEMS_HEADER;
	else if (entity === ListEntityType["order-items"]) return ORDER_ITEMS_HEADER;
	else if (entity === ListEntityType.ratings) return RATINGS_HEADER;
	return [];
}

export {
	CART_ITEMS_HEADER,
	CARTS_HEADER,
	CATEGORIES_HEADER,
	getHeader,
	getListHeader,
	type HeaderItem,
	ORDER_ITEMS_HEADER,
	ORDERS_HEADER,
	PRODUCTS_HEADER,
	RATINGS_HEADER,
	USERS_HEADER,
};
