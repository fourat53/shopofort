import {
	audiences,
	type BooleanEnum,
	booleanValues,
	orderStatuses,
	productColors,
	productSizes,
} from "@/lib/entity/data";
import {
	type Audience,
	type EntityType,
	OrderStatus,
	type ProductColor,
	type ProductSize,
} from "@/lib/entity/types";

type FieldType =
	| "string"
	| "number"
	| "date"
	| "enum"
	| "foreignKey"
	| "images"
	| "image";

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
	options?: readonly (
		| BooleanEnum
		| Audience
		| OrderStatus
		| ProductColor
		| ProductSize
	)[];
	multiple?: boolean;
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
			name: "picture",
			type: "image",
			category: ["edit"],
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
		{
			name: "is_suspended",
			type: "enum",
			options: booleanValues,
			category: ["filter", "edit"],
		},
		{
			name: "total_sign_ins",
			type: "number",
			category: ["filter"],
		},
		{
			name: "failed_sign_ins",
			type: "number",
			category: ["filter"],
		},
		{
			name: "last_signed_in",
			type: "date",
			category: ["filter"],
		},
		{
			name: "created_on",
			type: "date",
			category: ["filter"],
		},
		{
			name: "updated_on",
			type: "date",
			category: ["filter"],
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
			step: 0.05,
			max: 10000,
		},
		{
			name: "inventory",
			type: "number",
			category: ["filter", "create", "edit"],
			required: true,
		},
		{
			name: "description",
			type: "string",
			category: ["filter", "create", "edit"],
		},
		{
			name: "colors",
			type: "enum",
			category: ["filter", "create", "edit"],
			options: productColors,
			multiple: true,
		},
		{
			name: "sizes",
			type: "enum",
			category: ["filter", "create", "edit"],
			options: productSizes,
			multiple: true,
		},
		{
			name: "rating",
			type: "number",
			step: 0.05,
			max: 5,
			category: ["filter"],
		},
		{
			name: "categoryId",
			type: "foreignKey",
			category: ["filter", "create", "edit"],
		},
		{
			name: "images",
			type: "images",
			multiple: true,
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
			name: "totalPrice",
			type: "number",
			step: 0.05,
			max: 10000,
			category: ["filter"],
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
			name: "totalPrice",
			type: "number",
			step: 0.05,
			max: 10000,
			category: ["filter"],
		},
		{
			name: "orderStatus",
			type: "enum",
			category: ["filter", "create", "edit"],
			options: orderStatuses,
			defaultValue: OrderStatus.PENDING,
			required: true,
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
			name: "audience",
			type: "enum",
			category: ["filter", "create", "edit"],
			options: audiences,
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
		},
		{
			name: "unitPrice",
			type: "number",
			category: ["filter", "create", "edit"],
			required: true,
			step: 0.05,
			max: 10000,
		},
		{
			name: "totalPrice",
			type: "number",
			category: ["filter"],
			required: true,
			step: 0.05,
			max: 10000,
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
		},
		{
			name: "price",
			type: "number",
			category: ["filter", "create", "edit"],
			required: true,
			step: 0.05,
			max: 10000,
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
