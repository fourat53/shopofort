import { z } from "zod";
import {
	Audience,
	OrderStatus,
	ProductColor,
	ProductSize,
} from "@/prisma/generated/prisma/enums";

// Zod Schemas
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
	price: z.coerce.number().positive("Price must be positive"),
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
	rating: z.coerce.number().nonnegative(),
	votes: z.number().int().nonnegative(),
	categoryId: z.coerce.number().int().positive("Category is required"),
	images: z.array(z.string()),
});

const ProductRatingSchema = z.object({
	userId: z.string(),
	productId: z.number().int(),
	rating: z.coerce.number().positive().max(5),
});

const CartSchema = z.object({
	id: z.number().int(),
	totalPrice: z.coerce.number().nonnegative(),
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
	totalPrice: z.coerce.number().nonnegative(),
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
