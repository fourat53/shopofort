import type {
	Cart,
	CartItem as CartItemType,
	Category,
	Order,
	OrderItem as OrderItemType,
	Product as ProductType,
	User as UserType,
} from "@/lib/generated/prisma/client";

type User = Omit<
	UserType,
	| "kindeId"
	| "providedId"
	| "givenName"
	| "familyName"
	| "password"
	| "createdOn"
	| "organizations"
	| "identities"
>;

type Product = Omit<ProductType, "price"> & { price: number };

type CartItem = Omit<CartItemType, "unitPrice" | "totalPrice"> & {
	unitPrice: number;
	totalPrice: number;
};

type OrderItem = Omit<OrderItemType, "price"> & { price: number };

export type { Cart, CartItem, Category, Order, OrderItem, Product, User };
