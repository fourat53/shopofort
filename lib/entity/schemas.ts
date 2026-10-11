import { z } from "zod";
import { getFormEntity } from "@/lib/entity/forms";
import { EntityType } from "@/lib/entity/types";
import {
	Audience,
	OrderStatus,
	ProductColor,
	ProductSize,
} from "@/prisma/generated/prisma/enums";

// Zod Schemas
const decimal = z.coerce.number();

const UserSchema = z.object({
	id: z.string(),
	picture: z.string(),
	email: z.email(),
	first_name: z.string().min(3),
	last_name: z.string().min(3),
	is_suspended: z.boolean(),
	total_sign_ins: z.number().int().nonnegative(),
	failed_sign_ins: z.number().int().nonnegative(),
	last_signed_in: z.coerce.date(),
	created_on: z.coerce.date(),
	updated_on: z.coerce.date(),
});

const CategorySchema = z.object({
	id: z.number().int(),
	name: z.string().min(3, "Name must be at least 3 characters"),
	audience: z.enum(Audience),
});

const ProductSchema = z.object({
	id: z.number().int(),
	name: z.string().min(3, "Name must be at least 3 characters"),
	brand: z.string().min(3, "Brand must be at least 3 characters").nullable(),
	price: decimal.positive("Price must be positive"),
	inventory: z.coerce
		.number()
		.int()
		.nonnegative("Inventory cannot be negative"),
	description: z
		.string()
		.min(3, "Description must be at least 3 characters")
		.nullable(),
	colors: z.array(z.enum(ProductColor)),
	sizes: z.array(z.enum(ProductSize)),
	rating: decimal.nonnegative(),
	votes: z.number().int().nonnegative(),
	categoryId: z.coerce.number().int().positive("Category is required"),
	images: z.array(z.string()),
});

const ProductRatingSchema = z.object({
	userId: z.string(),
	productId: z.number().int(),
	rating: decimal.positive().max(5),
});

const CartSchema = z.object({
	id: z.number().int(),
	totalPrice: decimal.nonnegative(),
	userId: z.string(),
});

const CartItemSchema = z.object({
	id: z.number().int(),
	quantity: z.coerce.number().int().positive("Quantity must be positive"),
	color: z.enum(ProductColor).nullable(),
	size: z.enum(ProductSize).nullable(),
	cartId: z.coerce.number().int().positive("Cart ID is required"),
	productId: z.coerce.number().int().positive("Product ID is required"),
});

const OrderSchema = z.object({
	id: z.number().int(),
	orderDate: z.coerce.date(),
	totalPrice: decimal.nonnegative(),
	orderStatus: z.enum(OrderStatus),
	userId: z.string(),
});

const OrderItemSchema = z.object({
	id: z.number().int(),
	quantity: z.coerce.number().int().positive("Quantity must be positive"),
	color: z.enum(ProductColor).nullable(),
	size: z.enum(ProductSize).nullable(),
	orderId: z.coerce.number().int().positive("Order ID is required"),
	productId: z.coerce.number().int().positive("Product ID is required"),
});

export {
	CartItemSchema,
	CartSchema,
	CategorySchema,
	OrderItemSchema,
	OrderSchema,
	ProductRatingSchema,
	ProductSchema,
	UserSchema,
};

// FORM VALIDATION
const emptyToUndefined = (value: unknown) =>
	typeof value === "string" && value.trim() === "" ? undefined : value;

const nanToUndefined = (value: unknown) =>
	typeof value === "number" && Number.isNaN(value) ? undefined : value;

const optionalText = (message: string) =>
	z.preprocess(emptyToUndefined, z.string().min(3, message).optional());

const requiredId = (message: string) =>
	z.preprocess(
		nanToUndefined,
		z.number({ error: message }).int().positive(message),
	);

const requiredQuantity = () =>
	z.preprocess(
		nanToUndefined,
		z.number({ error: "is required" }).int().positive("must be positive"),
	);

const UserFormSchema = z.object({
	given_name: z.string().min(3, "must be at least 3 characters"),
	family_name: z.string().min(3, "must be at least 3 characters"),
	picture: z.preprocess(
		(value) =>
			typeof value === "string" && value.trim() !== "" ? value : undefined,
		z.string().optional(),
	),
	is_suspended: z.enum(["true", "false"], {
		error: "must be true or false",
	}),
});

const ProductFormSchema = z.object({
	name: z.string().min(3, "must be at least 3 characters"),
	brand: optionalText("must be at least 3 characters"),
	price: z.preprocess(
		nanToUndefined,
		z.number({ error: "is required" }).positive("must be positive"),
	),
	inventory: z.preprocess(
		nanToUndefined,
		z.number({ error: "is required" }).int().nonnegative("cannot be negative"),
	),
	description: optionalText("must be at least 3 characters"),
	colors: z.array(z.enum(ProductColor)).optional(),
	sizes: z.array(z.enum(ProductSize)).optional(),
	categoryId: requiredId("is required"),
});

const CategoryFormSchema = z.object({
	name: z.string().min(3, "must be at least 3 characters"),
	audience: z.enum(Audience, { error: "is required" }),
});

const CartFormSchema = z.object({
	userId: z.string().min(1, "is required"),
});

const OrderFormSchema = z.object({
	orderDate: z.preprocess(
		(value) =>
			value instanceof Date && Number.isNaN(value.getTime())
				? "invalid"
				: value,
		z.date({ error: "is required" }),
	),
	orderStatus: z.enum(OrderStatus, { error: "is required" }),
	userId: z.string().min(1, "is required"),
});

const CartItemFormSchema = z.object({
	quantity: requiredQuantity(),
	color: z.preprocess(emptyToUndefined, z.enum(ProductColor).optional()),
	size: z.preprocess(emptyToUndefined, z.enum(ProductSize).optional()),
	cartId: requiredId("is required"),
	productId: requiredId("is required"),
});

const OrderItemFormSchema = z.object({
	quantity: requiredQuantity(),
	color: z.preprocess(emptyToUndefined, z.enum(ProductColor).optional()),
	size: z.preprocess(emptyToUndefined, z.enum(ProductSize).optional()),
	orderId: requiredId("is required"),
	productId: requiredId("is required"),
});

const EntityCreateSchemas: Record<EntityType, z.ZodType> = {
	[EntityType.users]: z.never(),
	[EntityType.carts]: CartFormSchema,
	[EntityType.orders]: OrderFormSchema,
	[EntityType.products]: ProductFormSchema,
	[EntityType.categories]: CategoryFormSchema,
	[EntityType["cart-items"]]: CartItemFormSchema,
	[EntityType["order-items"]]: OrderItemFormSchema,
};

const EntityEditSchemas: Record<EntityType, z.ZodType> = {
	[EntityType.users]: UserFormSchema.partial(),
	[EntityType.carts]: CartFormSchema.partial(),
	[EntityType.orders]: OrderFormSchema.partial(),
	[EntityType.products]: ProductFormSchema.partial(),
	[EntityType.categories]: CategoryFormSchema.partial(),
	[EntityType["cart-items"]]: CartItemFormSchema.partial(),
	[EntityType["order-items"]]: OrderItemFormSchema.partial(),
};

type EntityFormValidation =
	| { success: true; data: Record<string, unknown> }
	| { success: false; fieldErrors: Record<string, string> };

function validateEntityForm(
	entity: EntityType,
	formData: FormData,
	category: "create" | "edit",
): EntityFormValidation {
	const schema =
		category === "create"
			? EntityCreateSchemas[entity]
			: EntityEditSchemas[entity];

	const parsed = schema.safeParse(getFormEntity(entity, formData));

	if (!parsed.success) {
		const fieldErrors: Record<string, string> = {};
		for (const issue of parsed.error.issues) {
			const field = issue.path.join(".");
			if (!fieldErrors[field]) fieldErrors[field] = issue.message;
		}
		return { success: false, fieldErrors };
	}

	return { success: true, data: parsed.data as Record<string, unknown> };
}

export type { EntityFormValidation };
export { validateEntityForm };
