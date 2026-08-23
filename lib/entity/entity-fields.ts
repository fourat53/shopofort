import { Gender, OrderStatus } from "@/lib/entity/types";
import type { EntityType } from "./current-entity";

type FieldCategory = "filter" | "create" | "edit";

type FieldType = "string" | "number" | "date" | "enum" | "foreignKey" | "image";

type ValueType = string | number | Date | undefined;

type EntityField = (typeof entityFields)[string][number];

type OptionField = "categoryId" | "productId" | "cartId" | "orderId" | "userId";

type FieldConfig = {
	name: string;
	type: FieldType;
	category: FieldCategory[];
	required?: boolean;
	defaultValue?: string | number;
	step?: string;
	options?: readonly (Gender | OrderStatus)[];
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
			category: ["filter"],
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
};

function getEntityFields(
	entity: EntityType | "",
	type: FieldCategory,
): FieldConfig[] {
	return entity
		? (entityFields[entity]?.filter((field) => field.category.includes(type)) ??
				[])
		: [];
}

type StringNumber = string | number;

function formatOptions(
	v: StringNumber,
	l: StringNumber | [StringNumber, StringNumber],
) {
	return { value: v.toString(), label: l };
}

export {
	type EntityField,
	entityFields,
	type FieldCategory,
	type FieldConfig,
	type FieldType,
	formatOptions,
	getEntityFields,
	type OptionField,
	type StringNumber,
	type ValueType,
};
