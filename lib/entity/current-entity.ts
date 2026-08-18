import { usePathname } from "next/navigation";
import type { CategoryName, Gender, OrderStatus } from "@/lib/entity/types";

type FieldCategory = "filter" | "create" | "edit";
type FieldType = "string" | "number" | "date" | "enum" | "foreignKey" | "image";

type FieldConfig = {
	name: string;
	type: FieldType;
	category: FieldCategory[];
	required?: boolean;
	defaultValue?: string | number;
	step?: string;
	enumValues?: readonly (OrderStatus | Gender | CategoryName)[];
};

const entityFields: Record<string, FieldConfig[]> = {
	user: [
		{
			name: "id",
			type: "string",
			category: ["filter"],
		},
		{
			name: "email",
			type: "string",
			category: ["filter", "edit"],
		},
		{
			name: "first_name",
			type: "string",
			category: ["filter", "create", "edit"],
			required: true,
		},
		{
			name: "last_name",
			type: "string",
			category: ["filter", "create", "edit"],
			required: true,
		},
	],
	product: [
		{
			name: "id",
			type: "number",
			category: ["filter"],
		},
		{
			name: "name",
			type: "string",
			category: ["filter", "create", "edit"],
			required: true,
		},
		{
			name: "brand",
			type: "string",
			category: ["filter", "create", "edit"],
		},
		{
			name: "price",
			type: "number",
			category: ["filter", "create", "edit"],
			defaultValue: 5,
			required: true,
			step: "0.01",
		},
		{
			name: "inventory",
			type: "number",
			category: ["filter", "create", "edit"],
			defaultValue: 1,
			required: true,
		},
		{
			name: "description",
			type: "string",
			category: ["create", "edit"],
		},
		{
			name: "categoryId",
			type: "foreignKey",
			category: ["filter", "create", "edit"],
		},
		{
			name: "images",
			type: "image",
			category: ["create", "edit"],
		},
	],
	cart: [
		{
			name: "id",
			type: "number",
			category: ["filter"],
		},
		{
			name: "totalAmount",
			type: "number",
			category: ["filter", "create", "edit"],
			defaultValue: 1,
			required: true,
			step: "0.01",
		},
		{
			name: "userId",
			type: "foreignKey",
			category: ["filter", "create", "edit"],
			required: true,
		},
	],
	cartItem: [
		{
			name: "id",
			type: "number",
			category: ["filter"],
		},
		{
			name: "quantity",
			type: "number",
			category: ["filter", "create", "edit"],
			required: true,
		},
		{
			name: "unitPrice",
			type: "number",
			category: ["filter", "create", "edit"],
			required: true,
			step: "0.01",
		},
		{
			name: "totalPrice",
			type: "number",
			category: ["filter", "create", "edit"],
			required: true,
			step: "0.01",
		},
		{
			name: "cartId",
			type: "foreignKey",
			category: ["filter", "create", "edit"],
			required: true,
		},
		{
			name: "productId",
			type: "foreignKey",
			category: ["filter", "create", "edit"],
			required: true,
		},
	],
	order: [
		{
			name: "id",
			type: "number",
			category: ["filter"],
		},
		{
			name: "orderDate",
			type: "date",
			category: ["filter", "create", "edit"],
			required: true,
		},
		{
			name: "totalAmount",
			type: "number",
			category: ["filter", "create", "edit"],
			required: true,
			defaultValue: 1,
			step: "0.01",
		},
		{
			name: "orderStatus",
			type: "enum",
			category: ["filter", "create", "edit"],
			enumValues: [
				"PENDING",
				"PROCESSING",
				"SHIPPED",
				"DELIVERED",
				"CANCELLED",
			],
			defaultValue: "PENDING",
		},
		{
			name: "userId",
			type: "foreignKey",
			category: ["filter", "create", "edit"],
			required: true,
		},
	],
	orderItem: [
		{
			name: "id",
			type: "number",
			category: ["filter"],
		},
		{
			name: "quantity",
			type: "number",
			category: ["filter", "create", "edit"],
			required: true,
		},
		{
			name: "price",
			type: "number",
			category: ["filter", "create", "edit"],
			required: true,
			step: "0.01",
		},
		{
			name: "orderId",
			type: "foreignKey",
			category: ["filter", "create", "edit"],
			required: true,
		},
		{
			name: "productId",
			type: "foreignKey",
			category: ["filter", "create", "edit"],
			required: true,
		},
	],
	category: [
		{
			name: "id",
			type: "number",
			category: ["filter"],
		},
		{
			name: "name",
			type: "enum",
			category: ["filter", "create", "edit"],
			enumValues: ["T_SHIRTS", "JEANS", "HOODIES", "DRESSES", "JACKETS"],
			required: true,
		},
		{
			name: "gender",
			type: "enum",
			category: ["filter", "create", "edit"],
			enumValues: ["MALE", "FEMALE"],
			required: true,
		},
	],
};

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

function TooltipEntity(headerName: string): EntityType {
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

export { CurrentEntity, type EntityType, entityFields, TooltipEntity };
