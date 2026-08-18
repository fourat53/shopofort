type HeaderType = { name: string; width?: string }[];

const CARTS_HEADER: HeaderType = [
	{ name: "id", width: "150px" },
	{ name: "totalAmount" },
	{ name: "userId", width: "300px" },
];

const CART_ITEMS_HEADER: HeaderType = [
	{ name: "id", width: "150px" },
	{ name: "unitPrice", width: "150px" },
	{ name: "quantity", width: "150px" },
	{ name: "totalPrice" },
	{ name: "cartId", width: "150px" },
	{ name: "productId", width: "150px" },
];

const CATEGORIES_HEADER: HeaderType = [
	{ name: "id", width: "150px" },
	{ name: "name" },
	{ name: "gender", width: "300px" },
];

const ORDERS_HEADER: HeaderType = [
	{ name: "id", width: "150px" },
	{ name: "orderDate", width: "160px" },
	{ name: "totalAmount", width: "150px" },
	{ name: "orderStatus" },
	{ name: "userId", width: "255px" },
];

const ORDER_ITEMS_HEADER: HeaderType = [
	{ name: "id", width: "150px" },
	{ name: "price" },
	{ name: "quantity", width: "150px" },
	{ name: "orderId", width: "150px" },
	{ name: "productId", width: "150px" },
];

const PRODUCTS_HEADER: HeaderType = [
	{ name: "id", width: "108px" },
	{ name: "name", width: "160px" },
	{ name: "price", width: "100px" },
	{ name: "brand", width: "120px" },
	{ name: "inventory", width: "100px" },
	{ name: "description", width: "264px" },
	{ name: "categoryIf", width: "100px" },
	{ name: "images", width: "264px" },
];

const USERS_HEADER: HeaderType = [
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

function getHeaderFromName(name: string) {
	return name
		.replace(/([a-z0-9])([A-Z])/g, "$1 $2")
		.replace(/[_-]+/g, " ")
		.trim()
		.replace(/\b\w/g, (char) => char.toUpperCase());
}

export {
	CART_ITEMS_HEADER,
	CARTS_HEADER,
	CATEGORIES_HEADER,
	getHeaderFromName,
	type HeaderType,
	ORDER_ITEMS_HEADER,
	ORDERS_HEADER,
	PRODUCTS_HEADER,
	USERS_HEADER,
};
