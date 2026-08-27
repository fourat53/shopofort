import { type EntityType, Gender, OrderStatus } from "@/lib/entity/types";

type FieldType = "string" | "number" | "date" | "enum" | "foreignKey" | "image";

type FieldCategory = "filter" | "create" | "edit";

type FieldConfig = {
	name: string;
	type: FieldType;
	category: FieldCategory[];
	required?: boolean;
	defaultValue?: string;
	step?: number;
	min?: number;
	max?: number;
	options?: readonly (Gender | OrderStatus)[];
};

const ENTITY_FIELDS: Record<EntityType, FieldConfig[]> = {
	users: [
		{
			name: "id",
			type: "foreignKey",
			category: ["filter"],
		},
		{
			name: "email",
			type: "string",
			category: ["filter"],
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
	products: [
		{
			name: "id",
			type: "foreignKey",
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
			defaultValue: "5",
			required: true,
			step: 0.01,
		},
		{
			name: "inventory",
			type: "number",
			category: ["filter", "create", "edit"],
			defaultValue: "1",
			required: true,
			min: 0,
			max: 1000,
		},
		{
			name: "description",
			type: "string",
			category: ["filter", "create", "edit"],
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
	carts: [
		{
			name: "id",
			type: "foreignKey",
			category: ["filter"],
		},
		{
			name: "totalAmount",
			type: "number",
			category: ["filter", "create", "edit"],
			defaultValue: "1",
			required: true,
			min: 0,
			max: 1000,
		},
		{
			name: "userId",
			type: "foreignKey",
			category: ["filter", "create", "edit"],
			required: true,
		},
	],
	orders: [
		{
			name: "id",
			type: "foreignKey",
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
			defaultValue: "1",
			min: 0,
			max: 1000,
		},
		{
			name: "orderStatus",
			type: "enum",
			category: ["filter", "create", "edit"],
			options: Object.values(OrderStatus),
			defaultValue: OrderStatus.PENDING,
		},
		{
			name: "userId",
			type: "foreignKey",
			category: ["filter", "create", "edit"],
			required: true,
		},
	],
	categories: [
		{
			name: "id",
			type: "foreignKey",
			category: ["filter"],
		},
		{
			name: "name",
			type: "string",
			category: ["filter", "create", "edit"],
			required: true,
		},
		{
			name: "gender",
			type: "enum",
			category: ["filter", "create", "edit"],
			options: Object.values(Gender),
			required: true,
		},
	],
	"cart-items": [
		{
			name: "id",
			type: "foreignKey",
			category: ["filter"],
		},
		{
			name: "quantity",
			type: "number",
			category: ["filter", "create", "edit"],
			required: true,
			min: 0,
			max: 1000,
		},
		{
			name: "unitPrice",
			type: "number",
			category: ["filter", "create", "edit"],
			required: true,
			step: 0.01,
		},
		{
			name: "totalPrice",
			type: "number",
			category: ["filter"],
			required: true,
			step: 0.01,
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
	"order-items": [
		{
			name: "id",
			type: "foreignKey",
			category: ["filter"],
		},
		{
			name: "quantity",
			type: "number",
			category: ["filter", "create", "edit"],
			required: true,
			min: 0,
			max: 1000,
		},
		{
			name: "price",
			type: "number",
			category: ["filter", "create", "edit"],
			required: true,
			step: 0.01,
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
};

function getEntityFields(
	entity: EntityType | "",
	type: FieldCategory,
): FieldConfig[] {
	if (!entity) return [];
	return ENTITY_FIELDS[entity].filter((field) => field.category.includes(type));
}

export { ENTITY_FIELDS, type FieldCategory, type FieldConfig, getEntityFields };
