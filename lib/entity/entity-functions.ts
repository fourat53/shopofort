import {
	EntityType,
	OptionField,
	type ParameterType,
	type StringNumber,
} from "./types";

function getTooltipEntity(name: OptionField): EntityType {
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
	getForeignKeyName,
	getParamValues,
	getPluralName,
	getSingleName,
	getTooltipEntity,
};
