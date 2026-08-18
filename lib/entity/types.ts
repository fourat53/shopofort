import type {
	Cart,
	CartItem as CartItemType,
	Category,
	CategoryName,
	Gender,
	Order,
	OrderItem as OrderItemType,
	OrderStatus,
	Product as ProductType,
} from "@/prisma/generated/prisma/client";

type User = {
	id: string;
	picture: string;
	email: string;
	first_name: string;
	last_name: string;
	is_suspended: boolean;
	total_sign_ins: number;
	failed_sign_ins: number;
	last_signed_in: Date;
	created_on: Date;
	updated_on: Date;
};

type PreferredUser = Omit<User, "email"> & { preferred_email: string };

type Product = Omit<ProductType, "price"> & { price: number };

type CartItem = Omit<CartItemType, "unitPrice" | "totalPrice"> & {
	unitPrice: number;
	totalPrice: number;
};

type OrderItem = Omit<OrderItemType, "price"> & { price: number };

type ParameterType = Record<string, string | string[] | undefined>;

export type {
	Cart,
	CartItem,
	Category,
	CategoryName,
	Gender,
	Order,
	OrderItem,
	OrderStatus,
	ParameterType,
	PreferredUser,
	Product,
	User,
};
