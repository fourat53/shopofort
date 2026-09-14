import {
	type CellValue,
	EntityType,
	OptionField,
	type ParameterType,
	type StringNumber,
	type ValueType,
} from "@/lib/entity/types";

function getEntityTooltip(name: OptionField): EntityType {
	if (name === "userId") return EntityType.users;
	else if (name === "productId") return EntityType.products;
	else if (name === "orderId") return EntityType.orders;
	else if (name === "cartId") return EntityType.carts;
	else if (name === "categoryId") return EntityType.categories;
	else if (name === "cartItemId") return EntityType["cart-items"];
	else return EntityType["order-items"];
}

function getForeignKeyName(name: EntityType): OptionField {
	if (name === EntityType.users) return OptionField.userId;
	else if (name === EntityType.products) return OptionField.productId;
	else if (name === EntityType.orders) return OptionField.orderId;
	else if (name === EntityType.carts) return OptionField.cartId;
	else if (name === EntityType.categories) return OptionField.categoryId;
	else if (name === EntityType["cart-items"]) return OptionField.cartItemId;
	else return OptionField.orderItemId;
}

function getFieldName(name: string) {
	return name
		.replace(/([a-z0-9])([A-Z])/g, "$1 $2")
		.replace(/[_-]+/g, " ")
		.trim()
		.replace(/\b\w/g, (char) => char.toUpperCase());
}

function getFieldEntity(name: string) {
	return name
		.replace(/([a-z0-9])([A-Z])/g, "$1-$2")
		.replace(/[_\s]+/g, "-")
		.toLowerCase();
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

function isCellValue(value: ValueType, headerName: string): value is CellValue {
	if (
		value === null ||
		typeof value === "string" ||
		typeof value === "number" ||
		typeof value === "boolean" ||
		value instanceof Date ||
		["colors", "sizes", "images"].includes(headerName)
	)
		return true;

	return false;
}

function isTabValue(value: ValueType, name: string, field?: string): boolean {
	return (
		Array.isArray(value) &&
		(value.every((item) => typeof item === "object") || name === field)
	);
}

export {
	formatOption,
	getEntityTooltip,
	getFieldEntity,
	getFieldName,
	getForeignKeyName,
	getParamValues,
	getPluralName,
	getSingleName,
	isCellValue,
	isTabValue,
};
