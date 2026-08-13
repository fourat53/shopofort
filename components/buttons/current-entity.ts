import { usePathname } from "next/navigation";
import type {
	CategoryName,
	Gender,
	OrderStatus,
} from "@/lib/generated/prisma/enums";

type FieldCategory = "filter" | "create" | "edit";
type FieldType = "string" | "number" | "date" | "enum" | "foreignKey" | "image";

type FieldConfig = {
	name: string;
	label: string | string[];
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
			label: "ID",
			type: "string",
			category: ["filter"],
		},
		{
			name: "email",
			label: "Email",
			type: "string",
			category: ["filter", "edit"],
		},
		{
			name: "first_name",
			label: "First Name",
			type: "string",
			category: ["filter", "create", "edit"],
			required: true,
		},
		{
			name: "last_name",
			label: "Last Name",
			type: "string",
			category: ["filter", "create", "edit"],
			required: true,
		},
	],
	product: [
		{
			name: "id",
			label: "ID",
			type: "number",
			category: ["filter", "edit"],
		},
		{
			name: "name",
			label: "Name",
			type: "string",
			category: ["filter", "create", "edit"],
			required: true,
		},
		{
			name: "brand",
			label: "Brand",
			type: "string",
			category: ["filter", "create", "edit"],
		},
		{
			name: "price",
			label: "Price",
			type: "number",
			category: ["filter", "create", "edit"],
			defaultValue: 5,
			required: true,
			step: "0.01",
		},
		{
			name: "inventory",
			label: "Inventory",
			type: "number",
			category: ["filter", "create", "edit"],
			defaultValue: 1,
			required: true,
		},
		{
			name: "description",
			label: "Description",
			type: "string",
			category: ["create", "edit"],
		},
		{
			name: "categoryId",
			label: "Category",
			type: "foreignKey",
			category: ["filter", "create", "edit"],
		},
		{
			name: "images",
			label: "Images",
			type: "image",
			category: ["create", "edit"],
		},
	],
	cart: [
		{
			name: "id",
			label: "ID",
			type: "number",
			category: ["filter", "edit"],
		},
		{
			name: "totalAmount",
			label: "Total Amount",
			type: "number",
			category: ["filter", "create", "edit"],
			defaultValue: 1,
			required: true,
			step: "0.01",
		},
		{
			name: "userId",
			label: "User",
			type: "foreignKey",
			category: ["filter", "create", "edit"],
			required: true,
		},
	],
	cartItem: [
		{
			name: "id",
			label: "ID",
			type: "number",
			category: ["filter", "edit"],
		},
		{
			name: "quantity",
			label: "Quantity",
			type: "number",
			category: ["filter", "create", "edit"],
			required: true,
		},
		{
			name: "unitPrice",
			label: "Unit Price",
			type: "number",
			category: ["filter", "create", "edit"],
			required: true,
			step: "0.01",
		},
		{
			name: "totalPrice",
			label: "Total Price",
			type: "number",
			category: ["filter", "create", "edit"],
			required: true,
			step: "0.01",
		},
		{
			name: "cartId",
			label: "Cart",
			type: "foreignKey",
			category: ["filter", "create", "edit"],
			required: true,
		},
		{
			name: "productId",
			label: "Product",
			type: "foreignKey",
			category: ["filter", "create", "edit"],
			required: true,
		},
	],
	order: [
		{
			name: "id",
			label: "ID",
			type: "number",
			category: ["filter", "edit"],
		},
		{
			name: "orderDate",
			label: "Order Date",
			type: "date",
			category: ["filter", "create", "edit"],
			required: true,
		},
		{
			name: "totalAmount",
			label: "Total Amount",
			type: "number",
			category: ["filter", "create", "edit"],
			required: true,
			defaultValue: 1,
			step: "0.01",
		},
		{
			name: "orderStatus",
			label: "Order Status",
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
			label: "User",
			type: "foreignKey",
			category: ["filter", "create", "edit"],
			required: true,
		},
	],
	orderItem: [
		{
			name: "id",
			label: "ID",
			type: "number",
			category: ["filter", "edit"],
		},
		{
			name: "quantity",
			label: "Quantity",
			type: "number",
			category: ["filter", "create", "edit"],
			required: true,
		},
		{
			name: "price",
			label: "Price",
			type: "number",
			category: ["filter", "create", "edit"],
			required: true,
			step: "0.01",
		},
		{
			name: "orderId",
			label: "Order",
			type: "foreignKey",
			category: ["filter", "create", "edit"],
			required: true,
		},
		{
			name: "productId",
			label: "Product",
			type: "foreignKey",
			category: ["filter", "create", "edit"],
			required: true,
		},
	],
	category: [
		{
			name: "id",
			label: "ID",
			type: "number",
			category: ["filter", "edit"],
		},
		{
			name: "name",
			label: "Name",
			type: "enum",
			category: ["filter", "create", "edit"],
			enumValues: ["T_SHIRTS", "JEANS", "HOODIES", "DRESSES", "JACKETS"],
			required: true,
		},
		{
			name: "gender",
			label: "Gender",
			type: "enum",
			category: ["filter", "create", "edit"],
			enumValues: ["MALE", "FEMALE"],
			required: true,
		},
	],
};

function CurrentEntity() {
	const pathname = usePathname();
	let entity: string = "";

	if (pathname.includes("/users")) entity = "user";
	else if (pathname.includes("/products")) entity = "product";
	else if (pathname.includes("/orders")) entity = "order";
	else if (pathname.includes("/carts")) entity = "cart";
	else if (pathname.includes("/categories")) entity = "category";
	else if (pathname.includes("/cart-items")) entity = "cartItem";
	else if (pathname.includes("/order-items")) entity = "orderItem";

	return entity;
}

function entityFromHeaderName(headerName: string, pathname: string) {
	let entity = "";
	const lowerHeader = headerName.toLowerCase();

	if (lowerHeader.includes("user")) entity = "user";
	else if (lowerHeader.includes("product")) entity = "product";
	else if (lowerHeader.includes("order") && !lowerHeader.includes("item"))
		entity = "order";
	else if (lowerHeader.includes("order item")) entity = "orderItem";
	else if (lowerHeader.includes("cart item")) entity = "cartItem";
	else if (lowerHeader.includes("cart")) entity = "cart";
	else if (lowerHeader.includes("category")) entity = "category";
	else if (lowerHeader === "id") {
		if (pathname.includes("users")) entity = "user";
		else if (pathname.includes("products")) entity = "product";
		else if (pathname.includes("orders")) entity = "order";
		else if (pathname.includes("categories")) entity = "category";
		else if (pathname.includes("carts")) entity = "cart";
	}

	return entity;
}

export { CurrentEntity, entityFields, entityFromHeaderName, type FieldConfig };
