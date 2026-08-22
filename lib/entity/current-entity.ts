import { usePathname } from "next/navigation";

type EntityType =
	| "user"
	| "cart"
	| "order"
	| "product"
	| "category"
	| "cartItem"
	| "orderItem"
	| "";

function CurrentEntity(): EntityType {
	const pathname = usePathname();
	let entity: EntityType = "";

	if (pathname.includes("/users")) entity = "user";
	else if (pathname.includes("/products")) entity = "product";
	else if (pathname.includes("/orders")) entity = "order";
	else if (pathname.includes("/carts")) entity = "cart";
	else if (pathname.includes("/categories")) entity = "category";
	else if (pathname.includes("/cart-items")) entity = "cartItem";
	else if (pathname.includes("/order-items")) entity = "orderItem";

	return entity;
}

function getTooltipEntity(headerName: string): EntityType {
	let entity: EntityType = "";

	if (headerName === "userId") entity = "user";
	else if (headerName === "productId") entity = "product";
	else if (headerName === "orderId") entity = "order";
	else if (headerName === "orderItemId") entity = "orderItem";
	else if (headerName === "cartItemId") entity = "cartItem";
	else if (headerName === "cartId") entity = "cart";
	else if (headerName === "categoryId") entity = "category";

	return entity;
}

function getFieldName(name: string) {
	return name
		.replace(/([a-z0-9])([A-Z])/g, "$1 $2")
		.replace(/[_-]+/g, " ")
		.trim()
		.replace(/\b\w/g, (char) => char.toUpperCase());
}

function getSingleName(name: string) {
	return name
		.replace(/([a-z0-9])([A-Z])/g, "$1 $2")
		.replace(/[_-]+/g, " ")
		.trim()
		.toLowerCase();
}

function getPluralName(name: string) {
	const formatted = getSingleName(name);
	return formatted.endsWith("y")
		? `${formatted.slice(0, -1)}ies`
		: `${formatted}s`;
}

export {
	CurrentEntity,
	type EntityType,
	getFieldName,
	getPluralName,
	getSingleName,
	getTooltipEntity,
};
