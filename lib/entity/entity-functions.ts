import { EntityType, type ParameterType, type StringNumber } from "./types";

function getTooltipEntity(headerName: string): EntityType | "" {
	if (headerName === "userId") return EntityType.users;
	else if (headerName === "productId") return EntityType.products;
	else if (headerName === "orderId") return EntityType.orders;
	else if (headerName === "cartId") return EntityType.carts;
	else if (headerName === "categoryId") return EntityType.categories;
	else if (headerName === "cartItemId") return EntityType["cart-items"];
	else if (headerName === "orderItemId") return EntityType["order-items"];
	return "";
}

function getFieldName(name: string) {
	return name
		.replace(/([a-z0-9])([A-Z])/g, "$1 $2")
		.replace(/[_-]+/g, " ")
		.trim()
		.replace(/\b\w/g, (char) => char.toUpperCase());
}

function getPluralName(name: EntityType) {
	return name.replace(/-/g, " ");
}

function getSingleName(name: EntityType) {
	const formatted = getPluralName(name);
	return formatted === "categories" ? "category" : formatted.slice(0, -1);
}

function getParamValues(param: ParameterType[string]): string[] {
	if (!param) return [];
	return Array.isArray(param) ? param : [param];
}

function formatOption(
	v: StringNumber,
	l: StringNumber | [StringNumber, StringNumber],
) {
	return { value: v.toString(), label: l };
}

export {
	formatOption,
	getFieldName,
	getParamValues,
	getPluralName,
	getSingleName,
	getTooltipEntity,
};
