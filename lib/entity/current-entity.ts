import { usePathname } from "next/navigation";

type EntityType =
	| "user"
	| "cart"
	| "order"
	| "product"
	| "category"
	| "cartItem"
	| "orderItem";

function CurrentEntity(): EntityType | "" {
	const pathname = usePathname();

	if (pathname.includes("/users")) return "user";
	else if (pathname.includes("/products")) return "product";
	else if (pathname.includes("/orders")) return "order";
	else if (pathname.includes("/carts")) return "cart";
	else if (pathname.includes("/categories")) return "category";
	else if (pathname.includes("/cart-items")) return "cartItem";
	else if (pathname.includes("/order-items")) return "orderItem";

	return "";
}

function getTooltipEntity(headerName: string): EntityType | "" {
	if (headerName === "userId") return "user";
	else if (headerName === "productId") return "product";
	else if (headerName === "orderId") return "order";
	else if (headerName === "orderItemId") return "orderItem";
	else if (headerName === "cartItemId") return "cartItem";
	else if (headerName === "cartId") return "cart";
	else if (headerName === "categoryId") return "category";

	return "";
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
